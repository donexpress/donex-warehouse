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
  SortDescriptor,
} from "@nextui-org/react";
import { PlusIcon } from "./../../common/PlusIcon";
import { VerticalDotsIcon } from "./../../common/VerticalDotsIcon";
import { ChevronDownIcon } from "./../../common/ChevronDownIcon";
import { SearchIcon } from "./../../common/SearchIcon";
import { capitalize } from "../../../../helpers/utils";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
// import { Line } from "@/types/lineerege1992";
import { Line } from "../../../../types/line";
import PaginationTable from "../../common/Pagination";
import { getLine, removeLine } from "@/services/api.lineserege1992";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "contain_channels",
  "include_order_account",
  "actions",
];

const LinesTable = () => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [lines, setLines] = useState<Line[]>([]);
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
    column: "id",
    direction: "descending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      {
        name: intl.formatMessage({ id: "name" }),
        uid: "name",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "contain_channels" }),
        uid: "contain_channels",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "include_order_account" }),
        uid: "include_order_account",
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
    let filteredLines = [...lines];

    if (hasSearchFilter) {
      filteredLines = filteredLines.filter(
          (storageP) =>
              storageP.name
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ||
              storageP.contain_channels
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase()) ||
              storageP.include_order_account
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue.toLowerCase())
      );
    }

    return filteredLines;
  }, [lines, filterValue, statusFilter]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Line, b: Line) => {
      const first = a[sortDescriptor.column as keyof Line] as number;
      const second = b[sortDescriptor.column as keyof Line] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (user: any, columnKey: React.Key) => {
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
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
                  <DropdownItem onClick={() => handleShow(user["id"])}>
                    {intl.formatMessage({ id: "View" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleEdit(user["id"])}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDelete(user["id"])}>
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "organization_id":
          return user.organization ? user.organization.name : "";
        case "role_id":
          return user.role ? user.role.name : "";
        case "state":
          return user.state ? getLabelByLanguage(user.state) : "";
        default:
          return cellValue;
      }
    },
    [intl]
  );

  const getLabelByLanguage = (state: any) => {
    if (locale === 'es') {
      return state.es_name;
    } else if (locale === 'zh') {
      return state.zh_name;
    }
    return state.name;
  };

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
            {intl.formatMessage({ id: "total_results" }, { in: lines.length })}
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
    lines.length,
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
          totalRecords={filteredItems.slice(0, lines.length).length}
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
    page,
    hasSearchFilter,
    sortedItems.length,
    lines.length,
    rowsPerPage,
    intl,
  ]);
  /** end*/

  useEffect(() => {
    loadLines();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadLines = async () => {
    setLoading(true);
    const _lines = await getLine();
    setLines(_lines);

    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/line_classification/${id}/update`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/line_classification/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/wms/line_classification/insert_line`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const reponse = await removeLine(deleteElement);
    close();
    await loadLines();
    setLoading(false);
  };
  return (
    <>
      <Loading loading={loading}>
        <Table
          aria-label="LINE"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[auto]",
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
          <TableBody
            emptyContent={`${intl.formatMessage({ id: "no_results_found" })}`}
            items={sortedItems}
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
export default LinesTable;
