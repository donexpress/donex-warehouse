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
  indexStateWarehouse,
  removeWarehouseById,
} from "../../../../services/api.warehouse";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import {
  WarehouseListProps,
  CargoStationWarehouseForm,
  StateWarehouse,
  Country,
} from "../../../../types";
import "./../../../../styles/generic.input.scss";
import { indexCountries } from "@/services/api.countrieserege1992";
import { getRegionalDivision } from "@/services/api.regional_divisionerege1992";
import { Loading } from "../../common/Loading";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "principal",
  "receiving_area",
  "state",
  "actions",
];

const getLabelByLanguage = (state: StateWarehouse, locale: string): string => {
  if (locale === 'es') {
    return state.es_name;
  } else if (locale === 'zh') {
    return state.zh_name;
  }
  return state.name;
};

const getStateList = (states: StateWarehouse[], locale: string):{ name: string, uid: string}[] => {
  return states.map((state: StateWarehouse) => {
    return {
      name: getLabelByLanguage(state, locale),
      uid: state.value,
    }
  })
}

const WarehouseTable = ({ states }: WarehouseListProps) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [warehouses, setWarehouses] = useState<CargoStationWarehouseForm[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [receptionAreas, setReceptionAreas] = useState<any>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);

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

  const [statusOptions, setStatusOptions] = React.useState<{ name: string, uid: string}[]>(getStateList(states, String(locale)));

  const [page, setPage] = useState(1);

  const columns = React.useMemo(() => {
    return [
      { name: intl.formatMessage({ id: "name" }), uid: "name", sortable: false },
      {
        name: intl.formatMessage({ id: "principal" }),
        uid: "principal",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "receiving_area" }),
        uid: "receiving_area",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "state" }),
        uid: "state",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "country" }),
        uid: "country",
        sortable: false,
      },
      { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ];
  }, [intl]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, intl]);

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
          user.state
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
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        // @ts-ignore
        Array.from(statusFilter).includes(user.state ? String(user.state.value) : '')
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

  const getLabelByLanguage = (state: any) => {
    if (locale === 'es') {
      return state.es_name;
    } else if (locale === 'zh') {
      return state.zh_name;
    }
    return state.name;
  };

  const renderCell = React.useCallback(
    (user: any, columnKey: React.Key) => {
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "receiving_area":
          return getReceptionAreaLabel(cellValue);
        case "state":
          return user.state ? getLabelByLanguage(user.state) : '';
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
                    {intl.formatMessage({ id: "View" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleEdit(Number(user["id"]))}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleDelete(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [intl]
  );

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
                  {intl.formatMessage({ id: "filters" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
            {intl.formatMessage(
              { id: "total_results" },
              { in: warehouses.length }
            )}
          </span>
          <label className="flex items-center text-default-400 text-small">
            {intl.formatMessage({ id: "rows_page" })}
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
    intl,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? `${intl.formatMessage({ id: "selected_all" })}`
            : `${intl.formatMessage(
                { id: "selected" },
                { in: selectedKeys.size, end: filteredItems.length }
              )}`}
        </span>
        <PaginationTable
          totalRecords={filteredItems.slice(0, warehouses.length).length}
          pageLimit={rowsPerPage}
          pageNeighbours={1}
          page={page}
          onPageChanged={setPage}
        />
      </div>
    );
  }, [
    selectedKeys,
    items.length,
    warehouses.length,
    intl,
    rowsPerPage,
    page,
    pages,
    hasSearchFilter,
    onSearchChange,
    onRowsPerPageChange,
    intl,
  ]);
  /** end*/

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    setStatusOptions(getStateList(states, String(locale)));
  }, [locale, states]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

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
        (receptionArea: { name: string }) =>
          receptionArea.name === receptionAreaId
      );
      if (filter.length > 0) {
        return filter[0].name;
      }
    }
    return receptionAreaId;
  };

  const loadWarehouses = async () => {
    setLoading(true);
    const whs = await getWarehouses();
    const _countries = await indexCountries();
    const _receptionAreas = await getRegionalDivision();
    setWarehouses(whs ? whs : []);
    setCountries(_countries ? _countries : []);
    setReceptionAreas(_receptionAreas ? _receptionAreas : []);
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/warehouse_cargo_station/${id}/update`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/warehouse_cargo_station/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/wms/warehouse_cargo_station/insert`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const reponse = await removeWarehouseById(deleteElement);
    close();
    await loadWarehouses();
    setLoading(false);
  };

  return (
    <>
      <Loading loading={loading}>
        <Table
          aria-label="WARE-HOUSE"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[auto]",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
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
          <TableBody
            emptyContent={`${intl.formatMessage({ id: "no_results_found" })}`}
            items={items}
          >
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
      </Loading>
    </>
  );
};

export default WarehouseTable;
