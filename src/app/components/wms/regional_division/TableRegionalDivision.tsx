import React, { useEffect, useState } from "react";
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
  Chip,
  Selection,
  ChipProps,
} from "@nextui-org/react";
import { PlusIcon } from "./../../common/PlusIcon";
import { VerticalDotsIcon } from "./../../common/VerticalDotsIcon";
import { ChevronDownIcon } from "./../../common/ChevronDownIcon";
import { SearchIcon } from "./../../common/SearchIcon";
import { capitalize } from "../../../../helpers/utils";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import PaginationTable from "../../common/Pagination";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import {RegionalDivision, RegionalDivisionListProps} from "../../../../types/regional_division";
import { countDivision, getRegionalDivision } from "@/services/api.regional_divisionerege1992";
import {removeDivision} from "../../../../services/api.regional_division";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "area_code",
  "name",
  "company",
  "contain_country",
  "actions",
];

const TableRegionalDivision = ({ regionalDivisionsTypes, divisionsCount }: RegionalDivisionListProps) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [regionalDivisions, setRegionalDivisions] = useState<RegionalDivision[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusSelected, setStatusSelected] = useState<string>(regionalDivisionsTypes[0].value);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [regDivisionsCount, setRegDivisionsCount] = useState(divisionsCount);

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

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      {
        name: intl.formatMessage({ id: "area_code" }),
        uid: "area_code",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "area_name" }),
        uid: "name",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "company" }),
        uid: "company",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "contain_country" }),
        uid: "contain_country",
        sortable: true,
      },
      { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ];

    return columns;
  }, [intl]);

  const headerColumns = React.useMemo(() => {
    const columns = getColumns;
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, intl]);

  const filteredItems = React.useMemo(() => {
    let filteredRegionalDivisions = [...regionalDivisions];

    if (hasSearchFilter) {
      filteredRegionalDivisions = filteredRegionalDivisions.filter(
        (divisionR) =>
            divisionR.name
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
            divisionR.area_code
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase())
      );
    }

    return filteredRegionalDivisions;
  }, [regionalDivisions, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback(
    (divisionR: any, columnKey: React.Key) => {
      const cellValue = divisionR[columnKey];
      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[divisionR.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
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
                  <DropdownItem onClick={() => handleShow(divisionR["id"])}>
                    {intl.formatMessage({ id: "View" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleEdit(divisionR["id"])}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDelete(divisionR["id"])}>
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
    [intl, statusSelected]
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

  const changeTab = async(tab: string) => {
    if (tab !== statusSelected && !loadingItems) {
      await setStatusSelected(tab);
      await setLoadingItems(true);
      const regionalDivisionss = await getRegionalDivision();
      // const filteredRD = regionalDivisionss

      await setLoadingItems(false);
      await setRegionalDivisions(regionalDivisionss !== null ? regionalDivisionss : []);
    }
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-2">
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
                {getColumns.map((column) => (
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
            {intl.formatMessage({ id: "total_results" }, { in: regionalDivisions.length })}
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
        <div className="bg-gray-200 pt-1">
          <div className="overflow-x-auto tab-system-table bg-content1">
            <ul className="flex space-x-4">
              {regionalDivisionsTypes.map((column, index) => (
                  <li key={index} className="whitespace-nowrap">
                    <button className={ statusSelected === column.value ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                      onClick={() => changeTab(column.value)}>
                      {column.label}
                    </button>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    regionalDivisions.length,
    hasSearchFilter,
    intl,
    statusSelected,
    selectedItems,
    regDivisionsCount,
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
          totalRecords={filteredItems.slice(0, regionalDivisions.length).length}
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
    items.length,
    page,
    regionalDivisions.length,
    rowsPerPage,
    hasSearchFilter,
    intl,
  ]);
  /** end*/

  useEffect(() => {
    loadRegionalDivisions();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadRegionalDivisions = async (loadCount: boolean = false) => {
    setLoading(true);
    const regionalDivisionss = await getRegionalDivision();

    setRegionalDivisions(regionalDivisionss !== null ? regionalDivisionss : []);
    if (loadCount) {
      const divisionCount = await countDivision();
      setRegDivisionsCount(divisionCount ? divisionCount : undefined);
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/regional_division/${id}/update`);
  };

  const handleConfig = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/regional_division/${id}/config`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/regional_division/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/wms/regional_division/insert`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const reponse = await removeDivision(deleteElement);
    close();
    await loadRegionalDivisions();
    setLoading(false);
  };

  const selectedItemsFn = (selection: Selection) => {
    setSelectedKeys(selection);
    if (selection === 'all') {
      setSelectedItems(regionalDivisions.map((rd: RegionalDivision) => Number(rd.id)));
    } else {
      setSelectedItems(Array.from(selection.values()).map(cadena => parseInt(cadena.toString())))
    }
  }

  return (
    <>
      <Loading loading={loading}>
        <Table
          aria-label="USER"
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
          onSelectionChange={(keys: Selection) => {selectedItemsFn(keys)}}
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
            emptyContent={`${loadingItems ? intl.formatMessage({ id: "loading_items" }) : intl.formatMessage({ id: "no_results_found" })}`}
            items={loadingItems ? [] : items}
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

export default TableRegionalDivision;
