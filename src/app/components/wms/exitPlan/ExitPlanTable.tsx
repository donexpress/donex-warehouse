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
} from "../../../../services/api.exit_plan";
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
} from "../../../../helpers/utils";
import { ChevronDownIcon } from "../../common/ChevronDownIcon";
import PackingListDialog from "../../common/PackingListDialog";
import { exitPlanDataToExcel, isOMS, showMsg } from "../../../../helpers";
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";
import FilterExitPlan from "./FilterExitPlan";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ExportTable from "../operationInstruction/ExportTable";
import ExportExitPlanTable from "./ExportExitPlanTable";
import { PackageShelf } from "@/types/package_shelferege1992";

const INITIAL_VISIBLE_COLUMNS = [
  "output_number",
  "user",
  "warehouse",
  "box_amount",
  "destination",
  "actions",
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
  const [statusSelected, setStatusSelected] = useState<number>(1);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [exitPlanState, setExitPlanState] = useState<ExitPlanState | null>(
    null
  );

  const [filterValue, setFilterValue] = useState("");
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

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      {
        name: intl.formatMessage({ id: "delivery_number" }),
        uid: "output_number",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "warehouse" }),
        uid: "warehouse",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "user" }),
        uid: "user",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "box_numbers" }),
        uid: "box_amount",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "number_of_output_boxes" }),
        uid: "output_boxes",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "palets_numbers" }),
        uid: "palets_amount",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "amount" }),
        uid: "amount",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "delivered_amount_boxes" }),
        uid: "delivered_quantity",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "country" }),
        uid: "country",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "city" }),
        uid: "city",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "address" }),
        uid: "address",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "observations" }),
        uid: "observations",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "destination" }),
        uid: "destination",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "delivery_time" }),
        uid: "delivered_time",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "location" }),
        uid: "location",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "created_at" }),
        uid: "created_at",
        sortable: true,
      },

      {
        name: intl.formatMessage({ id: "updated_at" }),
        uid: "updated_at",
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

  const filteredItems = useMemo(() => {
    let filteredUsers = [...exitPlans];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        return user.output_number
          ?.toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    }
    return filteredUsers;
  }, [exitPlans, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: ExitPlan, b: ExitPlan) => {
      const first = a[sortDescriptor.column as keyof ExitPlan] as number;
      const second = b[sortDescriptor.column as keyof ExitPlan] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const selectedItemsFn = (selection: Selection) => {
    setSelectedKeys(selection);
    if (selection === "all") {
      setSelectedItems(
        exitPlans.map((ep: ExitPlan) => Number(ep.id))
      );
    }
    else {
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
                <DropdownItem onClick={() => handleEdit(Number(user["id"]))}>
                  {intl.formatMessage({ id: "Edit" })}
                </DropdownItem>
                <DropdownItem onClick={() => handleConfig(Number(user["id"]))}>
                  {intl.formatMessage({ id: "config" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state.value !== "pending" || checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleAlreadySent(user)}
                >
                  {intl.formatMessage({ id: "already_sent" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state.value !== "to_be_processed" || checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleManualPickup(user)}
                >
                  {intl.formatMessage({ id: "manual_pickup" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    user.state.value !== "processing" || checkOMS
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleOutOfTheWarehouse(user)}
                >
                  {intl.formatMessage({ id: "out_warehouse" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    (user.state.value !== "dispatched" &&
                      user.state.value !== "to_be_processed") ||
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
                    user.state.value !== "pending"
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleCancel(Number(user["id"]))}
                >
                  {intl.formatMessage({ id: "cancel" })}
                </DropdownItem>
                <DropdownItem
                  className={checkOMS ? "do-not-show-dropdown-item" : ""}
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
      case "delivered_time":
        return (
          <span>
            {getDateFormat(cellValue)}, {getHourFormat(cellValue)}
          </span>
        );
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
      case 'location':
        return <span style={{maxWidth: "250px", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display:  'block'}}>{getLocation(user)}</span>
      default:
        return cellValue;
    }
  }, []);

  const getLocation = (ep: ExitPlan): string => {
    let locations = ""
    if(ep.packing_lists && ep.packing_lists?.length == 0) {
      return '--'
    }
    if(ep.packing_lists && ep.packing_lists?.length > 1) {
      return 'Multiple'
    }
    ep.packing_lists?.forEach(pl => {
      locations+=packageShelfFormat(pl.package_shelf)
    })
    return locations
  }

  const packageShelfFormat = (packageShelfs: PackageShelf[] | undefined): string => {
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

  const changeTab = async (tab: number) => {
    if (tab !== statusSelected && !loadingItems) {
      await setStatusSelected(tab);
      await setLoadingItems(true);
      const state = exitPlanState?.states.find((el) => el.position === tab);
      const storagePlanss = await getExitPlansByState(
        state ? state.value : "pending"
      );
      setCurrentStatePosition(tab);
      await setLoadingItems(false);
      await setExitPlans(storagePlanss !== null ? storagePlanss : []);
      // await setExitPlans([]);
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

  const onFinishFilter = (data: ExitPlan[]) => {
    setExitPlans(data);
  };

  const getSelectedExitPlans = (): ExitPlan[] => {
    let its: ExitPlan[] = [];
    for (let i = 0; i < selectedItems.length; i++) {
      const index = selectedItems[i];
      const item = exitPlans.filter((ep: ExitPlan) => ep.id === index);
      if (filterValue && (filterValue !== "")) {
        const isSearchable = item[0].output_number
        ?.toLowerCase()
        ?.includes(filterValue.toLowerCase());
        if (isSearchable) {
          its.push(item[0]);
        }
      } else {
        if(item[0]) {
          its.push(item[0]);
        }
      }
    }
    return its;
  }

  const getVisibleColumns = (): string[] => {
    const t = Array.from(visibleColumns) as string[];
    return t.filter((el) => el !== "actions");
  };

  const handleExportExcel = () => {
    exitPlanDataToExcel(getSelectedExitPlans(), intl, getVisibleColumns());

  }

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
        <FilterExitPlan
          onFinish={onFinishFilter}
          destionations={destinations}
        />
        <div
          className="flex gap-3"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "20px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <Button
            color="primary"
            isDisabled={selectedItems.length === 0}
            endContent={
              <FaFilePdf style={{ fontSize: "22px", color: "white" }} />
            }
          >
            <PDFDownloadLink
              document={
                <ExportExitPlanTable
                  intl={intl}
                  data={getSelectedExitPlans()}
                  columns={getVisibleColumns()}
                />
              }
              fileName="operation_instructions_pdf.pdf"
            >
              {({ blob, url, loading, error }) =>
                intl.formatMessage({ id: "export_pdf" })
              }
            </PDFDownloadLink>
          </Button>
          <Button
            color="primary"
            style={{ width: "121px", marginLeft: "10px" }}
            endContent={
              <FaFileExcel style={{ fontSize: "22px", color: "white" }} />
            }
            onClick={() => handleExportExcel()}
            isDisabled={selectedItems.length === 0}
          >
            {intl.formatMessage({ id: "export" })}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {intl.formatMessage({ id: "total_results" }, { in: count?.total })}
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
              {exitPlanState &&
                exitPlanState.states.map((state, index) => (
                  <li className="whitespace-nowrap" key={index}>
                    <button
                      className={
                        statusSelected === state.position
                          ? "px-4 py-3 tab-selected"
                          : "px-4 py-3 tab-default"
                      }
                      onClick={() => changeTab(state.position)}
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
    selectedItems
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
          totalRecords={filteredItems.slice(0, exitPlans.length).length}
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
    exitPlans.length,
    rowsPerPage,
    hasSearchFilter,
    onSearchChange,
    onRowsPerPageChange,
    intl,
  ]);

  useEffect(() => {
    loadExitPlans();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadExitPlans = async () => {
    setLoading(true);
    const pms = await getExitPlansByState("pending");
    console.log(pms)
    setExitPlans(pms ? pms : []);
    const states = await getExitPlansState();
    const count = await countExitPlans();
    const destinations = await getExitPlanDestinations();
    setDestinations(destinations.destinations);
    setCount(count);
    setExitPlanState(states);
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
    setExitPlanAction("return-" + exitPlan.state?.value);
    setChangeStatePackages([
      { box_number: exitPlan.output_number ? exitPlan.output_number : "" },
    ]);
    setChangeExitPlanId(exitPlan.id ? exitPlan.id : -1);
    setShowListPackage(true);
  };

  const handleOperationInstruction = (exitPlan: ExitPlan) => {
    if (
      exitPlan.operation_instructions &&
      exitPlan.operation_instructions.length > 0
    ) {
      router.push(
        `/${locale}/${checkOMS ? "oms" : "wms"}/exit_plan/${exitPlan.id}/config`
      );
    } else {
      router.push(
        `/${locale}/${
          checkOMS ? "oms" : "wms"
        }/operation_instruction/insert?exit_plan_id=${exitPlan.id}`
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
    }
    const reponse = await updateExitPlan(changeExitPlanId, {
      state,
    });
    showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
      type: "success",
    });
    closeListPackage();
    await loadExitPlans();
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
    } else if (cancelElement !== -1) {
      const reponse = await updateExitPlan(cancelElement, {
        state: "cancelled",
      });
    }
    close();
    await loadExitPlans();
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
              emptyContent={`${intl.formatMessage({ id: "no_results_found" })}`}
              items={sortedItems}
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
