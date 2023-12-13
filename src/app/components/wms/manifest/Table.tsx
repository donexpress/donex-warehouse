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
import Select from 'react-select';
import { SearchIcon } from "../../common/SearchIcon";
import { capitalize, getDateFormat, getHourFormat } from "../../../../helpers/utils";
import { showMsg } from "../../../../helpers";
import { useIntl } from "react-intl";
import "../../../../styles/wms/user.table.scss";
import "../../../../styles/general.search.scss";
import PaginationTable from "../../common/Pagination";
import { removeLine } from "@/services/api.lineserege1992";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import { ChevronDownIcon } from "../../common/ChevronDownIcon";
import { getGuides, guidesCount, paidBill, exportBill, chargeWaybill, exportExcelManifest } from "@/services/api.manifesterege1992";
import { Guide, GuidesCount, ManifestFilters, ManifestResponse } from "@/types/guideerege1992";
import { indexCarriers } from "@/services/api.carrierserege1992";
import { Carrier, MWB } from "@/typeserege1992";
import { FaCalculator, FaFile, FaFileExcel, FaFilter, FaTimes } from "react-icons/fa";
import ImportManifestDialog from "../../common/ImportManifestDialog";
import ManifestTableDialog from "../../common/ManifestTableDialog";
import SpinnerIconButton from "../../common/SpinnerIconButton";
import { indexWaybillIDS } from "@/services/api.waybillerege1992";
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";
import ProfitDialog from "../../common/ProfitDialog";
import GenerateDialog from "../../common/GenerateDialog";
import GenericInput from "../../common/GenericInput";
import { Form, Formik } from "formik";

const INITIAL_VISIBLE_COLUMNS = [
  "waybill_id",
  "tracking_number",
  "shipping_cost",
  "sale_price",
  "weigth",
  "invoice_weight",
  "state",
  "paid",
];

