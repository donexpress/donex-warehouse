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
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
import {
  getPaymentMethods,
  removePaymentMethodById,
} from "../../../../services/api.payment_method";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import {
  PaymentMethod,
} from "../../../../types/payment_methods";
import { PlusIcon } from "./../../common/PlusIcon";
import { VerticalDotsIcon } from "./../../common/VerticalDotsIcon";
import { SearchIcon } from "./../../common/SearchIcon";
import PaginationTable from "../../common/Pagination";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import { showMsg } from "../../../../helpers";

const PaymentMethodTable = () => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);

  /** start*/
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return [
      { name: intl.formatMessage({ id: "name" }), uid: "name", sortable: false },
      { name: intl.formatMessage({ id: "code" }), uid: "code", sortable: false },
      { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ];
  }, [intl]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...paymentMethods];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.code
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [paymentMethods, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: PaymentMethod, b: PaymentMethod) => {
      const first = a[sortDescriptor.column as keyof PaymentMethod] as number;
      const second = b[sortDescriptor.column as keyof PaymentMethod] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
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
                <DropdownItem onClick={() => handleDelete(Number(user["id"]))}>
                  {intl.formatMessage({ id: "Delete" })}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
        case "name":
          return <span style={{ cursor: 'pointer' }} onClick={()=>{handleShow(user["id"])}}>{user.name}</span>;
        case "code":
          return <span style={{ cursor: 'pointer' }} onClick={()=>{handleShow(user["id"])}}>{user.code}</span>;
        default:
          return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-2">
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
              { in: paymentMethods.length }
            )}
          </span>
          <label className="flex items-center text-default-400 text-small">
            {intl.formatMessage({ id: "rows_page" })}
            <select
              className="outline-none text-default-400 text-small m-1"
              onChange={onRowsPerPageChange}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    onRowsPerPageChange,
    paymentMethods.length,
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
          totalRecords={filteredItems.slice(0, paymentMethods.length).length}
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
    paymentMethods.length,
    rowsPerPage,
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
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadWarehouses = async () => {
    setLoading(true);
    const pms = await getPaymentMethods();
    setPaymentMethods(pms ? pms : []);

    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/payment_methods/${id}/update`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/payment_methods/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/wms/payment_methods/insert`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const response = await removePaymentMethodById(deleteElement);
    if (response.status >= 200 && response.status <= 299) {
      showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
    close();
    await loadWarehouses();

    setLoading(false);
  };

  return (
    <>
      <Loading loading={loading}>
        {topContent}
        <div className="overflow-x-auto tab-system-table">
        <Table
          aria-label="USER-LEVEL"
          isHeaderSticky
          classNames={{
            wrapper: "max-h-[auto]",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid == "actions" ? "center" : "start"}
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
        </div>
        {bottomContent}
        {showConfirm && <ConfirmationDialog close={close} confirm={confirm} />}
      </Loading>
    </>
  );
};

export default PaymentMethodTable;
