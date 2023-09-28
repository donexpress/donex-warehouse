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
import { CancelIcon } from "./../../common/CancelIcon";
import { CameraIcon } from "./../../common/CameraIcon";
import { ExportIcon } from "./../../common/ExportIcon";
import { VerticalDotsIcon } from "./../../common/VerticalDotsIcon";
import { ChevronDownIcon } from "./../../common/ChevronDownIcon";
import { SearchIcon } from "./../../common/SearchIcon";
import { capitalize, getDateFormat, getHourFormat } from "../../../../helpers/utils";
import { showMsg, storagePlanDataToExcel } from "../../../../helpers";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
import { getStoragePlans, removeStoragePlanById, updateStoragePlanById, storagePlanCount } from '../../../../services/api.storage_plan';
import { PackingList, StoragePlan, StoragePlanListProps } from "../../../../types/storage_plan";
import { Response } from "../../../../types";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import UploadEvidenceDialog from "../../common/UploadEvidenceDialog";
import PaginationTable from "../../common/Pagination";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import ReceiptPDF from '../../common/ReceiptPDF';
import EvidencePDF from '../../common/EvidencePDF';
import LocationSPLabelsPDF from '../../common/LocationSPLabelsPDF';
import ExportStoragePlansPDF from '../../common/ExportStoragePlansPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";

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

const INITIAL_VISIBLE_COLUMNS_OMS = [
  "order_number",
  "customer_order_number",
  "box_amount",
  "number_of_boxes_stored",
  "evidence",
  "actions",
];

