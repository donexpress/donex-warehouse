import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  SortDescriptor,
} from "@nextui-org/react";
import { getHourFormat, text_date_format } from "../../../../helpers/utils";
import { useIntl } from "react-intl";
import "../../../../styles/wms/user.table.scss";
import "./../../../../styles/generic.input.scss";
import "../../../../styles/general.search.scss";
import { Loading } from "../../common/Loading";
import { Summary, SummaryFilters } from "@/types/summaryerege1992";
import { exportExcelSummary, getSummary } from "@/services/api.summaryerege1992";
import { Form, Formik } from "formik";
import GenericInput from "../../common/GenericInput";
import { FaFileExcel, FaFilter, FaTimes } from "react-icons/fa";
import { SearchIcon } from "../../common/SearchIcon";
import { showMsg } from "@/helperserege1992";
import PaginationTable from "../../common/Pagination";
import SpinnerIconButton from "../../common/SpinnerIconButton";
import Select from 'react-select';

const SummaryTable = () => {
  const intl = useIntl();
  const [summary, setSummary] = useState<Summary[]>([]);
  const [summaryCount, setSummaryCount] = useState<number>(0);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [showPagination, setShowPagination] = useState<boolean>(true);

  const [type, setType] = React.useState("");
  const [billCodeValue, setBillCodeValue] = React.useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [filtered, setFiltered] = useState<boolean>(true);
  const [filters, setFilters] = React.useState<string>("");

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [sortDescriptorPrev, setSortDescriptorPrev] = useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: intl.formatMessage({ id: "waybill_id" }), uid: "MWB", sortable: true },
      {
        name: intl.formatMessage({ id: "quantity_package" }),
        uid: "quantity_package",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "charged_guide" }),
        uid: "collected",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "pending" }),
        uid: "pending",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "paid" }),
        uid: "paid",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "not_paid" }),
        uid: "not_paid",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "quantity_kilograms" }),
        uid: "quantity_kilograms",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "quantity_shipping_cost" }),
        uid: "quantity_shipping_cost",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "quantity_sale_price" }),
        uid: "quantity_sale_price",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "earnings" }),
        uid: "earnings",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "date" }),
        uid: "created_at",
        sortable: true,
      },
      // { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ];

    return columns;
  }, [intl]);

  const headerColumns = React.useMemo(() => {
    const columns = getColumns;
    return columns;
  }, [getColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredsummary = [...summary];
    return filteredsummary;
  }, [summary]);

  const renderCell = React.useCallback(
    (summary: any, columnKey: React.Key) => {
      const cellValue = summary[columnKey];
      switch (columnKey) {
        case "created_at":
          return cellValue !== null ? (<span>{text_date_format(cellValue)}, {getHourFormat(cellValue)}</span>) : '';
        default:
          return cellValue;
      }
    },
    []
  );

  useEffect(() => {
    loadsummary();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadsummary = async () => {
    setLoading(true);
    const is_carrier = type !== "General" && type !== "" ? true : false;
    const _summary = await getSummary(is_carrier, 1, 25, filters);
    if (_summary !== null) {
      setSummary(_summary.data);
      setSummaryCount(_summary.count);
      _summary.count === 0 && setNoResults(true);
    } else {
      setSummary([]);
      setSummaryCount(0);
      setNoResults(true);
    }
    setLoading(false);
  };

  const handleSelectedFilters = async (event: any) => {
    setFiltered(false);
    let arrayFilters = [];
    if (billCodeValue.trim() !== "") {
      arrayFilters.push(`bill_code=${billCodeValue}`);
    }
    if (startDate.trim() !== "") {
      arrayFilters.push(`start_date=${startDate}`);
    }
    if (endDate.trim() !== "") {
      arrayFilters.push(`end_date=${endDate}`);
    }
    setFilters(arrayFilters.join("&"));
    setPage(1);
    await reloadData(-1, -1, arrayFilters.join("&"));
  }

  const reloadData = async (newPage: number = -1, rowsPerPageSP: number = -1, queryFilters: string) => {
    setLoadingItems(true);
    const is_carrier = type !== "General" && type !== "" ? true : false;
    const _summary = await getSummary(is_carrier, newPage !== -1 ? newPage : page, rowsPerPageSP !== -1 ? rowsPerPageSP : rowsPerPage, queryFilters);
    if (_summary !== null) {
      setSummary(_summary.data);
      setSummaryCount(_summary.count);
      _summary.count === 0 && setNoResults(true);
    } else {
      setSummary([]);
      setSummaryCount(0);
      setNoResults(true);
    }
    setLoadingItems(false);
  };

  const handleClearAll = async () => {
    setBillCodeValue("");
    setStartDate("");
    setEndDate("");
    setFilters("");
    setFiltered(true);
    setPage(1);
    await reloadData(-1, -1, "");
  };

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    if (
      sortDescriptor.column === sortDescriptorPrev.column &&
      sortDescriptor.direction === sortDescriptorPrev.direction
    ) {
      sortDescriptor.direction = sortDescriptor.direction === "ascending" ? "descending" : "ascending";
    }
    setSortDescriptor(sortDescriptor);
    setSortDescriptorPrev(sortDescriptor);

    const sortedItems = sort(sortDescriptor, filteredItems);
    setSummary(sortedItems.items);
  };

  const sort = (sortDescriptor: SortDescriptor | undefined, filteredItems: Summary[]) => {
    if (!sortDescriptor) {
      return {
        items: filteredItems,
      };
    }
    return {
      items: filteredItems.sort((a, b) => {
        let first: string | number = a[sortDescriptor.column as keyof Summary];
        let second: string | number = b[sortDescriptor.column as keyof Summary];
        if (sortDescriptor.column === "created_at") {
          first = new Date(first) as any;
          second = new Date(second) as any;
          return sortDescriptor.direction === "ascending"
            ? compareDates(first, second)
            : compareDates(second, first);
        } else {
          let cmp =
            (parseInt(first.toString()) || first) < (parseInt(second.toString()) || second)
              ? -1
              : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }
      }),
    };
  };

  const compareDates = (date1: string | number, date2: string | number) => {
    if (date1 < date2) {
      return -1;
    } else if (date1 > date2) {
      return 1;
    } else {
      return 0;
    }
  };

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

  let initialValues: SummaryFilters = {
    waybill_id: "",
    date_rage: "",
  };

  const onClear = React.useCallback((filter: string) => {
    eval(`set${filter}("")`);
  }, []);

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

  const handleExport = async () => {
    try {
      let response: any = null;
      response = await exportExcelSummary(filters);
      if (response.status && response.status >= 200 && response.status <= 299) {
        showMsg(intl.formatMessage({ id: 'please_wait_file_being_generated' }), { type: "success" });
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

  const onRowsPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (Number(e.target.value) !== rowsPerPage) {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
      await reloadData(1, Number(e.target.value), filters);
    }
  }

  const types = [
    { value: "0", label: intl.formatMessage({ id: "general" }) },
    { value: "1", label: intl.formatMessage({ id: "by_carrier" }) }
  ]

  const topContent = React.useMemo(() => {
    return (
      <Formik initialValues={initialValues} onSubmit={() => { }}>
        <Form>
          <div className="flex flex-col gap-3">
            <div className="container-search-inputs">
              <div>
                <Select
                  isSearchable={false}
                  options={types}
                  value={type.trim() !== "" ? { value: type, label: type } : null}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setType(selectedOption.label);
                    } else {
                      setType("");
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
                  placeholder={intl.formatMessage({ id: "summary_type" })}
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
                  hasRepresentativeDateTimeIcon={true}
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
                  customClass="custom-input"
                  hideErrorContent={true}
                  hasRepresentativeDateTimeIcon={true}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex justify-start gap-3 items-start">
                <Button
                  color="primary"
                  onClick={(e) => handleSelectedFilters(e)}
                  disabled={(startDate !== "" && endDate === "") || startDate === "" && endDate !== ""}
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
                <Button
                  color="primary"
                  style={{ width: "140px" }}
                  endContent={
                    <FaFileExcel style={{ fontSize: "22px", color: "white" }} />
                  }
                  disabled={filteredItems.length === 0}
                  onClick={() => handleExport()}
                >
                  {intl.formatMessage({ id: "export_xlsx" })}
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                {intl.formatMessage({ id: "total_results" }, { in: summaryCount })}
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
                  <option value="200">200</option>
                  <option value="400">400</option>
                </select>
              </label>
            </div>
          </div>
        </Form>
      </Formik >
    );
  }, [
    summary.length,
    onRowsPerPageChange,
    intl,
    billCodeValue,
    startDate,
    endDate,
    rowsPerPage,
    page,
  ]);

  const changePage = async (newPage: number) => {
    if (page !== newPage) {
      setPage(newPage);
      setShowPagination(false);
      await reloadData(newPage, rowsPerPage, filters);
      setShowPagination(true);
    }
  }

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex elements-row-end">
        {showPagination && (
          <PaginationTable
            totalRecords={summaryCount}
            pageLimit={rowsPerPage}
            pageNeighbours={1}
            page={page}
            onPageChanged={changePage}
          />
        )}
        {!showPagination && (
          <div className="elements-center" style={{ height: "61px" }}>
            <SpinnerIconButton style={{ width: "20px", height: "20px" }} />
          </div>
        )}
      </div>
    );
  }, [
    filteredItems,
    page,
    summary.length,
    rowsPerPage,
    intl,
    summaryCount,
    showPagination,
  ]);

  return (
    <>
      <Loading loading={loading}>
        {topContent}
        <div className="overflow-x-auto tab-system-table">
          <Table
            aria-label="SUMMARY"
            isHeaderSticky
            classNames={{
              wrapper: "max-h-[auto]",
            }}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
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
              emptyContent={`${!noResults && loadingItems ? intl.formatMessage({ id: "loading_items" }) : intl.formatMessage({ id: "no_results_found" })}`}
              items={loadingItems ? [] : filteredItems}
            >
              {(item) => (
                <TableRow key={item.MWB}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {bottomContent}
      </Loading>
    </>
  );
};
export default SummaryTable;
