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
import { getStoragePlans, removeStoragePlanById } from '../../../../services/api.storage_plan';
import { StoragePlan } from "../../../../types/storage_plan";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import PaginationTable from "../../common/Pagination";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "order_number",
  "customer_order_number",
  "user_id",
  "warehouse_id",
  "box_amount",
  "actions",
];

const TableStoragePlan = () => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [storagePlans, setStoragePlans] = useState<StoragePlan[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusSelected, setStatusSelected] = useState<number>(1);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);

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
    column: "customer_order_number",
    direction: "descending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      {
        name: intl.formatMessage({ id: "warehouse_order_number" }),
        uid: "order_number",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "customer_order_number" }),
        uid: "customer_order_number",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "user" }),
        uid: "user_id",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "storage" }),
        uid: "warehouse_id",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "number_of_boxes" }),
        uid: "box_amount",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "delivery_time" }),
        uid: "delivered_time",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "observations" }),
        uid: "observations",
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
    let filteredStoragePlans = [...storagePlans];

    if (hasSearchFilter) {
        filteredStoragePlans = filteredStoragePlans.filter(
        (storageP) =>
          storageP.customer_order_number
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          storageP.user_id
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          storageP.warehouse_id
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase())
      );
    }

    return filteredStoragePlans;
  }, [storagePlans, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: StoragePlan, b: StoragePlan) => {
      const first = a[sortDescriptor.column as keyof StoragePlan] as number;
      const second = b[sortDescriptor.column as keyof StoragePlan] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (storageP: any, columnKey: React.Key) => {
      const cellValue = storageP[columnKey];
      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[storageP.status]}
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
                  <DropdownItem onClick={() => handleShow(storageP["id"])}>
                    {intl.formatMessage({ id: "View" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleEdit(storageP["id"])}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleConfig(storageP["id"])}>
                    {intl.formatMessage({ id: "config" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDelete(storageP["id"])}>
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "user_id": return storageP.user ? storageP.user.username : '';
        case "warehouse_id": return storageP.warehouse ? (`${storageP.warehouse.name} (${storageP.warehouse.code})`) : '';
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
  
  const changeTab = async(tab: number) => {
    if (tab !== statusSelected && !loadingItems) {
      await setStatusSelected(tab);
      await setLoadingItems(true);
      const storagePlanss = await getStoragePlans(tab);
      
      await setLoadingItems(false);
      await setStoragePlans(storagePlanss !== null ? storagePlanss : []);
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
            {intl.formatMessage({ id: "total_results" }, { in: storagePlans.length })}
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
              <li className="whitespace-nowrap">
                <button className={ statusSelected === 1 ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                  onClick={() => changeTab(1)}
                >
                  {intl.formatMessage({ id: "to_be_stored_state" })}
                </button>
              </li>
              <li className="whitespace-nowrap">
                <button className={ statusSelected === 2 ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                  onClick={() => changeTab(2)}
                >
                  {intl.formatMessage({ id: "warehouse_entry_state" })}
                </button>
              </li>
              <li className="whitespace-nowrap">
                <button className={ statusSelected === 3 ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                  onClick={() => changeTab(3)}
                >
                  {intl.formatMessage({ id: "stocked_state" })}
                </button>
              </li>
              <li className="whitespace-nowrap">
                <button className={ statusSelected === 4 ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                  onClick={() => changeTab(4)}
                >
                  {intl.formatMessage({ id: "cancelled_state" })}
                </button>
              </li>
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
    storagePlans.length,
    hasSearchFilter,
    intl,
    statusSelected,
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
          totalRecords={filteredItems.slice(0, storagePlans.length).length}
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
    sortedItems.length,
    page,
    storagePlans.length,
    rowsPerPage,
    hasSearchFilter,
    intl,
  ]);
  /** end*/

  useEffect(() => {
    loadStoragePlans();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadStoragePlans = async () => {
    setLoading(true);
    const storagePlanss = await getStoragePlans(statusSelected);
    
    setStoragePlans(storagePlanss !== null ? storagePlanss : []);
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/storage_plan/${id}/update`);
  };

  const handleConfig = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/storage_plan/${id}/config`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/storage_plan/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/wms/storage_plan/insert`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const reponse = await removeStoragePlanById(deleteElement);
    close();
    await loadStoragePlans();
    setLoading(false);
  };

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
            emptyContent={`${loadingItems ? intl.formatMessage({ id: "loading_items" }) : intl.formatMessage({ id: "no_results_found" })}`}
            items={loadingItems ? [] : sortedItems}
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

export default TableStoragePlan;