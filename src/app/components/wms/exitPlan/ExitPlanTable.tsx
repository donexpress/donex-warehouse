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
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { PlusIcon } from "../../common/PlusIcon";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { SearchIcon } from "../../common/SearchIcon";
import PaginationTable from "../../common/Pagination";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import {
  countExitPlans,
  getExitPlanDestinations,
  getExitPlansByState,
  getExitPlansState,
  removeExitPlan,
  updateExitPlan,
  exportExitPlan,
} from "../../../../services/api.exit_plan";
import { getUsers } from '../../../../services/api.users';
import { ValueSelect } from "../../../../types";
import { ExportPayload, DisplayColumns } from '../../../../types/export';
import {
  ExitPlan,
  ExitPlanState,
  State,
  StateCount,
} from "../../../../types/exit_plan";
import {
  capitalize,
  getDateFormat,
  getHourFormat,
  getLanguage,
  splitLastOccurrence,
} from "../../../../helpers/utils";
import { ChevronDownIcon } from "../../common/ChevronDownIcon";
import PackingListDialog from "../../common/PackingListDialog";
import {
  exitPlanDataToExcel,
  isOMS,
  showMsg,
  inventoryOfExitPlan,
  getOperationInstructionsLabel,
} from "../../../../helpers";
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";
import FilterExitPlan from "./FilterExitPlan";
import { FaFileExcel, FaFilePdf, FaFilter, FaTimes } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ExportTable from "../operationInstruction/ExportTable";
import ExportExitPlanTable from "./ExportExitPlanTable";
import { PackageShelf } from "@/types/package_shelferege1992";
import InventoryList from "./InventoryList";
import { CancelIcon } from "../../common/CancelIcon";
import { setCookie, getCookie } from "../../../../helpers/cookieUtils";
import { getAppendagesByExitPlanId } from "@/services/api.appendixerege1992";
import SpinnerIconButton from "../../common/SpinnerIconButton";
import { InputData } from "../../../../types/general_search";
import { saveAs } from 'file-saver';
import GeneralSearchCmpt from "../../common/GeneralSearchCmpt";

const INITIAL_VISIBLE_COLUMNS = [
  "output_number",
  "output_boxes",
  "location",
  "delivered_time",
  "destination",
  "address",
  "actions",
  "observations",
  "customer_order_number",
  "reference_number",
  "operation_instruction_type",
];

