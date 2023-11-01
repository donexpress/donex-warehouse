import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
  Input,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./../../common/VerticalDotsIcon";
import { SearchIcon } from "./../../common/SearchIcon";
import { capitalize } from "../../../../helpers/utils";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
import PaginationTable from "../../common/Pagination";
import { removeLine } from "@/services/api.lineserege1992";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import { ChevronDownIcon } from "../../common/ChevronDownIcon";
import { getGuides } from "@/services/api.guideerege1992";
import { Guide } from "@/types/guideerege1992";
import { indexCarriers } from "@/services/api.carrierserege1992";
import { Carrier } from "@/typeserege1992";
import { isString } from "formik";
import { PlusIcon } from "../../common/PlusIcon";

const INITIAL_VISIBLE_COLUMNS = [
  "waybill_id",
  "tracking_number",
  "weigth",
  "total_declare",
  "currency",
  "shipping_cost",
  "sale_price",
  "invoice_weight",
  "paid",
  "carrier"
];

const AirGuideTable = () => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [guides, setGuides] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<Carrier[] | null>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);

  // const [showGuideNumber, setshowGuideNumber] = useState<boolean>(true);
  // const [showTrackingNumber, setshowTrackingNumber] = useState<boolean>(true);
  // const [showclientReference, setshowclientReference] = useState<boolean>(true);
  // const [showAccountStatus, setshowAccountStatus] = useState<boolean>(true);
  // const [showCarrier, setshowCarrier] = useState<boolean>(true);
  // const [showPaid, setshowPaid] = useState<boolean>(true);

  /** start*/
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [aerealGuideNumberValue, setAerealGuideNumberValue] = React.useState("");
  const [trackingNumberValue, setTrackingNumberValue] = React.useState("");
  const [clientReferenceValue, setClientReferenceValue] = React.useState("");
  const [carrierValue, setCarrierValue] = React.useState("");
  const [paidValue, setPaidValue] = React.useState("");

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
      { name: intl.formatMessage({ id: "waybill_id" }), uid: "waybill_id", sortable: true },
      {
        name: intl.formatMessage({ id: "trackingNumber" }),
        uid: "tracking_number",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "weigth" }),
        uid: "weigth",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "total_declare" }),
        uid: "total_declare",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "currency" }),
        uid: "currency",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "shipping_cost" }),
        uid: "shipping_cost",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "sale_price" }),
        uid: "sale_price",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "paid" }),
        uid: "paid",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "carrier" }),
        uid: "carrier",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "bag_code" }),
        uid: "bag_code",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "clientReference" }),
        uid: "client_reference",
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
    let filteredGuides = [...guides];
    return filteredGuides;
  }, [guides, filterValue, statusFilter]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Guide, b: Guide) => {
      const first = a[sortDescriptor.column as keyof Guide] as number;
      const second = b[sortDescriptor.column as keyof Guide] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (guide: any, columnKey: React.Key) => {
      const cellValue = guide[columnKey];
      switch (columnKey) {
        case "paid":
          return (
            cellValue ? "Pagados" : "No pagados"
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
                  <DropdownItem onClick={() => handleShow(guide["waybill_id"])}>
                    {intl.formatMessage({ id: "View" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleEdit(guide["waybill_id"])}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDelete(guide["waybill_id"])}>
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

  const onClear = React.useCallback((filter: string) => {
    eval(`set${filter}("")`);
  }, []);

  const handleClearAll = () => {
    setAerealGuideNumberValue("");
    setClientReferenceValue("");
    setTrackingNumberValue("");
    setCarrierValue("");
    setPaidValue("");
    reloadData();
  };

  const arrayPaids = [
    { value: "Pagados", id: 0 },
    { value: "No pagados", id: 1 }
  ]

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flexbox-container">
          <div className="flexbox-item" style={{ paddingLeft: 0 }}>
            <Input
              isClearable
              className="search-input"
              placeholder={intl.formatMessage({ id: "waybill_id" })}
              startContent={<SearchIcon />}
              value={aerealGuideNumberValue}
              onClear={() => onClear("AerealGuideNumberValue")}
              onChange={(e) => setAerealGuideNumberValue(e.target.value)}
            />
          </div>

          <div className="flexbox-item">
            <Input
              isClearable
              className="search-input"
              placeholder={intl.formatMessage({ id: "trackingNumber" })}
              startContent={<SearchIcon />}
              value={trackingNumberValue}
              onClear={() => onClear("TrackingNumberValue")}
              onChange={(e) => setTrackingNumberValue(e.target.value)}
            />
          </div>

          <div className="flexbox-item">
            <Input
              isClearable
              className="search-input"
              placeholder={intl.formatMessage({ id: "clientReference" })}
              startContent={<SearchIcon />}
              value={clientReferenceValue}
              onClear={() => onClear("ClientReferenceValue")}
              onChange={(e) => setClientReferenceValue(e.target.value)}
            />
          </div>

          <div className="flexbox-item" style={{ paddingRight: 0 }}>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bnt-dropdown"
                  // isIconOnly
                  style={{ width: "-webkit-fill-available" }}
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  {intl.formatMessage({ id: "accountStatus" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Account Status"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {/* {getColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))} */}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flexbox-item" style={{ paddingLeft: 0 }}>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bnt-dropdown"
                  style={{ width: "-webkit-fill-available" }}
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  {carrierValue.trim() !== "" ? carrierValue : intl.formatMessage({ id: "carrier" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Carrier"
                closeOnSelect={true}
                selectionMode="single"
              >
                {carriers ? carriers.map((column) => (
                  <DropdownItem onClick={(e) => setCarrierValue(column.name)} key={column.position} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                )) : []}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flexbox-item">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bnt-dropdown"
                  // isIconOnly
                  style={{ width: "-webkit-fill-available" }}
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  {paidValue.trim() !== "" ? paidValue : intl.formatMessage({ id: "paid" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Paid"
                closeOnSelect={true}
                selectionMode="single"
              >
                {arrayPaids.map((column) => (
                  <DropdownItem onClick={(e) => setPaidValue(column.value)} key={column.id} className="capitalize">
                    {capitalize(column.value)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start gap-3 items-start">
            <Button
              className="bnt-select"
              onClick={(e) => handleSelectedFilters(e)}
            >
              {intl.formatMessage({ id: "filter" })}
            </Button>

            <Button
              className="bnt-select"
              onClick={handleClearAll}
            >
              {intl.formatMessage({ id: "clear" })}
            </Button>
          </div>

          <div className="flex justify-end gap-3 items-end">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="bnt-select"
                  endContent={<ChevronDownIcon className="text-small" />}
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
              // isIconOnly
              endContent={<PlusIcon />}
              onClick={() => handleAdd()}
            >
              {intl.formatMessage({ id: "create" })}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {intl.formatMessage({ id: "total_results" }, { in: guides.length })}
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
      </div >
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    guides.length,
    hasSearchFilter,
    intl,
    trackingNumberValue,
    clientReferenceValue,
    aerealGuideNumberValue,
    carrierValue,
    paidValue
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
          totalRecords={filteredItems.slice(0, guides.length).length}
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
    guides.length,
    rowsPerPage,
    intl,
  ]);
  /** end*/

  useEffect(() => {
    loadGuides();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadGuides = async () => {
    setLoading(true);
    const _guides = await getGuides();
    const _carriers = await indexCarriers();
    setGuides(_guides);
    setCarriers(_carriers);
    setLoading(false);
  };

  const handleSelectedFilters = (event: any) => {
    let filters = [];
    if (trackingNumberValue.trim() !== "") {
      filters.push(`tracking_number=${trackingNumberValue}`);
    }
    if (clientReferenceValue.trim() !== "") {
      filters.push(`client_reference=${clientReferenceValue}`);
    }
    if (aerealGuideNumberValue.trim() !== "") {
      filters.push(`waybill_id=${aerealGuideNumberValue}`);
    }
    if (carrierValue.trim() !== "") {
      filters.push(`carrier=${carrierValue}`);
    }
    if (paidValue.trim() !== "") {
      filters.push(`paid=${paidValue === "Pagados" ? true : false}`);
    }
    reloadData(filters.join("&"));
  }

  const reloadData = async (filters?: string[] | string) => {
    if (isString(filters)) {
      // setLoading(true);
      const _guides = await getGuides(filters);
      setGuides(_guides);
      // setLoading(false);
    } else {
      const _guides = await getGuides();
      setGuides(_guides);
    }
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/aereal_guide/${id}/update`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/wms/aereal_guide/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/wms/aereal_guide/insert_guide`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const reponse = await removeLine(deleteElement);
    close();
    await loadGuides();
    setLoading(false);
  };
  return (
    <>
      <Loading loading={loading}>
        <Table
          aria-label="GUIDE"
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
export default AirGuideTable;