const ManifestTable = () => {
  const intl = useIntl();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [carriers, setCarriers] = useState<Carrier[] | null>([]);
  const [waybillIDS, setWaybillIDS] = useState<MWB[] | null>([]);
  const [guidesTotal, setGuidesTotal] = useState<GuidesCount | null>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtered, setFiltered] = useState<boolean>(true);

  /** start*/
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [filters, setFilters] = React.useState<string>("");
  const [showPagination, setShowPagination] = useState<boolean>(true);

  const [showGenerateShippingInvoice, setShowGenerateShippingInvoiceDialog] = useState<boolean>(false);
  const [showProfitDialog, setShowProfitDialog] = useState<boolean>(false);
  const [showImportManifestDialog, setShowImportManifestDialog] = useState<boolean>(false);
  const [showUpdateManifestDialog, setShowUpdateManifestDialog] = useState<boolean>(false);
  const [showPaidBillDialog, setShowPaidBillDialog] = useState<boolean>(false);
  const [showChargeWaybillDialog, setShowChargeWaybillDialog] = useState<boolean>(false);
  const [visibleDialogTable, setVisibleDialogTable] = useState<boolean>(false);
  const [whereUpdate, setWhereUpdate] = useState<string>("");

  const [trackingNumberValue, setTrackingNumberValue] = React.useState("");
  const [clientReferenceValue, setClientReferenceValue] = React.useState("");
  const [billCodeValue, setBillCodeValue] = React.useState("");
  const [currentBillCodeRequest, setCurrentBillCodeRequest] = React.useState("");
  const [currentWaybillCodeRequest, setCurrentWaybillCodeRequest] = React.useState("");
  const [carrierValue, setCarrierValue] = React.useState("");
  const [waybillIDValue, setWaybillIDValue] = React.useState("");
  const [paidValue, setPaidValue] = React.useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [manifestPaidData, setManifestPaidData] = React.useState<ManifestResponse | null>(null);

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [processingInfo, setProcessingInfo] = useState<boolean>(false);

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
        name: intl.formatMessage({ id: "manifest_weight" }),
        uid: "weigth",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "invoice_weight" }),
        uid: "invoice_weight",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "order_status" }),
        uid: "state",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "clientReference" }),
        uid: "client_reference",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "invoice_status" }),
        uid: "paid",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "created_at" }),
        uid: "created_at",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "unit_weight" }),
        uid: "unit_weigth",
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
        name: intl.formatMessage({ id: "carrier" }),
        uid: "carrier",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "bag_code" }),
        uid: "bag_code",
        sortable: true,
      },
      // { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ];

    return columns;
  }, [intl]);

  let initialValues: ManifestFilters = {
    waybill_id: "",
    carrier: "",
    tracking_number: "",
    clientReference: "",
    bill_code: "",
    date_rage: "",
  };

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
        case "state":
          return (
            cellValue === "collected" ? "Cobrado" : "Pendiente"
          );
        case "created_at":
          return cellValue !== null ? (<span>{getDateFormat(cellValue)}, {getHourFormat(cellValue)}</span>) : '';
        case "tracking_number":
          return (
            <CopyColumnToClipboard
              value={
                cellValue
              }
            />
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
    setClientReferenceValue("");
    setBillCodeValue("");
    setCurrentBillCodeRequest("");
    setCurrentWaybillCodeRequest("");
    setTrackingNumberValue("");
    setCarrierValue("");
    setWaybillIDValue("");
    setPaidValue("");
    setStartDate("");
    setEndDate("");
    setFiltered(true);
    await reloadData(-1, -1, "");
  };

  const arrayPaids = [
    { value: "Pagados", id: 0 },
    { value: "No pagados", id: 1 }
  ]

  const arrayUpdateManifest = [
    { value: intl.formatMessage({ id: "manifest" }), id: 2 },
    { value: intl.formatMessage({ id: "customer_invoice" }), id: 0 },
    { value: intl.formatMessage({ id: "supplier_invoice" }), id: 1 }
  ]

  const arrayBillCode = [
    { value: intl.formatMessage({ id: "export_xlsx" }), id: 1 },
    { value: intl.formatMessage({ id: "pay" }), id: 2 }
  ]

  const validateBillCodeIncomplete = (cadena: string): boolean => {
    const regex = /^\d{4}\d{2}[QMT][a-zA-Z\d]+$/;

    return regex.test(cadena);
  };

  const formatBillCode = (input: string): string => {
    if (!input) {
      return "";
    }

    const cleanedInput = input.replace(/[^a-zA-Z0-9_]/g, '');

    if (validateBillCodeIncomplete(cleanedInput)) {
      const formattedInput = cleanedInput.replace(/^(\d{4})(\d{2})([QMT])([a-zA-Z\d]+)$/, '$1_$2_$3_$4');
      return formattedInput;
    }

    const regex = /^(\d{4})(_?(\d{2}))?_?([QMT])?_?([a-zA-Z\d]*)$/;
    const match = cleanedInput.match(regex); console.log(match)
    if (match) {
      const completeParam = cleanedInput.replace(/_/g, '');
      const param1 = match[1];
      const param2 = match[3] || null;
      const param3 = match[4] || null;
      const param4 = match[5] || null;

      let response = param1 + '_';
      if (param2) {
        response += param2 + '_';
        if (param3) {
          response += param3 + '_';
          if (param4) {
            response += param4;
          } else if (completeParam.length > 7) {
            response += completeParam.substring(7);
          }
        } else if (completeParam.length > 6) {
          response += completeParam.substring(6);
        }
      } else if (completeParam.length > 4) {
        response += completeParam.substring(4);
      }

      return response;
    }
    return cleanedInput;
  };

  const handleExport = async () => {
    try {
      let response: any = null;
      response = await exportExcelManifest(filters);
      if (response.status && response.status >= 200 && response.status <= 299) {
        showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        if (response.status && (response.status === 404)) {
          message = intl.formatMessage({ id: 'billNotFoundMsg' });
        }
        showMsg(message, { type: "error" });
      }
    } catch (error) {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
    setFiltered(true);
  }

  const setDateMaxToday = (value: string, type: 'start_date' | 'end_date') => {
    let newValue = value;
    const selectedDate = new Date(value);
    const currentDate = new Date();

    const startDateDef = (startDate && startDate !== '') ? new Date(startDate) : new Date();

    if ((selectedDate > currentDate) || (type === 'end_date' && (startDateDef > selectedDate))) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      
      newValue = `${year}-${month}-${day}`;
    }
    
    if (type === 'end_date') {
      setEndDate(newValue)
    } else if (type === 'start_date') {
      setStartDate(newValue)
    }
  }

  const topContent = React.useMemo(() => {
    return (
      <Formik initialValues={initialValues} onSubmit={() => { }}>
        <Form>
          <div className="flex flex-col gap-3">
            <div className="container-search-inputs">
              <div>
                <Select
                  isSearchable
                  options={waybillIDS ? waybillIDS.map((column) => ({
                    value: column.waybill_id,
                    label: capitalize(column.waybill_id)
                  })) : []}
                  value={waybillIDValue.trim() !== "" ? { value: waybillIDValue, label: waybillIDValue } : null}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setWaybillIDValue(selectedOption.value);
                    } else {
                      setWaybillIDValue("");
                    }
                  }}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#212c4d !important",
                      border: "1px solid #37446b !important",
                      borderRadius: "4px !important",
                      height: "40px",
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: "#aeb9e1",
                      backgroundColor: "#212c4d !important",
                    }), placeholder: (provided) => ({
                      ...provided,
                      color: "#aeb9e1",
                      fontWeight: 400,
                      fontSize: "var(--nextui-font-size-small)"
                    }), input: (provided) => ({
                      ...provided,
                      color: "#aeb9e1",
                      fontWeight: 400,
                      fontSize: "var(--nextui-font-size-small)"
                    }), singleValue: (provided) => ({
                      ...provided,
                      color: "#aeb9e1",
                      fontWeight: 400,
                      fontSize: "var(--nextui-font-size-small)"
                    }), menu: (provided) => ({
                      ...provided,
                      color: "#aeb9e1",
                      backgroundColor: "#212c4d !important",
                      fontWeight: 400,
                      fontSize: "var(--nextui-font-size-small)"
                    }),
                  }}
                  placeholder={intl.formatMessage({ id: "waybill_id" })}
                />
              </div>

              <div>
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

              <div>
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

              <div>
                <Input
                  isClearable
                  className="search-input"
                  placeholder={intl.formatMessage({ id: "bill_code" })}
                  startContent={<SearchIcon />}
                  value={billCodeValue}
                  onClear={() => onClear("BillCodeValue")}
                  onChange={(e) => setBillCodeValue(formatBillCode(e.target.value))}
                />
              </div>

              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="bnt-dropdown"
                      style={{ width: "100%" }}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px' }}>
                <div>
                  <GenericInput
                    onChangeFunction={(event) => setDateMaxToday(event?.target.value, "start_date")}
                    selectDateMaxToday={true}
                    type="date"
                    name="start_date"
                    value={startDate}
                    placeholder={intl.formatMessage({
                      id: "start_date",
                    })}
                    customClass="custom-input"
                    hideErrorContent={true}
                  />
                </div>

                <div>
                  <GenericInput
                    onChangeFunction={(event) => setDateMaxToday(event?.target.value, "end_date")}
                    selectDateMaxToday={true}
                    type="date"
                    name="end_date"
                    value={endDate}
                    placeholder={intl.formatMessage({
                      id: "end_date",
                    })}
                    disabled={startDate === ""}
                    customClass="custom-input"
                    hideErrorContent={true}
                  />
                </div>
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

                {(currentWaybillCodeRequest !== "") && !loadingItems && !!guidesTotal?.count && (guidesTotal?.count > 0) && (<Button
                  color="primary"
                  onClick={() => openChargeWaybillDialog()}
                >
                  {intl.formatMessage({ id: "collect_money" })}
                </Button>
                )}

                {(currentBillCodeRequest !== "") && !loadingItems && !!guidesTotal?.count && (guidesTotal?.count > 0) && (<Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button
                      color="primary"
                      endContent={<ChevronDownIcon className="text-small" />}
                    >
                      {intl.formatMessage({ id: "bill_code" })}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Bill Code"
                    closeOnSelect={true}
                    selectionMode="single"
                  >
                    {arrayBillCode.map((column) => (
                      <DropdownItem key={column.id} onClick={(e) => handleActionBillCode(column.id)} className="capitalize">
                        {capitalize(column.value)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                )}

                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button
                      color="primary"
                      endContent={<ChevronDownIcon className="text-small" />}
                    >
                      {intl.formatMessage({ id: "create" })}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Carrier"
                    closeOnSelect={true}
                    selectionMode="single"
                  >
                    {arrayUpdateManifest.map((column) => (
                      <DropdownItem key={column.id} onClick={(e) => (column.id !== 2) ? openUpdateManifestDialog(column.id) : openImportManifestDialog()} className="capitalize">
                        {capitalize(column.value)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Button
                  color="primary"
                  style={{ width: "120px" }}
                  endContent={
                    <FaCalculator style={{ fontSize: "22px", color: "white" }} />
                  }
                  onClick={() => openProfitDialog()}
                >
                  {intl.formatMessage({ id: "profit" })}
                </Button>

                <Button
                  color="primary"
                  style={{ width: "160px" }}
                  endContent={
                    <FaFile style={{ fontSize: "22px", color: "white" }} />
                  }
                  onClick={() => openGenerateShippingInvoiceDialog()}
                >
                  {intl.formatMessage({ id: "shipping_invoice" })}
                </Button>

                <Button
                  color="primary"
                  style={{ width: "140px" }}
                  endContent={
                    <FaFileExcel style={{ fontSize: "22px", color: "white" }} />
                  }
                  disabled={filtered || filteredItems.length === 0}
                  onClick={() => handleExport()}
                >
                  {intl.formatMessage({ id: "export_xlsx" })}
                </Button>

                {/* <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => openImportManifestDialog()}
            >
              {intl.formatMessage({ id: "create" })}
            </Button> */}
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
          </div>
        </Form>
      </Formik >
    );
  }, [
    visibleColumns,
    onRowsPerPageChange,
    guides.length,
    intl,
    trackingNumberValue,
    clientReferenceValue,
    billCodeValue,
    waybillIDValue,
    carrierValue,
    paidValue,
    startDate,
    endDate,
    guidesTotal
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
    const _waybillIDS = await indexWaybillIDS();
    const _guidesCount = await guidesCount(filters);
    setGuides(_guides);
    setCarriers(_carriers);
    setWaybillIDS(_waybillIDS);
    setGuidesTotal(_guidesCount);
    setLoading(false);
  };

  const handleSelectedFilters = async (event: any) => {
    setFiltered(false);
    let arrayFilters = [];
    if (trackingNumberValue.trim() !== "") {
      arrayFilters.push(`tracking_number=${trackingNumberValue}`);
    }
    if (clientReferenceValue.trim() !== "") {
      arrayFilters.push(`client_reference=${clientReferenceValue}`);
    }
    if (billCodeValue.trim() !== "") {
      arrayFilters.push(`bill_code=${billCodeValue}`);
      setCurrentBillCodeRequest(billCodeValue);
    } else if (currentBillCodeRequest !== "") {
      setCurrentBillCodeRequest("");
    }
    if (waybillIDValue.trim() !== "") {
      arrayFilters.push(`waybill_id=${waybillIDValue}`);
      setCurrentWaybillCodeRequest(waybillIDValue);
    } else if (currentWaybillCodeRequest !== "") {
      setCurrentWaybillCodeRequest("");
    }
    if (carrierValue.trim() !== "") {
      arrayFilters.push(`carrier=${carrierValue}`);
    }
    if (paidValue.trim() !== "") {
      arrayFilters.push(`paid=${paidValue === "Pagados" ? true : false}`);
    }
    if (startDate.trim() !== "") {
      arrayFilters.push(`start_date=${startDate}`);
    }
    if (endDate.trim() !== "") {
      arrayFilters.push(`end_date=${endDate}`);
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

  const handleActionBillCode = async (action: number) => {
    if (action === 1) {
      const response = await exportBill(currentBillCodeRequest);
      if (response.status >= 200 && response.status <= 299) {
        if (response.data && response.data.url) {
          const link = document.createElement('a');
          link.href = response.data.url;
          link.setAttribute('download', response.data.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
        showMsg(message, { type: "error" });
      }
    } else if (action === 2) {
      openPaidBillDialog();
    }
  }

  const paidBillAction = async () => {
    setProcessingInfo(true);
    const response = await paidBill(currentBillCodeRequest);
    setProcessingInfo(false);
    if (response.status >= 200 && response.status <= 299) {
      showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
    closePaidBillDialog();
    await reloadData(page, rowsPerPage, filters);
  }

  const chargeWaybillAction = async () => {
    setProcessingInfo(true);
    const response = await chargeWaybill(currentWaybillCodeRequest);
    setProcessingInfo(false);
    if (response.status >= 200 && response.status <= 299) {
      showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
    closeChargeWaybillDialog();
    await reloadData(page, rowsPerPage, filters);
  }

  const openPaidBillDialog = () => {
    setShowPaidBillDialog(true);
  }

  const closePaidBillDialog = () => {
    setShowPaidBillDialog(false);
  }

  const openChargeWaybillDialog = () => {
    setShowChargeWaybillDialog(true);
  }

  const closeChargeWaybillDialog = () => {
    setShowChargeWaybillDialog(false);
  }

  const openGenerateShippingInvoiceDialog = () => {
    setShowGenerateShippingInvoiceDialog(true);
  }

  const closeGenerateShippingInvoiceDialog = () => {
    setShowGenerateShippingInvoiceDialog(false);
  }

  const openProfitDialog = () => {
    setShowProfitDialog(true);
  }

  const closeProfitDialog = () => {
    setShowProfitDialog(false);
  }

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

  const handleManifestTableDialog = (content: ManifestResponse) => {
    setShowUpdateManifestDialog(false);
    if (whereUpdate === "supplier") {
      const message = intl.formatMessage({ id: "manifest_success" });
      showMsg(message, { type: "success" });
      if (content.manifests_bill_code && (content.manifests_bill_code.length > 0)) {
        const link = document.createElement('a');
        link.href = content.manifests_bill_code[0].url;
        link.setAttribute('download', content.manifests_bill_code[0].name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      /* setManifestPaidData(content);
      setVisibleDialogTable(true); */
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
          selectionMode="none"
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
        {showGenerateShippingInvoice && <GenerateDialog close={closeGenerateShippingInvoiceDialog} title={intl.formatMessage({ id: "generate_shipping_invoice" })} />}
        {showProfitDialog && <ProfitDialog close={closeProfitDialog} title={intl.formatMessage({ id: "calculate_profit" })} />}
        {showImportManifestDialog && <ImportManifestDialog close={closeImportManifestDialog} confirm={confirmImportDialog} title={intl.formatMessage({ id: "import_manifest" })} />}
        {showUpdateManifestDialog && <ImportManifestDialog close={closeUpdateManifestDialog} confirm={confirmUpdateDialog} title={intl.formatMessage({ id: `update_manifest_${whereUpdate}` })} where={whereUpdate} onClose={handleManifestTableDialog} />}
        {visibleDialogTable && <ManifestTableDialog title={intl.formatMessage({ id: "already_manifest_charged" }, { MWB: (manifestPaidData?.manifest_charged && (manifestPaidData.manifest_charged.length > 0) && manifestPaidData.manifest_charged[0].waybill_id) ? manifestPaidData.manifest_charged[0].waybill_id : '' })} close={closeManifestTableDialog} content={manifestPaidData as ManifestResponse} />}
        {showPaidBillDialog && <ConfirmationDialog close={closePaidBillDialog} confirm={paidBillAction} loading={processingInfo} />}
        {showChargeWaybillDialog && <ConfirmationDialog close={closeChargeWaybillDialog} confirm={chargeWaybillAction} loading={processingInfo} />}
      </Loading>
    </>
  );
};
export default ManifestTable;
