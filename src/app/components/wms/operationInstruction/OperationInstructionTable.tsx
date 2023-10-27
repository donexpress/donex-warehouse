import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import {
  capitalize,
  getDateFormat,
  getHourFormat,
  getLanguage,
} from "../../../../helpers/utils";
import { ExitPlan, ExitPlanState } from "@/types/exit_planerege1992";
import {
  countOperationInstruction,
  deleteOperationInstructions,
  getOperationInstructionStates,
  getOperationInstructions,
  getOperationInstructionsByOutputPlan,
  updateOperationInstruction,
} from "../../../../services/api.operation_instruction";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ChevronDownIcon } from "../../common/ChevronDownIcon";
import { PlusIcon } from "../../common/PlusIcon";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { useRouter } from "next/router";
import {
  OperationInstruction,
  InstructionTypeList,
  InstructionType,
  OperationInstructionCount,
} from "@/types/operation_instructionerege1992";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import OperationInstructionConfirmationDialog from "./OperationInstructionConfirmationDialog";
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";
import { SearchIcon } from "../../common/SearchIcon";
import "./../../../../styles/generic.input.scss";
import "../../../../styles/wms/user.table.scss";
import {
  isOMS,
  isWMS,
  operationInstructionDataToExcel,
  showMsg,
} from "@/helperserege1992";
import PaginationTable from "../../common/Pagination";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ExportTable from "./ExportTable";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { PackageShelf } from "@/types/package_shelferege1992";
import { getAppendagesByOperationInstructionId } from "@/services/api.appendixerege1992";
import { getExitPlansById } from "@/services/api.exit_planerege1992";
import { ParsedUrlQueryInput } from 'querystring';
import { setCookie, getCookie } from "../../../../helpers/cookieUtils";

const INITIAL_VISIBLE_COLUMNS = [
  "operation_instruction_type",
  "output_plan_id",
  "number_delivery",
  "remark",
  "location",
  "actions",
];

interface Props {
  exit_plan_id?: number;
  exit_plan?: ExitPlan;
}

