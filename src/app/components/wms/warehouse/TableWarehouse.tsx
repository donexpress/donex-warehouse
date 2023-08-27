import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
} from "@nextui-org/react";
import PaginationTable from "../../common/Pagination";
import { PlusIcon } from "./../../common/PlusIcon";
import { VerticalDotsIcon } from "./../../common/VerticalDotsIcon";
import { ChevronDownIcon } from "./../../common/ChevronDownIcon";
import { SearchIcon } from "./../../common/SearchIcon";
import { capitalize } from "../../../../helpers/utils";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
import { FaSearch, FaEye, FaPen } from "react-icons/fa";
import { FaCirclePlus, FaTrashCan } from "react-icons/fa6";
import {
  getWarehouses,
  removeWarehouseById,
} from "../../../../services/api.warehouse";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import {
  WarehouseListProps,
  CargoStationWarehouseForm,
} from "../../../../types";
import "./../../../../styles/generic.input.scss";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "principal",
  "receiving_area",
  "actions",
];

const WarehouseTable = ({
  warehouseList,
  states,
  countries,
  receptionAreas,
}: WarehouseListProps) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [warehouses, setWarehouses] = useState<CargoStationWarehouseForm[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);

  /** start*/
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const columns = [
    { name: intl.formatMessage({ id: "name" }), uid: "name", sortable: true },
    {
      name: intl.formatMessage({ id: "principal" }),
      uid: "principal",
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: "receiving_area" }),
      uid: "receiving_area",
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: "state" }),
      uid: "state_id",
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: "country" }),
      uid: "country",
      sortable: true,
    },
    { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...warehouses];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.principal
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          user.state_id
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          user.receiving_area
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          user.country
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [warehouses, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort(
      (a: CargoStationWarehouseForm, b: CargoStationWarehouseForm) => {
        const first = a[
          sortDescriptor.column as keyof CargoStationWarehouseForm
        ] as number;
        const second = b[
          sortDescriptor.column as keyof CargoStationWarehouseForm
        ] as number;
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    );
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "receiving_area":
        return getReceptionAreaLabel(cellValue);
      case "state_id":
        return getStateLabel(cellValue);
      case "country":
        return getCountryLabel(cellValue);
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleShow(Number(user["id"]))}>
                  View
                </DropdownItem>
                <DropdownItem onClick={() => handleEdit(Number(user["id"]))}>
                  Edit
                </DropdownItem>
                <DropdownItem onClick={() => handleDelete(Number(user["id"]))}>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[33%] search-input"
            placeholder=""
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="bnt-select"
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {intl.formatMessage({ id: "columns" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => handleAdd()}
            >
              {intl.formatMessage({ id: "create" })}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {warehouses.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="outline-none text-default-400 text-small m-1"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    warehouses.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <PaginationTable
          totalRecords={100}
          pageLimit={5}
          pageNeighbours={1}
          onPageChanged={() => {}}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  /** end*/

  useEffect(() => {
    setWarehouses(warehouseList);
  }, []);

  const getStateLabel = (stateId: number | null) => {
    if (stateId !== null && states.length > 0) {
      const filter = states.filter((state) => state.id === stateId);
      if (filter.length > 0) {
        return filter[0].name;
      }
    }
    return stateId;
  };

  const getCountryLabel = (countryId: string) => {
    if (countryId !== null && countries.length > 0) {
      const filter = countries.filter((country) => country.name === countryId);
      if (filter.length > 0) {
        return filter[0].emoji + " " + filter[0].name;
      }
    }
    return countryId;
  };

  const getReceptionAreaLabel = (receptionAreaId: string) => {
    if (receptionAreaId !== null && receptionAreas.length > 0) {
      const filter = receptionAreas.filter(
        (receptionArea) => receptionArea.name === receptionAreaId
      );
      if (filter.length > 0) {
        return filter[0].name;
      }
    }
    return receptionAreaId;
  };

  const loadWarehouses = async () => {
    const whs = await getWarehouses();
    setWarehouses(whs ? whs : []);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    router.push(`/${locale}/wms/warehouse_cargo_station/${id}/update`);
  };

  const handleShow = (id: number) => {
    router.push(`/${locale}/wms/warehouse_cargo_station/${id}/show`);
  };

  const handleAdd = () => {
    router.push(`/${locale}/wms/warehouse_cargo_station/insert`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    const reponse = await removeWarehouseById(deleteElement);
    close();
    await loadWarehouses();
  };

  return (
    <>
      <Table
        aria-label="WARE-HOUSE"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No ware house found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {showConfirm && <ConfirmationDialog close={close} confirm={confirm} />}
    </>
  );
};

export default WarehouseTable;
