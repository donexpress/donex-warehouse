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
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { SearchIcon } from "../../common/SearchIcon";
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
import { getGuides, guidesCount } from "@/services/api.manifesterege1992";
import { Guide, GuidesCount } from "@/types/guideerege1992";
import { indexCarriers } from "@/services/api.carrierserege1992";
import { Carrier } from "@/typeserege1992";
import { PlusIcon } from "../../common/PlusIcon";
import { FaFilter, FaTimes } from "react-icons/fa";
import ImportManifestDialog from "../../common/ImportManifestDialog";
import ManifestTableDialog from "../../common/ManifestTableDialog";
import SpinnerIconButton from "../../common/SpinnerIconButton";

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

const ManifestTable = () => {
  const intl = useIntl();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [carriers, setCarriers] = useState<Carrier[] | null>([]);
  const [guidesTotal, setGuidesTotal] = useState<GuidesCount | null>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);

  /** start*/
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [filters, setFilters] = React.useState<string>("");
  const [showPagination, setShowPagination] = useState<boolean>(true);

  const [showImportManifestDialog, setShowImportManifestDialog] = useState<boolean>(false);
  const [showUpdateManifestDialog, setShowUpdateManifestDialog] = useState<boolean>(false);
  const [visibleDialogTable, setVisibleDialogTable] = useState<boolean>(false);
  const [whereUpdate, setWhereUpdate] = useState<string>("");

  const [aerealGuideNumberValue, setAerealGuideNumberValue] = React.useState("");
  const [trackingNumberValue, setTrackingNumberValue] = React.useState("");
  const [clientReferenceValue, setClientReferenceValue] = React.useState("");
  const [carrierValue, setCarrierValue] = React.useState("");
  const [paidValue, setPaidValue] = React.useState("");

  const [manifestPaidData, setManifestPaidData] = React.useState<Guide[]>([]);

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [loadingItems, setLoadingItems] = useState<boolean>(false);


  const [page, setPage] = useState(1);

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      { name: intl.formatMessage({ id: "waybill_id" }), uid: "waybill_id", sortable: true },
      {
        name: intl.formatMessage({ id: "tracking_number" }),
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
  }, [guides]);

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

  const onRowsPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (Number(e.target.value) !== rowsPerPage) {
      setSelectedKeys(new Set([]));
      setRowsPerPage(Number(e.target.value));
      setPage(1);
      await reloadData(1, Number(e.target.value), filters);
    }
  }

  const onClear = React.useCallback((filter: string) => {
    eval(`set${filter}("")`);
  }, []);

  const handleClearAll = async () => {
    setAerealGuideNumberValue("");
    setClientReferenceValue("");
    setTrackingNumberValue("");
    setCarrierValue("");
    setPaidValue("");
    await reloadData(-1, -1, "");
  };

  const arrayPaids = [
    { value: "Pagados", id: 0 },
    { value: "No pagados", id: 1 }
  ]

  const arrayUpdateManifest = [
    { value: intl.formatMessage({ id: "customer_manifest" }), id: 0 },
    { value: intl.formatMessage({ id: "supplier_manifest" }), id: 1 }
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
              placeholder={intl.formatMessage({ id: "tracking_number" })}
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

          {/* <div className="flexbox-item" style={{ paddingRight: 0 }}>
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
              > */}
          {/* {getColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))} */}
          {/* </DropdownMenu>
            </Dropdown> */}
          {/* </div> */}

          <div className="flexbox-item">
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

          <div className="flexbox-item" style={{ paddingRight: 0 }}>
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
              color="primary"
              onClick={(e) => handleSelectedFilters(e)}
            >
              <FaFilter />
            </Button>

            <Button
              color="primary"
              onClick={handleClearAll}
            >
              <FaTimes />
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

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="bnt-select"
                  endContent={<ChevronDownIcon className="text-small" />}
                >
                  {intl.formatMessage({ id: "update" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Carrier"
                closeOnSelect={true}
                selectionMode="single"
              >
                {arrayUpdateManifest.map((column) => (
                  <DropdownItem key={column.id} onClick={(e) => openUpdateManifestDialog(column.id)} className="capitalize">
                    {capitalize(column.value)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => openImportManifestDialog()}
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
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div >
    );
  }, [
    visibleColumns,
    onRowsPerPageChange,
    guides.length,
    intl,
    trackingNumberValue,
    clientReferenceValue,
    aerealGuideNumberValue,
    carrierValue,
    paidValue
  ]);

  const changePage = async (newPage: number) => {
    if (page !== newPage) {
      setSelectedKeys(new Set([]));
      setPage(newPage);
      setShowPagination(false);
      await reloadData(newPage, rowsPerPage, filters);
      setShowPagination(true);
    }
  }

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? `${intl.formatMessage({ id: "selected_all" })}`
            : `${intl.formatMessage(
              { id: "selected" },
              { in: selectedKeys.size, end: guidesTotal?.count }
            )}`}
        </span>
        {
          showPagination && (
            <PaginationTable
              totalRecords={guidesTotal?.count}
              pageLimit={rowsPerPage}
              pageNeighbours={1}
              page={page}
              onPageChanged={changePage}
            />
          )
        }
        {
          !showPagination && (
            <div className="elements-center" style={{ height: '61px' }}>
              <SpinnerIconButton style={{ width: "20px", height: "20px" }} />
            </div>
          )
        }
      </div>
    )
  }, [
    selectedKeys,
    page,
    guidesTotal,
    guidesTotal?.count,
    guides.length,
    guides,
    rowsPerPage,
    intl,
    showPagination,
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
    const _guides = await getGuides(1, 25, filters);
    const _carriers = await indexCarriers();
    const _guidesCount = await guidesCount(filters);
    setGuides(_guides);
    setCarriers(_carriers);
    setGuidesTotal(_guidesCount);
    setLoading(false);
  };

  const handleSelectedFilters = async (event: any) => {
    let arrayFilters = [];
    if (trackingNumberValue.trim() !== "") {
      arrayFilters.push(`tracking_number=${trackingNumberValue}`);
    }
    if (clientReferenceValue.trim() !== "") {
      arrayFilters.push(`client_reference=${clientReferenceValue}`);
    }
    if (aerealGuideNumberValue.trim() !== "") {
      arrayFilters.push(`waybill_id=${aerealGuideNumberValue}`);
    }
    if (carrierValue.trim() !== "") {
      arrayFilters.push(`carrier=${carrierValue}`);
    }
    if (paidValue.trim() !== "") {
      arrayFilters.push(`paid=${paidValue === "Pagados" ? true : false}`);
    }
    setFilters(arrayFilters.join("&"));
    await reloadData(-1, -1, arrayFilters.join("&"));
  }

  const reloadData = async (newPage: number = -1, rowsPerPageSP: number = -1, queryFilters: string) => {
    setLoadingItems(true);
    const _guides = await getGuides(newPage !== -1 ? newPage : page, rowsPerPageSP !== -1 ? rowsPerPageSP : rowsPerPage, queryFilters);
    setGuides(_guides);
    const _guidesCount = await guidesCount(queryFilters);
    setGuidesTotal(_guidesCount);
    setLoadingItems(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const openImportManifestDialog = () => {
    setShowImportManifestDialog(true);
  }

  const closeImportManifestDialog = () => {
    setShowImportManifestDialog(false);
  }

  const openUpdateManifestDialog = (where: number) => {
    setWhereUpdate(where === 0 ? "customer" : "supplier");
    setShowUpdateManifestDialog(true);
  }

  const closeUpdateManifestDialog = () => {
    setShowUpdateManifestDialog(false);
  }

  const confirmImportDialog = async () => {
    closeImportManifestDialog();
    await loadGuides();
  }

  const confirmUpdateDialog = async () => {
    closeUpdateManifestDialog();
    await loadGuides();
  }

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const closeManifestTableDialog = () => {
    setVisibleDialogTable(false);
  }

  const handleManifestTableDialog = (content: Guide[]) => {
    setShowUpdateManifestDialog(false);
    if (whereUpdate === "supplier") {
      setManifestPaidData(content);
      setVisibleDialogTable(true);
    }
  }

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
            emptyContent={`${loadingItems ? intl.formatMessage({ id: "loading_items" }) : intl.formatMessage({ id: "no_results_found" })}`}
            items={loadingItems ? [] : filteredItems}
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
        {showImportManifestDialog && <ImportManifestDialog close={closeImportManifestDialog} confirm={confirmImportDialog} title={intl.formatMessage({ id: "import_manifest" })} />}
        {showUpdateManifestDialog && <ImportManifestDialog close={closeUpdateManifestDialog} confirm={confirmUpdateDialog} title={intl.formatMessage({ id: `update_manifest_${whereUpdate}` })} where={whereUpdate} onClose={handleManifestTableDialog} />}
        {visibleDialogTable && <ManifestTableDialog title={intl.formatMessage({ id: "already_manifest_paid" }, { MWB: manifestPaidData[0].waybill_id })} close={closeManifestTableDialog} content={manifestPaidData} />}
      </Loading>
    </>
  );
};
export default ManifestTable;
