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
import { showMsg, storagePlanDataToExcel, packingListDataToExcel, getLocationPackages } from "../../../../helpers";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import "../../../../styles/wms/user.table.scss";
import { getStoragePlans, removeStoragePlanById, updateStoragePlanById, storagePlanCount, barCodePdf } from '../../../../services/api.storage_plan';
import { autoAssignLocation } from '../../../../services/api.package_shelf';
import { PackingList, StoragePlan, StoragePlanListProps, BarCode } from "../../../../types/storage_plan";
import { Response } from "../../../../types";
import { InputData } from "../../../../types/general_search";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import UploadEvidenceDialog from "../../common/UploadEvidenceDialog";
import BatchOnStoragePlansDialog from "../../common/BatchOnStoragePlansDialog";
import ExportBarCodeDialog from "../../common/ExportBarCodeDialog";
import PaginationTable from "../../common/Pagination";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import ReceiptPDF from '../../common/ReceiptPDF';
import EvidencePDF from '../../common/EvidencePDF';
import SpinnerIconButton from "../../common/SpinnerIconButton";
import LocationSPLabelsPDF from '../../common/LocationSPLabelsPDF';
import ExportStoragePlansPDF from '../../common/ExportStoragePlansPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";
import GeneralSearchCmpt from "../../common/GeneralSearchCmpt";
import { FaFileExcel, FaFilePdf, FaTrashAlt, FaFilter, FaTimes } from 'react-icons/fa';
import { FaBarcode } from 'react-icons/fa6';
import { setCookie, getCookie } from "../../../../helpers/cookieUtils";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "order_number",
  "customer_order_number",
  "number_of_boxes_stored",
  "location",
  "reference_number",
  "box_amount",
  "actions",
];