const ExitPlanTable = () => {
  const intl = useIntl();
  const router = useRouter();
  const checkOMS = isOMS();
  const { locale } = router.query;
  const [exitPlans, setExitPlans] = useState<ExitPlan[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteElement, setDeleteElemtent] = useState<number>(-1);
  const [cancelElement, setCancelElement] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusSelected, setStatusSelected] = useState<string>("pending");
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [exitPlanState, setExitPlanState] = useState<ExitPlanState | null>(
    null
  );
  const [usersValues, setUsersValues] = useState<ValueSelect[]>([]);

  const [searchInputs, setSearchInputs] = useState<InputData[]>([]);
  const [shouldResetFields, setShouldResetFields] = React.useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [queryFilter, setQueryFilter] = React.useState("");
  const [showPagination, setShowPagination] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentStatePosition, setCurrentStatePosition] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });

  const [showListPakcage, setShowListPackage] = useState<boolean>(false);
  const [changeExitPlanId, setChangeExitPlanId] = useState<number>(-1);
  const [exitPlanAction, setExitPlanAction] = useState<string>("");
  const [changeStatePackages, setChangeStatePackages] = useState<
    { box_number: string }[]
  >([]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState<StateCount | null>(null);

  const hasSearchFilter = Boolean(filterValue);

  const [destinations, setDestinations] = useState<State[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cancelALl, setCancellAll] = useState<boolean>(false);


  const INITIAL_VISIBLE_COLUMNS_LOCATION = [
    "amazon",
    "meli",
    "private_address",
  ];
  const [filterInitialDate, setFilterInitialDate] = useState<string>("");
  const [filterFinalDate, setFilterFinalDate] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string[]>(INITIAL_VISIBLE_COLUMNS_LOCATION);
  const [visibleColumnsLocation, setVisibleColumnsLocations] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS_LOCATION)
  );

  useEffect(() => {
    setSearchInputs([
      {
        key: 'output_number',
        initialValue: '',
        placeholder: intl.formatMessage({ id: "delivery_number" }),
        type: 'text'
      },{
        key: 'reference_number',
        initialValue: '',
        placeholder: intl.formatMessage({ id: "reference_number" }),
        type: 'text'
      },{
        key: 'client_box_number',
        initialValue: '',
        placeholder: intl.formatMessage({ id: "customer_order_number_search" }),
        type: 'text'
      },{
        key: 'user_id',
        initialValue: '',
        placeholder: intl.formatMessage({ id: "user" }),
        type: 'select',
        selectionItems: usersValues,
      },
    ]);
  }, [usersValues, intl]);

  const getFilterData = async() => {
    const users = await getUsers();
    setUsersValues(users ? users.map((user) => { return {value: Number(user.id), label: user.username }}) : []);
  }

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true, position: 1 },
      {
        name: intl.formatMessage({ id: "delivery_number" }),
        uid: "output_number",
        sortable: true,
        position: 2,
      },
      {
        name: intl.formatMessage({ id: "customer_order_number" }),
        uid: "customer_order_number",
        sortable: true,
        position: 3,
      },
      {
        name: intl.formatMessage({ id: "number_of_output_boxes" }),
        uid: "output_boxes",
        sortable: true,
        position: 4,
      },
      {
        name: intl.formatMessage({ id: "reference_number" }),
        uid: "reference_number",
        sortable: true,
        position: 5,
      },
      {
        name: intl.formatMessage({ id: "location" }),
        uid: "location",
        sortable: true,
        position: 6,
      },
      {
        name: intl.formatMessage({ id: "delivery_time" }),
        uid: "delivered_time",
        sortable: true,
        position: 7,
      },
      {
        name: intl.formatMessage({ id: "destination" }),
        uid: "destination",
        sortable: true,
        position: 8,
      },
      {
        name: intl.formatMessage({ id: "address" }),
        uid: "address",
        sortable: true,
        position: 9,
      },
      {
        name: intl.formatMessage({ id: "delivered_amount_boxes" }),
        uid: "delivered_quantity",
        sortable: true,
        position: 10,
      },
      {
        name: intl.formatMessage({ id: "box_numbers" }),
        uid: "box_amount",
        sortable: true,
        position: 11,
      },
      {
        name: intl.formatMessage({ id: "warehouse" }),
        uid: "warehouse",
        sortable: true,
        position: 12,
      },
      {
        name: intl.formatMessage({ id: "user" }),
        uid: "user",
        sortable: true,
        position: 13,
      },
      {
        name: intl.formatMessage({ id: "palets_numbers" }),
        uid: "palets_amount",
        sortable: true,
        position: 14,
      },
      {
        name: intl.formatMessage({ id: "amount" }),
        uid: "amount",
        sortable: true,
        position: 15,
      },
      {
        name: intl.formatMessage({ id: "country" }),
        uid: "country",
        sortable: true,
        position: 16,
      },
      {
        name: intl.formatMessage({ id: "city" }),
        uid: "city",
        sortable: true,
        position: 17,
      },
      {
        name: intl.formatMessage({ id: "operation_instructions" }),
        uid: "operation_instructions",
        sortable: false,
        position: 18,
      },
      {
        name: intl.formatMessage({ id: "operation_instruction_type" }),
        uid: "operation_instruction_type",
        sortable: false,
        position: 19,
      },
      {
        name: intl.formatMessage({ id: "observations" }),
        uid: "observations",
        sortable: true,
        position: 20,
      },
      {
        name: intl.formatMessage({ id: "created_at" }),
        uid: "created_at",
        sortable: true,
        position: 21,
      },

      {
        name: intl.formatMessage({ id: "updated_at" }),
        uid: "updated_at",
        sortable: true,
        position: 22,
      },
      {
        name: intl.formatMessage({ id: "storage_time" }),
        uid: "storage_time",
        sortable: true,
        position: 23,
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

  const getCustomerOrderNumber = (exitPlan: ExitPlan): string => {
    const numbers: string[] = [];

    exitPlan.packing_lists?.forEach((pl, index) => {
      if (pl.box_number) {
        const tmpn = splitLastOccurrence(pl.box_number, "U")[0];
        if (!numbers.find((el) => el === tmpn)) {
          numbers.push(tmpn);
        }
      }
    });
    return numbers.join(", ");
  };

  const filteredItems = useMemo(() => {
    let filteredUsers = [...exitPlans];
    /* if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        return (
          user.output_number
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          user.reference_number
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          (user.user ? user.user.username : "")
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          (user.warehouse
            ? `${user.warehouse.name} (${user.warehouse.code})`
            : ""
          )
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          (user.destination_ref ? user.destination_ref.name : "")
            ?.toString()
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          getCustomerOrderNumber(user).toString().toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } */
    return filteredUsers;
  }, [exitPlans, filterValue]);

  /* const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]); */

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: ExitPlan, b: ExitPlan) => {
      const first = a[sortDescriptor.column as keyof ExitPlan] as number;
      const second = b[sortDescriptor.column as keyof ExitPlan] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const selectedItemsFn = (selection: Selection) => {
    setSelectedKeys(selection);
    if (selection === "all") {
      setSelectedItems(exitPlans.map((ep: ExitPlan) => Number(ep.id)));
    } else {
      setSelectedItems(
        Array.from(selection.values()).map((cadena) =>
          parseInt(cadena.toString())
        )
      );
      // setSelectedItems(Array.from(selection.values()).map((cadena) =>parseInt(cadena.toString())))
    }
  };

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
                <DropdownItem
                  className={
                    user.state !== "pending" && checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleEdit(Number(user["id"]))}
                >
                  {intl.formatMessage({ id: "Edit" })}
                </DropdownItem>
                <DropdownItem onClick={() => handleConfig(Number(user["id"]))}>
                  {intl.formatMessage({ id: "config" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    !user.packing_lists ||
                    (user.packing_lists && user.packing_lists.length === 0)
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() =>
                    inventoryOfExitPlan(user, user.packing_lists, intl)
                  }
                >
                  {intl.formatMessage({ id: "generate_xlsx_inventory" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    !user.packing_lists ||
                    (user.packing_lists && user.packing_lists.length === 0)
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                >
                  <PDFDownloadLink
                    document={
                      <InventoryList
                        intl={intl}
                        exitPlan={user}
                        boxes={user.packing_lists}
                      />
                    }
                    fileName={`${user.output_number}.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      intl.formatMessage({ id: "generate_pdf_inventory" })
                    }
                  </PDFDownloadLink>
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state !== "pending" || checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleAlreadySent(user)}
                >
                  {intl.formatMessage({ id: "already_sent" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state !== "to_be_processed" || checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleManualPickup(user)}
                >
                  {intl.formatMessage({ id: "manual_pickup" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state !== "processing" || checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleOutOfTheWarehouse(user)}
                >
                  {intl.formatMessage({ id: "out_warehouse" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    (user.state !== "dispatched" &&
                      user.state !== "to_be_processed") ||
                    checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleReturn(user)}
                >
                  {intl.formatMessage({ id: "return" })}
                </DropdownItem>
                <DropdownItem onClick={() => handleOperationInstruction(user)}>
                  {intl.formatMessage({ id: "operation_instruction" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state !== "pending"
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleCancel(Number(user["id"]))}
                >
                  {intl.formatMessage({ id: "cancel" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    checkOMS &&
                    user.state !== "pending" &&
                    user.state !== "cancelled"
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleDelete(Number(user["id"]))}
                >
                  {intl.formatMessage({ id: "Delete" })}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "user":
        return <span>{user["user"]["username"]}</span>;
      case "warehouse":
        return <span>{user["warehouse"]["name"]}</span>;
      case "destination":
        if (user["destination_ref"]) {
          return <span>{user["destination_ref"][getLanguage(intl)]}</span>;
        } else {
          return <span>-</span>;
        }
      case "updated_at":
      case "created_at":
      case "delivered_time": {
        if (cellValue && cellValue !== "") {
          return (
            <span>
              {getDateFormat(cellValue)}, {getHourFormat(cellValue)}
            </span>
          );
        } else {
          return "";
        }
      }
      case "output_number":
        return (
          <CopyColumnToClipboard
            value={
              <a
                href={`/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/${
                  user["id"]
                }/config`}
              >
                {cellValue}
              </a>
            }
          />
        );
      case "address":
        return user.address_ref ? (
          <span>{user.address_ref[getLanguage(intl)]}</span>
        ) : (
          <span>{cellValue}</span>
        );
      case "customer_order_number":
        return (user.client_box_number && (user.client_box_number !== "")) ? 
        (<CopyColumnToClipboard value={user.client_box_number} />) 
        : 
        (<span></span>);
      case 'reference_number': return (
        <CopyColumnToClipboard value={user.reference_number} />
      );
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
            {getLocation(user)}
          </span>
        );
      case "operation_instructions":
        return (
          <span>
            {user.operation_instructions &&
            user.operation_instructions.length > 0
              ? user.operation_instructions.length
              : 0}
          </span>
        );
      case "operation_instruction_type": return (getOperationInstructionsLabel(user, locale as string));
      case "storage_time":
        return getStorageTime(user)
      default:
        return cellValue;
    }
  }, [locale]);

  const getStorageTime = (outputPlan: any): string => {
    let short = Infinity
    let larger = 0;
    let storage_time = ""
    outputPlan.packing_lists.forEach((pl: any) => {
      if(pl.storage_time < short) {
        short = pl.storage_time
      }
      if(pl.storage_time > larger) {
        larger = pl.storage_time
      }
    })
    if(short === larger) {
      storage_time = `${short} ${intl.formatMessage({id: 'days'})}`
    } else if(short === Infinity && larger === 0) {
      storage_time = `0 ${intl.formatMessage({id: 'days'})}` 
    }else {
      storage_time = `${short} - ${larger} ${intl.formatMessage({id: 'days'})}`
    }
    return storage_time;
  }

  const getLocation = (ep: ExitPlan): string => {
    const locations: string[] = [];
    if (ep.packing_lists && ep.packing_lists?.length == 0) {
      return "--";
    }
    ep.packing_lists?.forEach((pl) => {
      if (
        pl.package_shelf &&
        pl.package_shelf[0] &&
        pl.package_shelf[0].shelf
      ) {
        const tmpl = `${ep.warehouse?.code}-${String(
          pl.package_shelf[0].shelf.partition_table
        ).padStart(2, "0")}-${String(
          pl.package_shelf[0].shelf.number_of_shelves
        ).padStart(2, "0")}-${String(pl.package_shelf[0].layer).padStart(
          2,
          "0"
        )}-${String(pl.package_shelf[0].column).padStart(2, "0")}`;
        if (!locations.find((el) => el === tmpl)) {
          locations.push(tmpl);
        }
      }
    });
    return locations.join(", ");
  };

  const packageShelfFormat = (
    packageShelfs: PackageShelf[] | undefined
  ): string => {
    if (packageShelfs && packageShelfs.length > 0) {
      const packageShelf: PackageShelf = packageShelfs[0];
      return `${intl.formatMessage({ id: "partition" })}: ${
        packageShelf.shelf?.partition_table
      }
        ${intl.formatMessage({ id: "shelf" })}: ${
        packageShelf.shelf?.number_of_shelves
      }
        ${intl.formatMessage({ id: "layer" })}: ${packageShelf.layer}
        ${intl.formatMessage({ id: "column" })}: ${packageShelf.column}`;
    }
    return "";
  };

  const onRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (Number(e.target.value) !== rowsPerPage) {
      setSelectedItems([]);
      setSelectedKeys(new Set([]));
      setRowsPerPage(Number(e.target.value));
      setPage(1);
      await loadExitPlans(
        statusSelected,
        1,
        Number(e.target.value),
        queryFilter,
        false,
        true
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchValues();
    }
  };

  const searchValues = async () => {
    await setSelectedItems([]);
    await setSelectedKeys(new Set([]));
    if (filterValue && filterValue !== "") {
      await setQueryFilter(filterValue);
    } else {
      await setQueryFilter("");
    }
    await setPage(1);
    await loadExitPlans(
      statusSelected,
      1,
      rowsPerPage,
      filterValue ? filterValue : "",
      true,
      true
    );
  };

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(async () => {
    await setFilterValue("");
    await setQueryFilter("");
    await setPage(1);
    await loadExitPlans(statusSelected, 1, rowsPerPage, "", true, true);
  }, []);

  const getCount = (state: any) => {
    if (count) {
      switch (state) {
        case "pending":
          return `${
            statusSelected === "pending" && !loadingItems
              ? count.pending
              : count.pending
          }`;
        case "to_be_processed":
          return `${
            statusSelected === "to_be_processed" && !loadingItems
              ? count.to_be_processed
              : count.to_be_processed
          }`;
        case "processing":
          return `${
            statusSelected === "processing" && !loadingItems
              ? count.processing
              : count.processing
          }`;
        case "dispatched":
          return `${
            statusSelected === "dispatched" && !loadingItems
              ? count.dispatched
              : count.dispatched
          }`;
        case "cancelled":
          return `${
            statusSelected === "cancelled" && !loadingItems
              ? count.cancelled
              : count.cancelled
          }`;
        case "all":
          return `${
            statusSelected === "all" && !loadingItems
              ? count.total
              : count.total
          }`;
      }
    }
    return "";
  };

  const changeTab = async (tab: string) => {
    if (tab !== statusSelected && !loadingItems) {
      setCookie("tabEP", tab);
      await setStatusSelected(tab);
      await setLoadingItems(true);

      // const storagePlanss = await getExitPlansByState(
      //   tab,
      //   1,
      //   rowsPerPage,
      //   queryFilter
      // );

      // await setLoadingItems(false);
      // await setExitPlans(storagePlanss !== null ? storagePlanss : []);
      await loadExitPlans(tab, 1, rowsPerPage, queryFilter, true, true, false)
      setSelectedItems([]);
      setSelectedKeys(new Set([]));
      if (page !== 1) {
        setPage(1);
      }
    }
  };

  const getCountByPosition = () => {
    const value = exitPlanState?.states.find(
      (el) => el.position === currentStatePosition
    )?.value;
    if (!value || !count) {
      return 0;
    }
    // @ts-ignore
    return count[value];
  };

  const onFinishFilter = async () => {
    await loadExitPlans(statusSelected, page, rowsPerPage, queryFilter, true, true, false)
  };

  const getSelectedExitPlans = (): ExitPlan[] => {
    let its: ExitPlan[] = [];
    for (let i = 0; i < selectedItems.length; i++) {
      const index = selectedItems[i];
      const item = exitPlans.filter((ep: ExitPlan) => ep.id === index);

      if (item.length > 0) {
        its.push(item[0]);
      }
    }
    return its;
  };

  const exportFile = async (type: 'pdf' | 'xlsx', itemsId: number[]) => {
    setLoading(true);
    const body: ExportPayload = {
      type: type,
      ids: itemsId,
      display_columns: getVisibleColumnsToExport(),
    }
    const response = await exportExitPlan(body);
    if (response.status >= 200 && response.status <= 299) {
      const time = (new Date()).getTime();
      if (type === 'pdf') {
        const blob = new Blob([response.data], { type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8' });
        const url = URL.createObjectURL(blob);
        saveAs(url, `exit_plan_${type}_${time}.${type}`);
      } else if (type === 'xlsx') {
        const link = document.createElement('a');
        link.href = response.data.url.url;
        link.setAttribute('download', `exit_plan_${type}_${time}.${type}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
    setLoading(false);
  };

  const getVisibleColumnsToExport = (): DisplayColumns[] => {
    let t = Array.from(visibleColumns) as string[];
    t = t.filter((el) => el !== "actions");

    const sortedSelectedArray = (t.map(uid => getColumns.find(item => item.uid === uid))
      .filter(item => item !== undefined)) as { name: string; uid: string; position?: number}[];
    
    sortedSelectedArray.sort((a, b) => (a.position || 100) - (b.position || 100));

    return sortedSelectedArray.map(col => {
      return { key: col.uid, value: col.name }
    });
  };

  const getVisibleColumns = (): string[] => {
    let t = Array.from(visibleColumns) as string[];
    t = t.filter((el) => el !== "actions");

    const sortedSelectedArray = (t.map(uid => getColumns.find(item => item.uid === uid))
      .filter(item => item !== undefined)) as { name: string; uid: string; position?: number}[];
    
    sortedSelectedArray.sort((a, b) => (a.position || 100) - (b.position || 100));

    return sortedSelectedArray.map(col => col.uid);
  };

  const handleExportExcel = () => {
    exitPlanDataToExcel(getSelectedExitPlans(), intl, getVisibleColumns(), locale as string);
  };

  const displayCancelAll = () => {
    setCancellAll(true);
  };

  const closeCancelAll = () => {
    setCancellAll(false);
  };

  const confirmCancelAll = async () => {
    try {
      const promises = selectedItems.map((el) =>
        updateExitPlan(el, {
          state: "cancelled",
        })
      );
      await Promise.all(promises);
      showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
        type: "success",
      });
    } catch (e) {
      showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
        type: "error",
      });
    } finally {
      await loadExitPlans(
        statusSelected,
        page,
        rowsPerPage,
        queryFilter,
        true,
        true
      );
      closeCancelAll();
    }
  };

  const getQuery = (q: string) => {
    setFilterValue(q);
  };

  const handleClearAll = async() => {
    await setSelectedItems([]);
    await setSelectedKeys(new Set([]));
    await setFilterInitialDate("");
    await setFilterFinalDate("");
    await setFilterLocation(INITIAL_VISIBLE_COLUMNS_LOCATION);
    await setVisibleColumnsLocations(new Set(INITIAL_VISIBLE_COLUMNS_LOCATION));
    setShouldResetFields(!shouldResetFields);
    await onClear();
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-3 mb-2">
        <GeneralSearchCmpt data={searchInputs} getQueryFn={getQuery} shouldResetFields={shouldResetFields} />
        <FilterExitPlan
          setParentFinalDate={setFilterFinalDate}
          setParentInitialDate={setFilterInitialDate}
          setParentLocations={setFilterLocation}
          setVisibleColumnsLocations={setVisibleColumnsLocations}
          date={filterInitialDate}
          finalDate={filterFinalDate}
          visibleColumns={visibleColumnsLocation}
        />
        <div className="flex justify-between gap-3">
          <div>
            <div className="w-full flex justify-start gap-3 items-start" style={{ position: "relative" }}>
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
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <div className="flex gap-3 search-container-generic">
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    className="bnt-select bnt-dropdown"
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
            <div
              className="flex gap-3"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <Button
                color="primary"
                isDisabled={selectedItems.length === 0}
                endContent={
                  <FaFilePdf style={{ fontSize: "22px", color: "white" }} />
                }
                onClick={() => exportFile('pdf', selectedItems)}
              >
                {/* <PDFDownloadLink
                  document={
                    <ExportExitPlanTable
                      intl={intl}
                      data={getSelectedExitPlans()}
                      columns={getVisibleColumns()}
                      locale={locale as string}
                    />
                  }
                  fileName="exit_plan_pdf.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    intl.formatMessage({ id: "export_pdf" })
                  }
                </PDFDownloadLink> */}
                { intl.formatMessage({ id: "export_pdf" }) }
              </Button>
              <Button
                color="primary"
                style={{ width: "140px" }}
                endContent={
                  <FaFileExcel style={{ fontSize: "22px", color: "white" }} />
                }
                onClick={() => exportFile('xlsx', selectedItems)}
                isDisabled={selectedItems.length === 0}
              >
                {intl.formatMessage({ id: "export_xlsx" })}
              </Button>
              {statusSelected === "pending" && (
                <Button
                  color="primary"
                  style={{ width: "121px" }}
                  endContent={<CancelIcon />}
                  onClick={() => displayCancelAll()}
                  isDisabled={selectedItems.length === 0}
                >
                  {intl.formatMessage({ id: "cancel" })}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {intl.formatMessage(
              { id: "total_results" },
              { in: getCount(statusSelected) }
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
              <option value="200">200</option>
              <option value="400">400</option>
            </select>
          </label>
        </div>
        <div className="bg-gray-200 pt-1">
          <div className="overflow-x-auto tab-system-table bg-content1">
            <ul className="flex space-x-4">
              {exitPlanState &&
                exitPlanState.states.map((state, index) => (
                  <li className="whitespace-nowrap" key={index}>
                    <button
                      className={
                        statusSelected === state.value
                          ? "px-4 py-3 tab-selected"
                          : "px-4 py-3 tab-default"
                      }
                      onClick={() => changeTab(state.value)}
                    >
                      {state[getLanguage(intl)]}
                      {count && (
                        <>
                          {state.value === "all" && (
                            <span> ({count.total})</span>
                          )}
                          {state.value !== "all" && (
                            // @ts-ignore
                            <span> ({count[state.value]})</span>
                          )}
                        </>
                      )}
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
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    exitPlans.length,
    hasSearchFilter,
    exitPlanState,
    statusSelected,
    intl,
    currentStatePosition,
    selectedItems,
    shouldResetFields,
    searchInputs
  ]);

  const changePage = async (newPage: number) => {
    if (page !== newPage) {
      setSelectedItems([]);
      setSelectedKeys(new Set([]));
      setPage(newPage);
      await setShowPagination(false);
      await loadExitPlans(
        statusSelected,
        newPage,
        rowsPerPage,
        queryFilter,
        false,
        true
      );
      await setShowPagination(true);
    }
  };

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
        {showPagination && (
          <PaginationTable
            totalRecords={getCount(statusSelected)}
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
    selectedKeys,
    filteredItems,
    sortedItems.length,
    page,
    exitPlans.length,
    rowsPerPage,
    hasSearchFilter,
    intl,
    showPagination,
    count,
  ]);

  useEffect(() => {
    const tab = getCookie("tabEP");
    if (tab) {
      setStatusSelected(tab);
    }
    loadExitPlans(
      tab ? tab : statusSelected,
      page,
      rowsPerPage,
      "",
      true,
      false,
      true
    );
    getFilterData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadExitPlans = async (
    status: string = "pending",
    pageSP: number = -1,
    rowsPerPageSP: number = -1,
    querySP: string = "",
    loadCount: boolean = false,
    partialLoad: boolean = false,
    firstLoad: boolean = false
  ) => {
    if (!partialLoad) {
      setLoading(true);
    }
    await setLoadingItems(true);
    const pms = await getExitPlansByState(
      status,
      pageSP !== -1 ? pageSP : page,
      rowsPerPageSP !== -1 ? rowsPerPageSP : rowsPerPage,
      querySP,
      filterInitialDate,
      filterFinalDate,
      filterLocation
    );
    setExitPlans(pms ? pms : []);
    await setLoadingItems(false);
    if (firstLoad) {
      const states = await getExitPlansState();
      setExitPlanState(states);
    }
    if (loadCount) {
      const count = await countExitPlans(querySP,filterInitialDate, filterFinalDate, filterLocation);
      setCount(count);
    }
    if (firstLoad) {
      const destinations = await getExitPlanDestinations();
      setDestinations(destinations.destinations);
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setShowConfirm(true);
    setDeleteElemtent(id);
  };

  const handleAlreadySent = (exitPlan: ExitPlan) => {
    setExitPlanAction("already_sent");
    setChangeStatePackages([
      { box_number: exitPlan.output_number ? exitPlan.output_number : "" },
    ]);
    setChangeExitPlanId(exitPlan.id ? exitPlan.id : -1);
    setShowListPackage(true);
  };

  const handleManualPickup = (exitPlan: ExitPlan) => {
    setExitPlanAction("manual_pickup");
    setChangeStatePackages([
      { box_number: exitPlan.output_number ? exitPlan.output_number : "" },
    ]);
    setChangeExitPlanId(exitPlan.id ? exitPlan.id : -1);
    setShowListPackage(true);
  };

  const handleOutOfTheWarehouse = (exitPlan: ExitPlan) => {
    setExitPlanAction("out_warehouse");
    setChangeStatePackages([
      { box_number: exitPlan.output_number ? exitPlan.output_number : "" },
    ]);
    setChangeExitPlanId(exitPlan.id ? exitPlan.id : -1);
    setShowListPackage(true);
  };

  const handleReturn = (exitPlan: ExitPlan) => {
    setExitPlanAction("return-" + exitPlan.state);
    setChangeStatePackages([
      { box_number: exitPlan.output_number ? exitPlan.output_number : "" },
    ]);
    setChangeExitPlanId(exitPlan.id ? exitPlan.id : -1);
    setShowListPackage(true);
  };

  const handleOperationInstruction = (exitPlan: ExitPlan) => {
    if (exitPlan.packing_lists && exitPlan.packing_lists.length > 0) {
      if (
        exitPlan.operation_instructions &&
        exitPlan.operation_instructions.length > 0
      ) {
        router.push(
          `/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/${
            exitPlan.id
          }/config`
        );
      } else {
        router.push(
          `/${locale}/${
            checkOMS ? "oms" : "wms"
          }/operation_instruction/insert?exit_plan_id=${exitPlan.id}`
        );
      }
    } else {
      showMsg(
        intl.formatMessage({
          id: "operation_instruction_box_requirement_amount",
        }),
        { type: "warning" }
      );
    }
  };

  const closeListPackage = () => {
    setChangeStatePackages([]);
    setChangeExitPlanId(-1);
    setExitPlanAction("");
    setShowListPackage(false);
  };

  const confirmListPackage = async () => {
    setLoading(true);
    let state = "";
    console.log(exitPlanAction)
    switch (exitPlanAction) {
      case "already_sent":
        state = "to_be_processed";
        break;
      case "manual_pickup":
        state = "processing";
        break;
      case "out_warehouse":
        state = "dispatched";
        break;
      case "return-exhausted":
        state = "processing";
        break;
      case "return-to_be_chosen":
        state = "pending";
        break;
      case "return-to_be_processed":
        state = "pending";
        break;
      case "return-dispatched":
        state = "processing";
        break;
    }
    if (state === "dispatched") {
      const appendix = await getAppendagesByExitPlanId(changeExitPlanId);
      if (!appendix || (appendix && appendix.length === 0)) {
        showMsg(intl.formatMessage({ id: "missing_apendix_msg" }), {
          type: "warning",
        });
        closeListPackage();
        setLoading(false);
        return;
      }
    }
    const reponse = await updateExitPlan(changeExitPlanId, {
      state,
    });
    showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
      type: "success",
    });
    closeListPackage();
    await loadExitPlans(
      statusSelected,
      page,
      rowsPerPage,
      queryFilter,
      true,
      true
    );
    setLoading(false);
  };

  const getListPackageTitle = (intl: any) => {
    if (exitPlanAction.startsWith("return")) {
      return intl.formatMessage({ id: "return" });
    }
    return intl.formatMessage({ id: exitPlanAction });
  };

  const handleCancel = (id: number) => {
    setShowConfirm(true);
    setCancelElement(id);
  };

  const handleEdit = (id: number) => {
    setLoading(true);
    router.push(
      `/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/${id}/update`
    );
  };

  const handleShow = (id: number) => {
    setLoading(true);
    router.push(`/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/${id}/show`);
  };

  const handleAdd = () => {
    setLoading(true);
    router.push(`/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/insert`);
  };

  const handleConfig = (id: number) => {
    setLoading(true);
    router.push(
      `/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/${id}/config`
    );
  };

  const close = () => {
    setShowConfirm(false);
    setDeleteElemtent(-1);
    setCancelElement(-1);
  };

  const confirm = async () => {
    setLoading(true);
    if (deleteElement !== -1) {
      const reponse = await removeExitPlan(deleteElement);
      if (reponse.status >= 200 && reponse.status <= 299) {
        showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
    } else if (cancelElement !== -1) {
      const reponse = await updateExitPlan(cancelElement, {
        state: "cancelled",
      });
      if (reponse.status >= 200 && reponse.status <= 299) {
        showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
      }
    }
    close();
    await loadExitPlans(
      statusSelected,
      page,
      rowsPerPage,
      queryFilter,
      true,
      true
    );
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
            sortDescriptor={sortDescriptor}
            // onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            onSelectionChange={(keys: Selection) => {
              selectedItemsFn(keys);
            }}
          >
            <TableHeader columns={headerColumns}>
              {(column: any) => (
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
              emptyContent={`${
                loadingItems
                  ? intl.formatMessage({ id: "loading_items" })
                  : intl.formatMessage({ id: "no_results_found" })
              }`}
              items={loadingItems ? [] : filteredItems}
            >
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey: any) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {bottomContent}
        {showConfirm && <ConfirmationDialog close={close} confirm={confirm} />}
        {cancelALl && (
          <ConfirmationDialog
            close={closeCancelAll}
            confirm={confirmCancelAll}
          />
        )}
        {showListPakcage && (
          <PackingListDialog
            close={closeListPackage}
            confirm={confirmListPackage}
            title={getListPackageTitle(intl)}
            // @ts-ignore
            packingLists={changeStatePackages}
          />
        )}
      </Loading>
    </>
  );
};

export default ExitPlanTable;