const OperationInstructionTable = ({ exit_plan_id, exit_plan }: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [operationInstructionState, setOperationInstructionState] =
    useState<ExitPlanState | null>(null);
  const [statusSelected, setStatusSelected] = useState<string>("pending");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [page, setPage] = useState(1);
  const [operationInstructions, setOperationInstructions] = useState<
    OperationInstruction[]
  >([]);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [displayConfirmation, setDisplayConfirmation] =
    useState<boolean>(false);
  const [
    displayOperationInstructionConfirmation,
    setDisplayOperationInstructionConfirmation,
  ] = useState<boolean>(false);
  const [dialogTexts, setDialogTexts] = useState<string[]>([]);
  const [dialogIds, setDialogIds] = useState<number[]>([]);
  const [dialogType, setDialogType] = useState<
    "processed" | "processing" | "cancelled" | ""
  >("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [count, setCount] = useState<OperationInstructionCount | null>(null);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);

  useEffect(() => {
    const tab = getCookie("tabIO");
    if (tab) {
      setStatusSelected(tab);
    }
    loadStates(tab ? tab : statusSelected);
  }, []);

  const loadStates = async (status: string = "pending") => {
    const states: ExitPlanState = await getOperationInstructionStates();
    const count: OperationInstructionCount = await countOperationInstruction(
      exit_plan_id
    );
    setCount(count);
    /* const list_state = states.states.find(
      (el) => el.position === statusSelected
    ); */
    let opi = null;
    if (exit_plan_id) {
      opi = await getOperationInstructionsByOutputPlan(
        exit_plan_id,
        status
      );
    } else {
      opi = await getOperationInstructions(status);
    }
    setOperationInstructions(opi);
    setOperationInstructionState(states);
  };

  const getCount = (
    column:
      | "total"
      | "audited"
      | "pending"
      | "processed"
      | "processing"
      | "cancelled"
  ): number => {
    if (count) {
      return count[column];
    }
    return 0;
  };

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      {
        name: intl.formatMessage({ id: "operation_instruction_type" }),
        uid: "operation_instruction_type",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "warehouse" }),
        uid: "warehouse_id",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "exitPlan" }),
        uid: "output_plan_id",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "number_delivery" }),
        uid: "number_delivery",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "observations" }),
        uid: "remark",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "internal_remark" }),
        uid: "internal_remark",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "user" }),
        uid: "user_id",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "location" }),
        uid: "location",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "expansion_box_number" }),
        uid: "box_number",
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

  const handleAdd = async () => {
    if (exit_plan_id) {
      const exit_plan = await getExitPlansById(exit_plan_id);
      if (
        exit_plan &&
        exit_plan.case_numbers &&
        exit_plan.case_numbers.length > 0
      ) {
        router.push({
          pathname: `/${locale}/${
            isOMS() ? "oms" : "wms"
          }/operation_instruction/insert`,
          search: `?exit_plan_id=${exit_plan_id}`,
        });
      } else {
        showMsg(intl.formatMessage({ id: "operation_instruction_box_requirement_amount" }), {type: 'warning'})
      }
    } else {
      router.push({
        pathname: `/${locale}/${
          isOMS() ? "oms" : "wms"
        }/operation_instruction/insert`,
      });
    }
  };

  const handleShow = (id: number) => {
    let params: ParsedUrlQueryInput = {};
    if (exit_plan_id && exit_plan) {
      params = {
        exit_plan_id: exit_plan_id,
        exit_plan_state: getState(),
      };
    }
    router.push({
      pathname: `/${locale}/${
        isOMS() ? "oms" : "wms"
      }/operation_instruction/${id}/show`,
      query: params,
    });
  };

  const handleEdit = (id: number) => {
    let params: ParsedUrlQueryInput = {};
    if (exit_plan_id && exit_plan) {
      params = {
        exit_plan_id: exit_plan_id,
        exit_plan_state: getState(),
      };
    }
    router.push({
      pathname: `/${locale}/${
        isOMS() ? "oms" : "wms"
      }/operation_instruction/${id}/update`,
      query: params,
    });
  };

  const handleConfig = (id: number) => {
    let params: ParsedUrlQueryInput = {};
    if (exit_plan_id && exit_plan) {
      params = {
        exit_plan_id: exit_plan_id,
        exit_plan_state: getState(),
      };
    }
    router.push({
      pathname: `/${locale}/${isOMS() ? "oms" : "wms"}/operation_instruction/${id}/config`,
      query: params,
    });
  };

  const handleCancel = (id: number) => {
    const op = operationInstructions.find((el) => el.id === id);
    if (op) {
      setDialogIds([id]);
      // @ts-ignore
      setDialogTexts(op.operation_instruction_type.instruction_type);
      setDialogType("cancelled");
      setDisplayOperationInstructionConfirmation(true);
    }
  };

  const handleMultiCancel = () => {
    let txt: string[] = [];
    setDialogIds(selectedItems);
    const op = operationInstructions.map((el) => {
      if (selectedItems.find((si) => si === el.id)) {
        // @ts-ignore
        txt = txt.concat(el.operation_instruction_type.instruction_type);
      }
    });
    setDialogTexts(txt);
    setDialogType("cancelled");
    setDisplayOperationInstructionConfirmation(true);
  };

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setDisplayConfirmation(true);
  };

  const confirm = async () => {
    const result = await deleteOperationInstructions(selectedId);
    await loadStates(statusSelected);
    showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
      type: "success",
    });
    close();
  };

  const close = () => {
    setSelectedId(-1);
    setDisplayConfirmation(false);
  };

  const selectedItemsFn = (selection: Selection) => {
    setSelectedKeys(selection);
    if (selection === "all") {
      setSelectedItems(
        operationInstructions.map((sp: OperationInstruction) => Number(sp.id))
      );
    } else {
      setSelectedItems(
        Array.from(selection.values()).map((cadena) =>
          parseInt(cadena.toString())
        )
      );
    }
  };

  const headerColumns = React.useMemo(() => {
    const columns = getColumns;

    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, intl]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...operationInstructions];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        return (
          user.number_delivery
            ?.toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          user.output_plan?.output_number
            ?.toLocaleLowerCase()
            .includes(filterValue.toLowerCase())
        );
      });
    }
    return filteredUsers;
  }, [operationInstructions, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a: OperationInstruction, b: OperationInstruction) => {
        const first = a[
          sortDescriptor.column as keyof OperationInstruction
        ] as number;
        const second = b[
          sortDescriptor.column as keyof OperationInstruction
        ] as number;
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    );
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (user: any, columnKey: React.Key) => {
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
                  <DropdownItem className={(isOMS() && exit_plan && getState() !== "pending") ? "do-not-show-dropdown-item" : ""} onClick={() => handleEdit(Number(user["id"]))}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      user.state !== "pending" || isOMS()
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleProcessing(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "processing" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      user.state !== "processing" || isOMS()
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleProcessed(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "processed" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      user.state !== "processed" || isOMS()
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleReturn(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "return" })}
                  </DropdownItem>
                  <DropdownItem className={(isOMS() && exit_plan && getState() !== "pending") ? "do-not-show-dropdown-item" : ""}
                    onClick={() => handleConfig(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "config" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      (user.state !== "pending" || (isOMS() && exit_plan && getState() !== "pending"))
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleCancel(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "cancel" })}
                  </DropdownItem>
                  <DropdownItem
                    className={isOMS() ? "do-not-show-dropdown-item" : ""}
                    onClick={() => handleDelete(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "Delete" })}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "operation_instruction_type": {
          const instructionTypes: InstructionTypeList =
            user.operation_instruction_type;
          const values: string[] = instructionTypes.instruction_type.map(
            (instruction: InstructionType) => {
              return getInstructionLabelByLanguage(instruction);
            }
          );
          return (
            <a
              href={`/${locale}/${
                isOMS() ? "oms" : "wms"
              }/operation_instruction/${user.id}/show` + ((exit_plan_id && exit_plan) ? `?exit_plan_id=${exit_plan_id}&exit_plan_state=${getState()}` : '')}
            >
              {values.join(", ")}
            </a>
          );
        }
        case "warehouse_id": {
          return user.warehouse.name;
        }
        case "user_id": {
          return user.user.username;
        }
        case "output_plan_id": {
          return user.output_plan ? user.output_plan.output_number: '--';
        }
        case "number_delivery": {
          return <CopyColumnToClipboard value={cellValue} />;
        }
        case "box_number": {
          return (
            <CopyColumnToClipboard
              value={user.output_plan.packing_lists
                .map((el: any) => {
                  return el.box_number;
                })
                .join(", ")}
            />
          );
        }
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
        case "updated_at":
        case "created_at": {
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
        default:
          return cellValue;
      }
    },
    [operationInstructions, locale]
  );

  const getInstructionLabelByLanguage = (instruction: InstructionType) => {
    if (locale === "es") {
      return instruction.es_name;
    } else if (locale === "zh") {
      return instruction.zh_name;
    }
    return instruction.name;
  };

  const changeTab = async(tab: string) => {
    if (tab !== statusSelected && !loadingItems) {
      setCookie("tabIO", tab);
      setStatusSelected(tab);
      await setLoadingItems(true);
      await loadStates(tab);
      await setLoadingItems(false);
    }
  };

  const handleProcessing = async (id: number) => {
    const op = operationInstructions.find((el) => el.id === id);
    if (op && op.id) {
      const appendages = await getAppendagesByOperationInstructionId(op.id);
      if (
        // @ts-ignore
        op.operation_instruction_type.instruction_type.find((el) => {
          return el.value === "change label" || el.value === "photograph" || el.value === "change boxes";
        }) &&
        (!appendages || appendages.length === 0)
      ) {
        showMsg(intl.formatMessage({ id: "missing_apendix_msg" }), {
          type: "warning",
        });
      } else {
        setDialogIds([id]);
        // @ts-ignore
        setDialogTexts(op.operation_instruction_type.instruction_type);
        setDialogType("processing");
        setDisplayOperationInstructionConfirmation(true);
      }
    }
  };

  const handleMultiProcessing = () => {
    let txt: string[] = [];
    setDialogIds(selectedItems);
    const op = operationInstructions.map((el) => {
      if (selectedItems.find((si) => si === el.id)) {
        // @ts-ignore
        txt = txt.concat(el.operation_instruction_type.instruction_type);
      }
    });
    setDialogTexts(txt);
    setDialogType("processing");
    setDisplayOperationInstructionConfirmation(true);
  };

  const handleProcessed = (id: number) => {
    const op = operationInstructions.find((el) => el.id === id);
    if (op) {
      setDialogIds([id]);
      // @ts-ignore
      setDialogTexts(op.operation_instruction_type.instruction_type);
      setDialogType("processed");
      setDisplayOperationInstructionConfirmation(true);
    }
  };

  const handleMultiProcess = () => {
    let txt: string[] = [];
    setDialogIds(selectedItems);
    const op = operationInstructions.map((el) => {
      if (selectedItems.find((si) => si === el.id)) {
        // @ts-ignore
        txt = txt.concat(el.operation_instruction_type.instruction_type);
      }
    });
    setDialogTexts(txt);
    setDialogType("processed");
    setDisplayOperationInstructionConfirmation(true);
  };

  const handleReturn = (id: number) => {
    const op = operationInstructions.find((el) => el.id === id);
    if (op) {
      setDialogIds([id]);
      // @ts-ignore
      setDialogTexts(op.operation_instruction_type.instruction_type);
      setDialogType("processing");
      setDisplayOperationInstructionConfirmation(true);
    }
  };

  const handleMultiReturn = () => {
    let txt: string[] = [];
    setDialogIds(selectedItems);
    const op = operationInstructions.map((el) => {
      if (selectedItems.find((si) => si === el.id)) {
        // @ts-ignore
        txt = txt.concat(el.operation_instruction_type.instruction_type);
      }
    });
    setDialogTexts(txt);
    setDialogType("processing");
    setDisplayOperationInstructionConfirmation(true);
  };

  const closeOperationInstructionCnfirmations = () => {
    setDialogIds([]);
    setDialogTexts([]);
    setDialogType("");
    setSelectedItems([]);
    loadStates(statusSelected);
    setDisplayOperationInstructionConfirmation(false);
  };

  const confirmOperationInstructionCnfirmations = async () => {
    const promises = dialogIds.map((id) => {
      const payload: OperationInstruction | undefined =
        operationInstructions.find((el) => el.id === id);
      if (payload) {
        switch (dialogType) {
          case "processed":
            payload.state = "processed";
            break;
          case "processing":
            payload.state = "processing";
            break;
          case "cancelled":
            payload.state = "cancelled";
            break;
        }
        const instruction_type: string[] = [];
        // @ts-ignore
        payload.operation_instruction_type.instruction_type.forEach((type) => {
          instruction_type.push(type.value);
        });
        payload.operation_instruction_type = instruction_type;
        delete payload.user;
        delete payload.warehouse;
        delete payload.instruction_type;
        delete payload.output_plan;
        // const result = await updateOperationInstruction(dialogIds[0], payload);
        return updateOperationInstruction(id, payload);
      }
    });
    const reuslt = await Promise.all(promises);
    closeOperationInstructionCnfirmations();
  };

  const getTitle = (): string => {
    return intl.formatMessage({ id: dialogType });
  };

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

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

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
          totalRecords={
            filteredItems.slice(0, operationInstructions.length).length
          }
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
    operationInstructions.length,
    rowsPerPage,
    hasSearchFilter,
    onSearchChange,
    onRowsPerPageChange,
    intl,
  ]);

  const getVisibleColumns = (): string[] => {
    const t = Array.from(visibleColumns) as string[];
    return t.filter((el) => el !== "actions");
  };

  const getSelectedOperationInstructions = (): OperationInstruction[] => {
    let its: OperationInstruction[] = [];
    for (let i = 0; i < selectedItems.length; i++) {
      const index = selectedItems[i];
      const item = operationInstructions.filter(
        (sp: OperationInstruction) => sp.id === index
      );
      if (filterValue && filterValue !== "") {
        const isSearchable =
          item[0].number_delivery
            ?.toLowerCase()
            ?.includes(filterValue.toLowerCase()) ||
          item[0].output_plan?.output_number
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
  };

  const handleExportExcel = () => {
    operationInstructionDataToExcel(
      getSelectedOperationInstructions(),
      intl,
      getVisibleColumns()
    );
  };

  const getLocation = (ep: any): string => {
    const locations: string[] = [];
    if (ep.output_plan && ep.output_plan.packing_lists && ep.output_plan.packing_lists?.length == 0) {
      return "--";
    }
    if(ep.output_plan && ep.output_plan.packing_lists) {
      ep.output_plan.packing_lists?.forEach((pl: any) => {
        if (
          pl.package_shelf &&
          pl.package_shelf[0]&&
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
    }
    return locations.join(", ");
  };

  const getState = (): string => {
    // @ts-ignore
    return exit_plan ? exit_plan?.state : "";
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

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="bg-gray-200 pt-1">
        <div
          className={`flex gap-3 ${
            exit_plan_id ? "" : "justify-between items-end"
          }`}
          style={
            exit_plan_id
              ? {
                  display: "flex",
                  justifyContent: "flex-end",
                  marginRight: "20px",
                  marginBottom: "10px",
                }
              : {}
          }
        >
          {exit_plan_id === undefined && (
            <Input
              isClearable
              className="w-full sm:max-w-[33%] search-input"
              placeholder=""
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          )}
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
              className={(isOMS() && exit_plan && getState() !== "pending") ? "do-not-show-dropdown-item" : ""}
            >
              {intl.formatMessage({ id: "create" })}
            </Button>
          </div>
        </div>
        <div
          className="flex gap-3"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
            marginTop: "10px",
            marginRight: exit_plan ? "20px" : "0px",
          }}
        >
          {statusSelected === "pending" && isWMS() && (
            <Button
              color="primary"
              onClick={() => handleMultiProcessing()}
              disabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "processing" })}
            </Button>
          )}

          {statusSelected === "pending" && isWMS() && (
            <Button
              color="primary"
              onClick={() => handleMultiCancel()}
              disabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "cancel" })}
            </Button>
          )}

          {statusSelected === "processing" && isWMS() && (
            <Button
              color="primary"
              onClick={() => handleMultiProcess()}
              disabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "processed" })}
            </Button>
          )}
          {statusSelected === "processed" && isWMS() && (
            <Button
              color="primary"
              onClick={() => handleMultiReturn()}
              disabled={selectedItems.length === 0}
            >
              {intl.formatMessage({ id: "return" })}
            </Button>
          )}
          <Button
            color="primary"
            isDisabled={selectedItems.length === 0}
            endContent={
              <FaFilePdf style={{ fontSize: "22px", color: "white" }} />
            }
          >
            <PDFDownloadLink
              document={
                <ExportTable
                  intl={intl}
                  data={getSelectedOperationInstructions()}
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
            style={{ width: "121px" }}
            endContent={
              <FaFileExcel style={{ fontSize: "22px", color: "white" }} />
            }
            onClick={() => handleExportExcel()}
            isDisabled={selectedItems.length === 0}
          >
            {intl.formatMessage({ id: "export" })}
          </Button>
        </div>
        <div className="flex justify-between items-center" style={{ marginRight: exit_plan ? "15px" : "0px" }}>
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
        <div
          className="overflow-x-auto tab-system-table bg-content1"
          style={{ marginBottom: exit_plan_id ? 0 : 10 }}
        >
          <ul
            className="flex space-x-4"
            style={{
              backgroundColor: "#37446b",
              borderRadius: "5px",
              width: exit_plan_id ? "99%" : "100%",
            }}
          >
            {operationInstructionState &&
              operationInstructionState.states.map((state: any, index) => {
                if (exit_plan_id !== undefined && state.value !== "all") {
                  return (
                    <li className="whitespace-nowrap" key={index}>
                      <button
                        className={
                          statusSelected === state.value
                            ? "px-4 py-3 tab-selected"
                            : "px-4 py-3 tab-default"
                        }
                        onClick={() => changeTab(state.value)}
                      >
                        {state[getLanguage(intl)]}(
                        {getCount(
                          state.value === "all" ? "total" : state.value
                        )}
                        )
                      </button>
                    </li>
                  );
                } else if (exit_plan_id === undefined) {
                  return (
                    <li className="whitespace-nowrap" key={index}>
                      <button
                        className={
                          statusSelected === state.value
                            ? "px-4 py-3 tab-selected"
                            : "px-4 py-3 tab-default"
                        }
                        onClick={() => changeTab(state.value)}
                      >
                        {state[getLanguage(intl)]}(
                        {getCount(
                          state.value === "all" ? "total" : state.value
                        )}
                        )
                      </button>
                    </li>
                  );
                }
              })}
          </ul>
        </div>
      </div>
      <div className="overflow-x-auto tab-system-table">
        <Table
          aria-label="OUTPUT-PLAN"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[auto]",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          // topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={(keys: Selection) => {
            selectedItemsFn(keys);
          }}
          // onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
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
            emptyContent={`${loadingItems ? intl.formatMessage({ id: "loading_items" }) : intl.formatMessage({ id: "no_results_found" })}`}
            items={loadingItems ? [] : sortedItems}
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

      {displayConfirmation && (
        <ConfirmationDialog close={close} confirm={confirm} />
      )}
      {displayOperationInstructionConfirmation && (
        <OperationInstructionConfirmationDialog
          close={closeOperationInstructionCnfirmations}
          confirm={confirmOperationInstructionCnfirmations}
          texts={dialogTexts}
          title={getTitle()}
        />
      )}
    </div>
  );
};

export default OperationInstructionTable;