const TableStoragePlan = ({ storagePlanStates, storagePCount, inWMS }: StoragePlanListProps) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [storagePlans, setStoragePlans] = useState<StoragePlan[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusSelected, setStatusSelected] = useState<string>('to be storage');
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const [stgPCount, setStgPCount] = useState(storagePCount);

  const [showCancelAllDialog, setShowCancelAllDialog] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [cancelElement, setCancelElement] = useState<StoragePlan | null>(null);

  const [showForceEntryDialog, setShowForceEntryDialog] = useState<boolean>(false);
  const [forceEntryElement, setForceEntryElement] = useState<StoragePlan | null>(null);

  const [showUploadEvidenceDialog, setShowUploadEvidenceDialog] = useState<boolean>(false);
  const [uploadEvidenceElement, setUploadEvidenceElement] = useState<StoragePlan | null>(null);

  /** start*/
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(inWMS ? INITIAL_VISIBLE_COLUMNS : INITIAL_VISIBLE_COLUMNS_OMS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "customer_order_number",
    direction: "descending",
  });
  const [statusOptions, setStatusOptions] = React.useState<{ name: string, uid: string}[]>([]);

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const getColumns = React.useMemo(() => {
    const columns = inWMS ? [
      { name: "ID", uid: "id", sortable: false },
      {
        name: intl.formatMessage({ id: "warehouse_order_number" }),
        uid: "order_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "customer_order_number" }),
        uid: "customer_order_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "user" }),
        uid: "user_id",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "storage" }),
        uid: "warehouse_id",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "number_of_boxes_entered" }),
        uid: "box_amount",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "number_of_boxes_stored" }),
        uid: "number_of_boxes_stored",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "evidence" }),
        uid: "evidence",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "reference_number" }),
        uid: "reference_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "pr_number" }),
        uid: "pr_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "state" }),
        uid: "state",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "delivery_time" }),
        uid: "delivered_time",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "observations" }),
        uid: "observations",
        sortable: false,
      },
      { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ] :  [
      { name: "ID", uid: "id", sortable: false },
      {
        name: intl.formatMessage({ id: "warehouse_order_number" }),
        uid: "order_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "customer_order_number" }),
        uid: "customer_order_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "number_of_boxes_entered" }),
        uid: "box_amount",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "number_of_boxes_stored" }),
        uid: "number_of_boxes_stored",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "evidence" }),
        uid: "evidence",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "storage" }),
        uid: "warehouse_id",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "reference_number" }),
        uid: "reference_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "pr_number" }),
        uid: "pr_number",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "state" }),
        uid: "state",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "delivery_time" }),
        uid: "delivered_time",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "observations" }),
        uid: "observations",
        sortable: false,
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
          storageP.order_number
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
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
            ?.includes(filterValue.toLowerCase()) ||
          storageP.reference_number
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          storageP.pr_number
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredStoragePlans = filteredStoragePlans.filter((sp) =>
        // @ts-ignore
        Array.from(statusFilter).includes(sp.rejected_boxes ? 'rejected_boxes' : (sp.return ? 'return' : 'normal'))
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
        case "delivered_time":
          return cellValue !== null ? (<span>{getDateFormat(cellValue)}, {getHourFormat(cellValue)}</span>) : '';
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
                  <DropdownItem className={(!storageP["history"] || (storageP["history"].length === 0)) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleHistory(storageP["id"])}>
                    {intl.formatMessage({ id: "history" })}
                  </DropdownItem>
                  <DropdownItem className={statusSelected !== 'to be storage' ? 'do-not-show-dropdown-item' : ''} onClick={() => openCancelStoragePlanDialog(storageP)}>
                    {intl.formatMessage({ id: "cancel" })}
                  </DropdownItem>
                  <DropdownItem className={statusSelected !== 'into warehouse' ? 'do-not-show-dropdown-item' : ''} onClick={() => openForceEntryStoragePlanDialog(storageP)}>
                    {intl.formatMessage({ id: "force_entry" })}
                  </DropdownItem>
                  <DropdownItem className={(!inWMS || (statusSelected !== 'into warehouse' && statusSelected !== 'stocked')) ? 'do-not-show-dropdown-item' : ''} onClick={() => openUploadEvidenceStoragePlanDialog(storageP)}>
                    {intl.formatMessage({ id: "upload_evidence" })}
                  </DropdownItem>
                  <DropdownItem className={((statusSelected !== 'into warehouse' && statusSelected !== 'stocked') || !storageP.images || (storageP.images && storageP.images.length === 0)) ? 'do-not-show-dropdown-item' : ''}>
                    <PDFDownloadLink document={<EvidencePDF storagePlan={storageP as StoragePlan} intl={intl} />} fileName="evidence_pdf.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "generate_evidence" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  <DropdownItem onClick={() => storagePlanDataToExcel([storageP], intl, visibleColumns)}>
                    {intl.formatMessage({ id: "export" })}
                  </DropdownItem>
                  <DropdownItem>
                    <PDFDownloadLink document={<ExportStoragePlansPDF storagePlans={[storageP]} intl={intl} selection={visibleColumns} />} fileName="entry_plans_data_pdf.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "export_pdf" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  <DropdownItem className={statusSelected !== 'stocked' ? 'do-not-show-dropdown-item' : ''}>
                    <PDFDownloadLink document={<ReceiptPDF storagePlan={storageP as StoragePlan} intl={intl} />} fileName="receipt_pdf.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "generate_receipt" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  <DropdownItem className={(statusSelected !== 'stocked' && statusSelected !== 'into warehouse') ? 'do-not-show-dropdown-item' : ''}>
                    <PDFDownloadLink document={<LocationSPLabelsPDF packingLists={storageP["packing_list"] ? storageP["packing_list"] : []} warehouseCode={String(storageP["warehouse"]?.code)} orderNumber={String(storageP["order_number"])} intl={intl} />} fileName="entry_plan_labels.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "generate_labels" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  {/* <DropdownItem onClick={() => handleDelete(storageP["id"])}>
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "user_id": return storageP.user ? storageP.user.username : '';
        case "evidence": return storageP.images ? (storageP.images.length) : 0;
        case "state": return storageP.rejected_boxes ? intl.formatMessage({ id: "rejected_boxes" }) : (storageP.return ? intl.formatMessage({ id: "return" }) : intl.formatMessage({ id: "normal" }));
        case "warehouse_id": return storageP.warehouse ? (`${storageP.warehouse.name} (${storageP.warehouse.code})`) : '';
        case "order_number": return (
          <CopyColumnToClipboard
            value={
              <span style={{ cursor: 'pointer' }} onClick={()=>{handleConfig(storageP["id"])}}>{storageP.order_number}</span>
            }
          />
        );
        case "reference_number": return (
          <CopyColumnToClipboard
            value={
              <span>{storageP.reference_number}</span>
            }
          />
        );
        case "pr_number": return (
          <CopyColumnToClipboard
            value={
              <span>{storageP.pr_number}</span>
            }
          />
        );
        case "number_of_boxes_stored": return (
          storageP.packing_list && storageP.packing_list.length > 0 ? (storageP.packing_list.filter((pl: PackingList) => pl.package_shelf && pl.package_shelf.length > 0).length) : '0'
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

  const getLabelByLanguage = (state: any) => {
    if (locale === 'es') {
      return state.es_name + getCountByState(state);
    } else if (locale === 'zh') {
      return state.zh_name + getCountByState(state);
    }
    return state.name + getCountByState(state);
  };

  const getCountByState = (state: any) => {
    if (stgPCount) {
      switch(state.value) {
        case 'to be storage': return ` (${stgPCount.to_be_storage})`;
        case 'into warehouse': return ` (${stgPCount.into_warehouse})`;
        case 'stocked': return ` (${stgPCount.stocked})`;
        case 'cancelled': return ` (${stgPCount.cancelled})`;
        case 'returns': return ` (${stgPCount.returns})`;
        case 'refused': return ` (${stgPCount.refused})`;
      }
    }
    return '';
  }

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
      await setLoadingItems(true);
      await setStatusSelected(tab);
      const storagePlanss = await getStoragePlans(tab);
      await setStoragePlans(storagePlanss !== null ? storagePlanss : []);      
      await setLoadingItems(false);
      setSelectedItems([]);
      setSelectedKeys(new Set([]));
    }
  }

  const getSelectedStoragePlans = (): StoragePlan[] => {
    let its: StoragePlan[] = [];
    for (let i = 0; i < selectedItems.length; i++) {
      const index = selectedItems[i];
      const item = storagePlans.filter((sp: StoragePlan) => sp.id === index);
      if (filterValue && (filterValue !== "")) {
        const isSearchable = item[0].order_number
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase()) ||
        item[0].customer_order_number
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase()) ||
        item[0].user_id
        ?.toString()
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase()) ||
        item[0].warehouse_id
        ?.toString()
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase()) ||
        item[0].reference_number
        ?.toString()
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase()) ||
        item[0].pr_number
        ?.toString()
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase());

        if (isSearchable) {
          its.push(item[0]);
        }
      } else {
        its.push(item[0]);
      }
    }
    return its;
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-2 mb-2">
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
        <div className="elements-row-end">
            {
              (inWMS && (statusSelected === 'into warehouse' || statusSelected === 'stocked')) && (
                <Button
                  color="primary"
                  style={{ width: '160px', marginLeft: '10px' }}
                  endContent={<CameraIcon />}
                  onClick={() => openUploadEvidenceStoragePlanDialog()}
                  isDisabled={selectedItems.length === 0 || selectedItems.length > 1}
                >
                  {intl.formatMessage({ id: "upload_evidence" })}
                </Button>
              )
            }
            <Button
              color="primary"
              style={{ width: '140px', marginLeft: '10px' }}
              endContent={<ExportIcon />}
              isDisabled={selectedItems.length === 0}
            >
              <PDFDownloadLink document={<ExportStoragePlansPDF storagePlans={getSelectedStoragePlans()} intl={intl} selection={visibleColumns} />} fileName="entry_plans_data_pdf.pdf">
                {({ blob, url, loading, error }) =>
                  intl.formatMessage({ id: "export_pdf" })
                }
              </PDFDownloadLink>
            </Button>

            <Button
              color="primary"
              style={{ width: '121px', marginLeft: '10px' }}
              endContent={<ExportIcon />}
              onClick={() => handleExportStoragePlanData()}
              isDisabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "export" })}
            </Button>
            {
              statusSelected === 'to be storage' && (
                <Button
                  color="primary"
                  style={{ width: '121px', marginLeft: '10px' }}
                  endContent={<CancelIcon />}
                  onClick={() => openCancelAllStoragePlanDialog()}
                  isDisabled={selectedItems.length === 0}
                >
                  {intl.formatMessage({ id: "cancel" })}
                </Button>
              )
            }
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
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        <div className="bg-gray-200 pt-1">
          <div className="overflow-x-auto tab-system-table bg-content1">
            <ul className="flex space-x-4">
              {storagePlanStates.map((column, index) => (
                  <li key={index} className="whitespace-nowrap">
                    <button className={ statusSelected === column.value ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                      onClick={() => changeTab(column.value)}
                    >
                      {getLabelByLanguage(column)}
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
    storagePlans.length,
    hasSearchFilter,
    intl,
    statusSelected,
    selectedItems,
    stgPCount,
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
    setStatusOptions([
      {
        name: intl.formatMessage({ id: "normal" }),
        uid: 'normal'
      },
      {
        name: intl.formatMessage({ id: "return" }),
        uid: 'return'
      },
      {
        name: intl.formatMessage({ id: "rejected_boxes" }),
        uid: 'rejected_boxes'
      }
    ]);
  }, [intl]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadStoragePlans = async (loadCount: boolean = false) => {
    setLoading(true);
    await setLoadingItems(true);
    const storagePlanss = await getStoragePlans(statusSelected);
    
    setStoragePlans(storagePlanss !== null ? storagePlanss : []);
    await setLoadingItems(false);
    if (loadCount) {
      const storagePCount = await storagePlanCount();
      setStgPCount(storagePCount ? storagePCount : undefined);
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/update`);
  };

  const handleHistory = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/history`);
  };

  const handleConfig = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/insert`);
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
  };

  const confirm = async () => {
    setLoading(true);
    const response = await removeStoragePlanById(deleteElement);
    if (response.status >= 200 && response.status <= 299) {
      showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
    close();
    await loadStoragePlans();
    setLoading(false);
  };
  
  const formatBodyToCancel = (values: StoragePlan, state: string = ''): StoragePlan => {
    return {
            user_id: values.user_id ? Number(values.user_id) : null,
            warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
            customer_order_number: values.customer_order_number,
            box_amount: values.box_amount,
            delivered_time: values.delivered_time,
            observations: values.observations,
            rejected_boxes: values.rejected_boxes,
            return: values.return,
            state: state !== '' ? state : 'cancelled',
          };
  }

  const handleExportStoragePlanData = () => {
    storagePlanDataToExcel(getSelectedStoragePlans(), intl, visibleColumns);
  }

  const handleCancelAll = async() => {
    setLoading(true);
    for (let i = 0; i < selectedItems.length; i++) {
      const index = selectedItems[i];
      const item = storagePlans.filter((sp: StoragePlan) => sp.id === index);
      
      if (item.length > 0) {
        const response: Response = await updateStoragePlanById(index, formatBodyToCancel(item[0]));
        if (((selectedItems.length-1) === index)) {
          if (response.status >= 200 && response.status <= 299) {
            const message = selectedItems.length > 1 ? intl.formatMessage({ id: 'items_has_been_canceled' }) : intl.formatMessage({ id: 'item_has_been_canceled' });
            showMsg(message, { type: "success" });
          } else {
            let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
            showMsg(message, { type: "error" });
          }
        }
      }
    }
    await setShowCancelAllDialog(false);
    await setSelectedItems([]);
    await setSelectedKeys(new Set([]));
    await loadStoragePlans();
  };

  const handleCancel = async() => {
    if (cancelElement !== null) {
      setLoading(true);
      const response: Response = await updateStoragePlanById(Number(cancelElement.id), formatBodyToCancel(cancelElement));
      if (response.status >= 200 && response.status <= 299) {
        const message = intl.formatMessage({ id: 'item_has_been_canceled' });
        showMsg(message, { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
      closeCancelStoragePlanDialog();
      await loadStoragePlans(true);
    }
  }

  const handleForceEntry = async() => {
    if (forceEntryElement !== null) {
      setLoading(true);
      const response: Response = await updateStoragePlanById(Number(forceEntryElement.id), formatBodyToCancel(forceEntryElement, 'stocked'));
      if (response.status >= 200 && response.status <= 299) {
        const message = intl.formatMessage({ id: 'successfullyActionMsg' });
        showMsg(message, { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
      closeForceEntryStoragePlanDialog();
      await loadStoragePlans(true);
    }
  }

  const handleUploadEvidence = async(images: string[]) => {
    if (uploadEvidenceElement !== null) {
      setLoading(true);
      const response: Response = await updateStoragePlanById(Number(uploadEvidenceElement.id), formatBodyToUploadEvidence(uploadEvidenceElement, images));
      if (response.status >= 200 && response.status <= 299) {
        setStoragePlans(storagePlans.map((sp: StoragePlan) => {
          return uploadEvidenceElement.id !== sp.id ? sp : {...sp, images: images, is_images: (images && images.length > 1)};
        }));
        const message = intl.formatMessage({ id: 'successfullyActionMsg' });
        showMsg(message, { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
      setLoading(false);
      closeUploadEvidenceStoragePlanDialog();
    }
  }
  
  const formatBodyToUploadEvidence = (values: StoragePlan, images: string[]): StoragePlan => {
    return {
            user_id: values.user_id ? Number(values.user_id) : null,
            warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
            customer_order_number: values.customer_order_number,
            box_amount: values.box_amount,
            delivered_time: values.delivered_time,
            observations: values.observations,
            rejected_boxes: values.rejected_boxes,
            return: values.return,
            state: values.state,
            images: images,
            is_images: (images && images.length !== 0),
          };
  }

  const openCancelAllStoragePlanDialog = () => {
    setShowCancelAllDialog(true);
  }

  const openCancelStoragePlanDialog = (sp: StoragePlan) => {
    setCancelElement(sp);
    setShowCancelDialog(true);
  }

  const openForceEntryStoragePlanDialog = (sp: StoragePlan) => {
    setForceEntryElement(sp);
    setShowForceEntryDialog(true);
  }

  const openUploadEvidenceStoragePlanDialog = async(storagePl: StoragePlan | null = null) => {
    if (storagePl !== null || selectedItems.length === 1) {
      let items: StoragePlan[] = [];
      if (storagePl !== null) {
        items = [storagePl];
      } else {
        const index = selectedItems[0];
        items = storagePlans.filter((sp: StoragePlan) => sp.id === index);
      }
      if (items.length > 0) {
        await setUploadEvidenceElement(items[0]);
        setShowUploadEvidenceDialog(true);
      }
    }
  }

  const closeCancelAllStoragePlanDialog = () => {
    setShowCancelAllDialog(false);
  }

  const closeCancelStoragePlanDialog = () => {
    setCancelElement(null);
    setShowCancelDialog(false);
  }

  const closeForceEntryStoragePlanDialog = () => {
    setForceEntryElement(null);
    setShowForceEntryDialog(false);
  }

  const closeUploadEvidenceStoragePlanDialog = () => {
    setUploadEvidenceElement(null);
    setShowUploadEvidenceDialog(false);
  }

  const selectedItemsFn = (selection: Selection) => {
    setSelectedKeys(selection);
    if (selection === 'all') {
      setSelectedItems(storagePlans.map((sp: StoragePlan) => Number(sp.id)));
    } else {
      setSelectedItems(Array.from(selection.values()).map(cadena => parseInt(cadena.toString())))
    }
  }

  return (
    <>
      <Loading loading={loading}>
        {topContent}
        <div className="overflow-x-auto tab-system-table">
        <Table
          aria-label="USER"
          isHeaderSticky
          classNames={{
            wrapper: "max-h-[auto]",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
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
        </div>
        {bottomContent}
        {showConfirm && <ConfirmationDialog close={close} confirm={confirm} />}
        {showCancelAllDialog && <ConfirmationDialog close={closeCancelAllStoragePlanDialog} confirm={handleCancelAll} />}
        {showCancelDialog && <ConfirmationDialog close={closeCancelStoragePlanDialog} confirm={handleCancel} />}
        {showForceEntryDialog && <ConfirmationDialog close={closeForceEntryStoragePlanDialog} confirm={handleForceEntry} />}
        {showUploadEvidenceDialog && <UploadEvidenceDialog close={closeUploadEvidenceStoragePlanDialog} confirm={handleUploadEvidence} storagePlan={(uploadEvidenceElement as StoragePlan)} title={intl.formatMessage({ id: "upload_evidence" })} />}
      </Loading>
    </>
  );
};

export default TableStoragePlan;