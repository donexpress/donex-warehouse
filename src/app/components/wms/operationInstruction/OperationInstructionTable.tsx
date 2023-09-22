import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import {
  capitalize,
  getDateFormat,
  getHourFormat,
  getLanguage,
} from "../../../../helpers/utils";
import { ExitPlanState } from "@/types/exit_planerege1992";
import {
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
} from "@/types/operation_instructionerege1992";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import OperationInstructionConfirmationDialog from "./OperationInstructionConfirmationDialog";

const INITIAL_VISIBLE_COLUMNS = [
  "operation_instruction_type",
  "warehouse_id",
  "output_plan_id",
  "user_id",
  "type",
  "number_delivery",
  "remark",
  "internal_remark",
  "actions",
];

interface Props {
  exit_plan_id: number;
}

const OperationInstructionTable = ({ exit_plan_id }: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const [operationInstructionState, setOperationInstructionState] =
    useState<ExitPlanState | null>(null);
  const [statusSelected, setStatusSelected] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
  const [dialogType, setDialogType] = useState<"processed" | "processing" | "cancelled" | "" >(
    ""
  );

  useEffect(() => {
    loadStates();
  }, [statusSelected]);
  const loadStates = async () => {
    const states: ExitPlanState = await getOperationInstructionStates();
    const list_state =  states.states.find(el => el.position === statusSelected)
    const opi = await getOperationInstructionsByOutputPlan(exit_plan_id, list_state?.value === 'all' ? "": list_state?.value );
    setOperationInstructions(opi);
    setOperationInstructionState(states);
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
        uid: "warehouse",
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

  const handleAdd = () => {
    router.push({
      pathname: `/${locale}/wms/operation_instruction/insert`,
      search: `?exit_plan_id=${exit_plan_id}`,
    });
  };

  const handleShow = (id: number) => {
    router.push({
      pathname: `/${locale}/wms/operation_instruction/${id}/show`,
    });
  };

  const handleEdit = (id: number) => {
    router.push({
      pathname: `/${locale}/wms/operation_instruction/${id}/update`,
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

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setDisplayConfirmation(true);
  };

  const confirm = async () => {
    const result = await deleteOperationInstructions(selectedId);
    await loadStates();
    close();
  };

  const close = () => {
    setSelectedId(-1);
    setDisplayConfirmation(false);
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
        return user.number_delivery
          ?.toLowerCase()
          .includes(filterValue.toLowerCase());
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
                  <DropdownItem onClick={() => handleEdit(Number(user["id"]))}>
                    {intl.formatMessage({ id: "Edit" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      user.state !== "pending"
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleProcessing(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "processing" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      user.state !== "processing"
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleProcessed(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "processed" })}
                  </DropdownItem>
                  <DropdownItem
                    className={
                      user.state !== "processed"
                        ? "do-not-show-dropdown-item"
                        : ""
                    }
                    onClick={() => handleReturn(Number(user["id"]))}
                  >
                    {intl.formatMessage({ id: "return" })}
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
          return values.join(", ");
        }
        case "warehouse_id": {
          return user.warehouse.name;
        }
        case "output_plan_id": {
          return user.output_plan.output_number;
        }
        default:
          console.log(cellValue);
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

  const changeTab = (tab: number) => {
    setStatusSelected(tab)
  };

  const handleProcessing = (id: number) => {
    const op = operationInstructions.find((el) => el.id === id);
    if (op) {
      setDialogIds([id]);
      // @ts-ignore
      setDialogTexts(op.operation_instruction_type.instruction_type);
      setDialogType("processing");
      setDisplayOperationInstructionConfirmation(true);
    }
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

  const handleReturn = (id: number) => {
    const op = operationInstructions.find((el) => el.id === id);
    if (op) {
      setDialogIds([id]);
      // @ts-ignore
      setDialogTexts(op.operation_instruction_type.instruction_type);
      setDialogType("processing");
      setDisplayOperationInstructionConfirmation(true);
    }
  }

  const closeOperationInstructionCnfirmations = () => {
    setDialogIds([]);
    setDialogTexts([]);
    setDialogType("");
    loadStates()
    setDisplayOperationInstructionConfirmation(false);
  };

  const confirmOperationInstructionCnfirmations = async () => {
    const payload: OperationInstruction | undefined =
      operationInstructions.find((el) => el.id === dialogIds[0]);
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
      const result = await updateOperationInstruction(dialogIds[0], payload);
    }
    closeOperationInstructionCnfirmations();
  };

  const getTitle = (): string => {
        return intl.formatMessage({ id: dialogType });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="bg-gray-200 pt-1">
        <div
          className="flex gap-3"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "20px",
            marginBottom: "10px",
          }}
        >
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
        <div className="overflow-x-auto tab-system-table bg-content1">
          <ul
            className="flex space-x-4"
            style={{
              backgroundColor: "#37446b",
              borderRadius: "5px",
              width: "99%",
            }}
          >
            {operationInstructionState &&
              operationInstructionState.states.map((state: any, index) => (
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
                    {state.position === statusSelected &&
                      ` (${operationInstructionState.states.length})`}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <Table
        aria-label="OUTPUT-PLAN"
        isHeaderSticky
        // bottomContent={bottomContent}
        // bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] no-padding-left",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        // topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
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