const INITIAL_VISIBLE_COLUMNS_OMS = [
  "order_number",
  "customer_order_number",
  "box_amount",
  "number_of_boxes_stored",
  "location",
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
  const [showPagination, setShowPagination] = useState<boolean>(true);
  
  const [stgPCount, setStgPCount] = useState(storagePCount);

  const [showCancelAllDialog, setShowCancelAllDialog] = useState<boolean>(false);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [cancelElement, setCancelElement] = useState<StoragePlan | null>(null);

  const [showForceEntryDialog, setShowForceEntryDialog] = useState<boolean>(false);
  const [forceEntryElement, setForceEntryElement] = useState<StoragePlan | null>(null);

  const [showUploadEvidenceDialog, setShowUploadEvidenceDialog] = useState<boolean>(false);
  const [uploadEvidenceElement, setUploadEvidenceElement] = useState<StoragePlan | null>(null);

  const [showAssignAutoDialog, setShowAssignAutoDialog] = useState<boolean>(false);
  const [autoAssignElement, setAutoAssignElement] = useState<StoragePlan | null>(null);
  
  const [showBatchStoragePlansDialog, setShowBatchStoragePlansDialog] = useState<boolean>(false);

  const [showBarCodeDialog, setShowBarCodeDialog] = useState<boolean>(false);
  const [barCodeValue, setBarCodeValue] = useState<any>("");

  /** start*/
  const [searchInputs, setSearchInputs] = useState<InputData[]>([
    {
      key: 'customer_order_number',
      initialValue: '',
      placeholder: intl.formatMessage({ id: "customer_order_number" }),
      type: 'text'
    },{
      key: 'order_number',
      initialValue: '',
      placeholder: intl.formatMessage({ id: "warehouse_order_number" }),
      type: 'text'
    },{
      key: 'pr_number',
      initialValue: '',
      placeholder: intl.formatMessage({ id: "pr_number" }),
      type: 'text'
    },{
      key: 'reference_number',
      initialValue: '',
      placeholder: intl.formatMessage({ id: "reference_number" }),
      type: 'text'
    }
  ]);
  const [shouldResetFields, setShouldResetFields] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [queryFilter, setQueryFilter] = React.useState("");
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
  const [isLoadCounts, setIsLoadCounts] = React.useState<boolean>(false);

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
        name: intl.formatMessage({ id: "outgoing_order" }),
        uid: "outgoing_order",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "dispatched_boxes" }),
        uid: "dispatched_boxes",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "location" }),
        uid: "location",
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
      {
        name: intl.formatMessage({ id: "created_at" }),
        uid: "created_at",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "updated_at" }),
        uid: "updated_at",
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
        name: intl.formatMessage({ id: "outgoing_order" }),
        uid: "outgoing_order",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "dispatched_boxes" }),
        uid: "dispatched_boxes",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "location" }),
        uid: "location",
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
      {
        name: intl.formatMessage({ id: "created_at" }),
        uid: "created_at",
        sortable: false,
      },
      {
        name: intl.formatMessage({ id: "updated_at" }),
        uid: "updated_at",
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

  const somePLWithoutOutputPlanDeliveredNumber = (pls: PackingList[] | undefined): boolean => {
    return !!pls && (pls.length > 0) && pls.some((pl: PackingList) => !pl.output_plan_delivered_number);
  }

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
        case "created_at":
          return cellValue !== null ? (<span>{getDateFormat(cellValue)}, {getHourFormat(cellValue)}</span>) : '';
        case "updated_at":
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
                  <DropdownItem className={(!inWMS && statusSelected !== 'to be storage') ? 'do-not-show-dropdown-item' : ''} onClick={() => handleEdit(storageP["id"])}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleConfig(storageP["id"])}>
                    {intl.formatMessage({ id: "config" })}
                  </DropdownItem>
                  <DropdownItem className={(!storageP["history"] || (storageP["history"].length === 0)) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleHistory(storageP["id"])}>
                    {intl.formatMessage({ id: "history" })}
                  </DropdownItem>
                  <DropdownItem className={(statusSelected !== 'to be storage') ? 'do-not-show-dropdown-item' : ''} onClick={() => openCancelStoragePlanDialog(storageP)}>
                    {intl.formatMessage({ id: "cancel" })}
                  </DropdownItem>
                  <DropdownItem className={(!inWMS || statusSelected !== 'into warehouse') ? 'do-not-show-dropdown-item' : ''} onClick={() => openForceEntryStoragePlanDialog(storageP)}>
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
                    {intl.formatMessage({ id: "export_xlsx" })}
                  </DropdownItem>
                  <DropdownItem>
                    <PDFDownloadLink document={<ExportStoragePlansPDF storagePlans={[storageP]} intl={intl} selection={visibleColumns} />} fileName="entry_plans_data_pdf.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "export_pdf" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  <DropdownItem onClick={() => generateBarCode(storageP)}>
                    {intl.formatMessage({ id: "generate_labels" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => packingListDataToExcel(storageP, storageP.packing_list ? storageP.packing_list : [], intl, 'fl' )}>
                    {intl.formatMessage({ id: "generate_xlsx_inventory" })}
                  </DropdownItem>
                  <DropdownItem>
                    <PDFDownloadLink document={<ReceiptPDF storagePlan={storageP as StoragePlan} intl={intl} />} fileName="inventory_pdf.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "generate_pdf_inventory" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  <DropdownItem className={(statusSelected !== 'stocked' || !somePLWithoutOutputPlanDeliveredNumber(storageP.packing_list)) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleCreateExitPlan(storageP["customer_order_number"])}>
                    {intl.formatMessage({ id: "insertOutputPlan" })}
                  </DropdownItem>
                  <DropdownItem className={(statusSelected !== 'stocked' && statusSelected !== 'into warehouse') ? 'do-not-show-dropdown-item' : ''}>
                    <PDFDownloadLink document={<LocationSPLabelsPDF packingLists={storageP["packing_list"] ? storageP["packing_list"] : []} warehouseCode={String(storageP["warehouse"]?.code)} orderNumber={String(storageP["order_number"])} intl={intl} />} fileName="entry_plan_labels.pdf">
                      {({ blob, url, loading, error }) =>
                        intl.formatMessage({ id: "generate_location_tag" })
                      }
                    </PDFDownloadLink>
                  </DropdownItem>
                  <DropdownItem className={(!inWMS || (statusSelected === 'cancelled')) ? 'do-not-show-dropdown-item' : ''} onClick={() => openAssignAutoDialog(storageP)}>
                    {intl.formatMessage({ id: "batch_on_shelves_auto" })}
                  </DropdownItem>
                  <DropdownItem className={(!inWMS && statusSelected !== 'to be storage' && statusSelected !== 'cancelled') ? 'do-not-show-dropdown-item' : ''} onClick={() => handleDelete(storageP["id"])}>
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem>
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
        case "customer_order_number": return (
          <CopyColumnToClipboard
            value={
              <span>{storageP.customer_order_number}</span>
            }
          />
        );
        case "number_of_boxes_stored": return (
          storageP.packing_list && storageP.packing_list.length > 0 ? (storageP.packing_list.filter((pl: PackingList) => pl.package_shelf && pl.package_shelf.length > 0).length) : '0'
        ) - storageP.packing_list.filter((el: any) => el.dispatched).length;
        case "outgoing_order":
          return storageP.packing_list ? (storageP.packing_list.filter((el: any) => el.output_plan_delivered_number).length) : 0;
        case "dispatched_boxes":
          return storageP.packing_list.filter((el: any) => el.dispatched).length;
        case "location":
          return (
            <span
              style={{
                maxWidth: "250px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                display: "block",
              }}
            >
              {getLocationPackages(storageP)}
            </span>
          );
        default:
          return cellValue;
      }
    },
    [intl, statusSelected]
  );

  const onRowsPerPageChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
      if (Number(e.target.value) !== rowsPerPage) {
        setSelectedItems([]);
        setSelectedKeys(new Set([]));
        setRowsPerPage(Number(e.target.value));
        setPage(1);
        await loadStoragePlans(statusSelected, 1, Number(e.target.value), queryFilter, false, true);
      }
  }

  const getLabelByLanguage = (state: any) => {
    if (locale === 'es') {
      return state.es_name + getCountByState(state.value);
    } else if (locale === 'zh') {
      return state.zh_name + getCountByState(state.value);
    }
    return state.name + getCountByState(state.value);
  };

  const getCountByState = (state: any) => {
    if (stgPCount) {
      const myCount = getCount(state);
      return myCount !== '' ? ` (${myCount})` : myCount;
    }
    return '';
  }

  const getCount = (state: any) => {
    if (stgPCount) {
      switch(state) {
        case 'to be storage': return `${(statusSelected === 'to be storage' && isLoadCounts) ? 0 : stgPCount.to_be_storage}`;
        case 'into warehouse': return `${(statusSelected === 'into warehouse' && isLoadCounts) ? 0 : stgPCount.into_warehouse}`;
        case 'stocked': return `${(statusSelected === 'stocked' && isLoadCounts) ? 0 : stgPCount.stocked}`;
        case 'cancelled': return `${(statusSelected === 'cancelled' && isLoadCounts) ? 0 : stgPCount.cancelled}`;
      }
    }
    return '';
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchValues();
    }
  }

  const searchValues = async() => {
    if (filterValue && filterValue !== "") {
      await setQueryFilter(filterValue);
    } else {
      await setQueryFilter("");
    }
    await setPage(1);
    await loadStoragePlans(statusSelected, 1, rowsPerPage, filterValue ? filterValue : "", true, true);
  }

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(async() => {
    await setFilterValue("");
    await setQueryFilter("");
    await setPage(1);
    await loadStoragePlans(statusSelected, 1, rowsPerPage, "", true, true);
  }, []);
  
  const changeTab = async(tab: string) => {
    if (tab !== statusSelected && !loadingItems) {
      setCookie("tabSP", tab);
      if (visibleColumns !== "all") {
        let items: Set<React.Key> = new Set(visibleColumns);
        if (tab === 'stocked') {
          if (!visibleColumns.has("dispatched_boxes")) {
            items.add("dispatched_boxes");
          }
          if (!visibleColumns.has("outgoing_order")) {
            items.add("outgoing_order");
          }
          if (!visibleColumns.has("dispatched_boxes") || !visibleColumns.has("outgoing_order")) {
            setVisibleColumns(items);
          }
        } else {
          if (visibleColumns.has("dispatched_boxes")) {
            items.delete("dispatched_boxes");
          }
          if (visibleColumns.has("outgoing_order")) {
            items.delete("outgoing_order");
          }
          if (visibleColumns.has("dispatched_boxes") || visibleColumns.has("outgoing_order")) {
            setVisibleColumns(items);
          }
        }
      }
      await setLoadingItems(true);
      await setStatusSelected(tab);
      const storagePlanss = await getStoragePlans(tab, 1, rowsPerPage, queryFilter);
      await setStoragePlans(storagePlanss !== null ? storagePlanss : []);      
      await setLoadingItems(false);
      setSelectedItems([]);
      setSelectedKeys(new Set([]));
      if (page !== 1) {
        setPage(1);
      }
    }
  }

  const openBarCodeDialog = async(value: any) => {
    await setBarCodeValue(value);
    setShowBarCodeDialog(true);
  }

  const closeBarCodeDialog = () => {
    setBarCodeValue("");
    setShowBarCodeDialog(false);
  }

  const generateBarCode = async(sp?: StoragePlan) => {
    let sPlans: StoragePlan[] = [];
    if (sp) {
      sPlans.push(sp);
    } else {
      for (let i = 0; i < selectedItems.length; i++) {
        const index = selectedItems[i];
        const item = storagePlans.filter((sp: StoragePlan) => sp.id === index);
        if (item && item.length > 0) {
          sPlans.push(item[0]);
        }
      }
    }

    const code: string[] = sPlans.map((sPlan: StoragePlan) => {
      return sPlan.order_number ? sPlan.order_number : ''
    });

    const response = await barCodePdf(code);
    if (response.status >= 200 && response.status <= 299) {
      openBarCodeDialog(response.data);
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
  }

  const openAssignAutoDialog = async(sp: StoragePlan) => {
    await setAutoAssignElement(sp);
    setShowAssignAutoDialog(true);
  }

  const closeAssignAutoDialog = () => {
    setAutoAssignElement(null);
    setShowAssignAutoDialog(false);
  }

  const autoAssignLocationAction = async() => {
    if (autoAssignElement !== null) {
      setLoading(true);
      let response = await autoAssignLocation(Number(autoAssignElement.id));
      if (response.status >= 200 && response.status <= 299) {
        if (response.data.success) {
          closeAssignAutoDialog();
          if (autoAssignElement.state !== 'stocked') {
            await updateStoragePlanById(Number(autoAssignElement.id), formatBodyToCancel(autoAssignElement, 'stocked'));
          }
          showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
          await setLoading(false);
          await setSelectedItems([]);
          await setSelectedKeys(new Set([]));
          loadStoragePlans(statusSelected, page, rowsPerPage, queryFilter, true, true);
        } else {
          closeAssignAutoDialog();
          setLoading(false);
          showMsg(intl.formatMessage({ id: 'no_space_auto_location' }), { type: "warning" })
        }
      } else {
        closeAssignAutoDialog();
        setLoading(false);
        showMsg(intl.formatMessage({ id: 'unknownStatusErrorMsg' }), { type: "error" })
      }
    }
  }

  const getSelectedStoragePlans = (): StoragePlan[] => {
    let its: StoragePlan[] = [];
    for (let i = 0; i < selectedItems.length; i++) {
      const index = selectedItems[i];
      const item = storagePlans.filter((sp: StoragePlan) => sp.id === index);
      
      its.push(item[0]);
    }
    return its;
  }

  const getQuery = (q: string) => {
    setFilterValue(q);
  };

  const handleClearAll = async() => {
    setShouldResetFields(!shouldResetFields);
    await onClear();
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-2 mb-2">
        <GeneralSearchCmpt data={searchInputs} getQueryFn={getQuery} shouldResetFields={shouldResetFields} />
        <div className="flex justify-between gap-3 items-end">
          <div className="w-full sm:max-w-[33%] flex justify-start gap-3 items-start" style={{ position: 'relative' }}>
            {/* <Input
              isClearable
              className="search-input input-search-list"
              placeholder=""
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
              onKeyPress={handleKeyPress}
            />
            <div style={{ position: 'absolute', top: '0px', right: '0px', bottom: '0px', width: '40px', background: '#37446b', borderRadius: '0 5px 5px 0', cursor: 'pointer' }} className="elements-center" onClick={() => searchValues()}>
              <SearchIcon />
            </div> */}
            <Button
              color="primary"
              onClick={(e) => searchValues()}
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
                className="custom-dropdown-menu"
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
              style={{ width: '170px', marginLeft: '10px' }}
              endContent={<FaBarcode style={{ fontSize: '22px', color: 'white' }} />}
              onClick={() => generateBarCode()}
              isDisabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "generate_labels" })}
            </Button>

            <Button
              color="primary"
              style={{ width: '121px', marginLeft: '10px' }}
              endContent={<FaFileExcel style={{ fontSize: '22px', color: 'white' }} />}
              onClick={() => openBatchOnStoragePlansDialog()}
            >
              {intl.formatMessage({ id: "import" })}
            </Button>

            <Button
              color="primary"
              style={{ width: '140px', marginLeft: '10px' }}
              endContent={<FaFilePdf style={{ fontSize: '22px', color: 'white' }} />}
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
              style={{ width: '140px', marginLeft: '10px' }}
              endContent={<FaFileExcel style={{ fontSize: '22px', color: 'white' }} />}
              onClick={() => handleExportStoragePlanData()}
              isDisabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "export_xlsx" })}
            </Button>
            {
              (statusSelected === 'to be storage') && (
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
            {
              (inWMS || (!inWMS && (statusSelected === 'to be storage' || statusSelected === 'cancelled'))) && (
                <Button
                  color="primary"
                  style={{ width: '121px', marginLeft: '10px' }}
                  endContent={<FaTrashAlt style={{ fontSize: '20px', color: 'white' }} />}
                  onClick={() => handleDelete(-1)}
                  isDisabled={selectedItems.length === 0}
                >
                  {intl.formatMessage({ id: "Delete" })}
                </Button>
              )
            }
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {intl.formatMessage({ id: "total_results" }, { in: getCount(statusSelected) })}
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
    shouldResetFields,
    searchInputs
  ]);

  const changePage = async(newPage: number) => {
    if (page !== newPage) {
      setSelectedItems([]);
      setSelectedKeys(new Set([]));
      setPage(newPage);
      await setShowPagination(false);
      await loadStoragePlans(statusSelected, newPage, rowsPerPage, queryFilter, false, true);
      await setShowPagination(true);
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
                { in: selectedKeys.size, end: getCount(statusSelected) }
              )}`}
        </span>
        {
          showPagination && (
            <PaginationTable
              totalRecords={getCount(statusSelected)}
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
              <SpinnerIconButton style={{width: "20px", height: "20px"}}/>
            </div>
          )
        }
      </div>
    );
  }, [
    selectedKeys,
    stgPCount,
    page,
    storagePlans.length,
    rowsPerPage,
    hasSearchFilter,
    intl,
    showPagination,
  ]);
  /** end*/

  useEffect(() => {
    const tab = getCookie("tabSP");
    if (tab) {
      setStatusSelected(tab);
      if (tab === 'stocked') {
        let items: Set<React.Key> = new Set(visibleColumns);
        items.add("dispatched_boxes");
        items.add("outgoing_order");
        setVisibleColumns(items);
      }
    }
    loadStoragePlans(tab ? tab : statusSelected);
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

  const loadStoragePlans = async (status: string, pageSP: number = -1, rowsPerPageSP: number = -1, querySP: string = "", loadCount: boolean = false, partialLoad: boolean = false) => {
    if (!partialLoad) {
      setLoading(true);
    }
    if (loadCount) {
      setIsLoadCounts(true);
    }
    await setLoadingItems(true);
    const storagePlanss = await getStoragePlans(status, pageSP !== -1 ? pageSP : page, rowsPerPageSP !== -1 ? rowsPerPageSP : rowsPerPage, querySP);
    
    setStoragePlans(storagePlanss !== null ? storagePlanss : []);
    await setLoadingItems(false);
    if (loadCount) {
      const storagePCount = await storagePlanCount(querySP);
      setStgPCount(storagePCount ? storagePCount : undefined);
      setIsLoadCounts(false);
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

  const handleCreateExitPlan = (warehouseOrderNumber: string) => {
    setLoading(true);
    router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/exit_plan/insert?warehouseOrderNumber=${warehouseOrderNumber}`);
  };

  const confirm = async () => {
    setLoading(true);
    if (deleteElement !== -1) {
      const response = await removeStoragePlanById(deleteElement);
      if (response.status >= 200 && response.status <= 299) {
        showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
    } else {
      for (let i = 0; i < selectedItems.length; i++) {
        const index = selectedItems[i];
        const item = storagePlans.filter((sp: StoragePlan) => sp.id === index);
        
        if (item.length > 0) {
          const response: Response = await removeStoragePlanById(Number(item[0].id));
          if (selectedItems[selectedItems.length-1] === index) {
            if (response.status >= 200 && response.status <= 299) {
              const message = selectedItems.length > 1 ? intl.formatMessage({ id: 'successfullyActionMsg' }) : intl.formatMessage({ id: 'item_has_been_canceled' });
              showMsg(message, { type: "success" });
            } else {
              let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
              showMsg(message, { type: "error" });
            }
          }
        }
      }
      await setSelectedItems([]);
      await setSelectedKeys(new Set([]));
    }
    close();
    await loadStoragePlans(statusSelected, page, rowsPerPage, queryFilter, true);
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
        if (selectedItems[selectedItems.length-1] === index) {
          if (response.status >= 200 && response.status <= 299) {
            const message = selectedItems.length > 1 ? intl.formatMessage({ id: 'successfullyActionMsg' }) : intl.formatMessage({ id: 'item_has_been_canceled' });
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
    await loadStoragePlans(statusSelected, page, rowsPerPage, queryFilter, true);
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
      await loadStoragePlans(statusSelected, page, rowsPerPage, queryFilter, true);
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
      await loadStoragePlans(statusSelected, page, rowsPerPage, queryFilter, true);
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

  const openBatchOnStoragePlansDialog = () => {
    setShowBatchStoragePlansDialog(true);
  }

  const confirmBatchOnStoragePlansDialog = async() => {
    closeBatchOnStoragePlansDialog();
    await loadStoragePlans(statusSelected, page, rowsPerPage, queryFilter, true);
  }

  const closeBatchOnStoragePlansDialog = () => {
    setShowBatchStoragePlansDialog(false);
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
        </div>
        {bottomContent}
        {showConfirm && <ConfirmationDialog close={close} confirm={confirm} />}
        {showCancelAllDialog && <ConfirmationDialog close={closeCancelAllStoragePlanDialog} confirm={handleCancelAll} />}
        {showCancelDialog && <ConfirmationDialog close={closeCancelStoragePlanDialog} confirm={handleCancel} />}
        {showForceEntryDialog && <ConfirmationDialog close={closeForceEntryStoragePlanDialog} confirm={handleForceEntry} />}
        {showUploadEvidenceDialog && <UploadEvidenceDialog close={closeUploadEvidenceStoragePlanDialog} confirm={handleUploadEvidence} storagePlan={(uploadEvidenceElement as StoragePlan)} title={intl.formatMessage({ id: "upload_evidence" })} />}
        {showBatchStoragePlansDialog && <BatchOnStoragePlansDialog close={closeBatchOnStoragePlansDialog} confirm={confirmBatchOnStoragePlansDialog} title={intl.formatMessage({ id: "import_entry_plans" })} />}
        {showBarCodeDialog && <ExportBarCodeDialog close={closeBarCodeDialog} file={barCodeValue as Blob} />}
        {showAssignAutoDialog && <ConfirmationDialog close={closeAssignAutoDialog} confirm={autoAssignLocationAction} content={intl.formatMessage({ id: "confirmation_location_text" })} />}
      </Loading>
    </>
  );
};

export default TableStoragePlan;