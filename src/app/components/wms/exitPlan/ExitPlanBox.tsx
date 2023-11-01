import React, { useState, ChangeEvent } from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useIntl } from "react-intl";
import { PackingList, StoragePlan } from "../../../../types/storage_plan";
import { useRouter } from "next/router";
import { ExitPlan } from "../../../../types/exit_plan";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import {
  getExitPlansById,
  getNonBoxesOnExitPlans,
  pullBoxes,
  removeBoxesExitPlan,
  updateExitPlan,
} from "../../../../services/api.exit_plan";
import AddExitPlanDialog from "./AddExitPlanDialog";
import {
  getPackingListsByBoxNumber,
  getPackingListsByCaseNumber,
} from "../../../../services/api.packing_list";
import { getStoragePlanByOrder_number } from "../../../../services/api.storage_plan";
import { showMsg, inventoryOfExitPlan, isOMS } from "../../../../helpers";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InventoryList from "./InventoryList";
import { getDateFormat, getHourFormat } from "@/helpers/utilserege1992";
import ConfirmationDialog from "../../common/ConfirmationDialog";

interface Props {
  exitPlan: ExitPlan;
}

const changeAllCheckedExitPlans = (
  exitPlans: ExitPlan,
  checked: boolean = true
): { packing_lists: PackingList; checked: boolean }[] => {
  if (exitPlans.case_numbers) {
    return exitPlans.packing_lists
      ? exitPlans.packing_lists.map((el) => {
          return { packing_lists: el, checked };
        })
      : [];
  }
  return [];
};

const ExitPlanBox = ({ exitPlan }: Props) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [selectAllPackingListItems, setSelectAllPackingListItems] =
    useState<boolean>(false);
  const [rows, setRows] = useState<
    { packing_lists: PackingList; checked: boolean }[]
  >(
    exitPlan && exitPlan.packing_lists
      ? exitPlan.packing_lists.map((el) => ({
          packing_lists: el,
          checked: false,
        }))
      : []
  );
  const [selectedRows, setSelectedRows] = useState<
    { packing_lists: PackingList; checked: boolean }[]
  >([]);

  const handleAction = (action: number) => {
    switch (action) {
      case 1:
        {
          setShowAddDialog(true);
        }
        break;
      case 2: {
        setShowConfirmDialog(true);
        break;
      }
      case 3:
        {
          router.push(`/${locale}/wms/exit_plan/${exitPlan.id}/update`);
        }
        break;
    }
  };

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number = -1
  ) => {
    // @ts-ignore
    const { type, checked } = event.target;
    if (type === "checkbox" && exitPlan) {
      if (index === -1) {
        setSelectAllPackingListItems(checked);
        setRows(changeAllCheckedExitPlans(exitPlan, checked));
        setSelectedRows(
          checked ? changeAllCheckedExitPlans(exitPlan, true) : []
        );
      } else {
        const item: { packing_lists: PackingList; checked: boolean } = {
          ...rows[index],
          checked,
        };
        const items: { packing_lists: PackingList; checked: boolean }[] =
          rows.map((el, i: number) => {
            return index !== i ? el : item;
          });
        setRows(items);

        if (checked) {
          setSelectedRows(selectedRows.concat([item]));
        } else {
          setSelectedRows(
            selectedRows.filter(
              (element) => element.packing_lists.id !== item.packing_lists.id
            )
          );
        }

        const isCheckoutAllItems = items.every((element) => element.checked);
        if (isCheckoutAllItems) {
          setSelectAllPackingListItems(true);
        } else {
          setSelectAllPackingListItems(false);
        }
      }
    }
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
  };

  const addNewData = async (data: {
    case_number: string;
    warehouse_order_number: string;
  }) => {
    if (exitPlan && exitPlan.id) {
      const response: any = await pullBoxes(exitPlan.id, data);
      const ep = await getExitPlansById(exitPlan.id);
      if (ep) {
        exitPlan = ep;
        ep.packing_lists?.forEach((pl) => {
          if (
            !rows.find((r) => r.packing_lists.case_number === pl.case_number)
          ) {
            rows.push({ checked: false, packing_lists: pl });
          }
        });
        const tmprows = rows;
        setRows([]);
        setRows(tmprows);
      }
      if (response["stored"]) {
        showMsg(intl.formatMessage({ id: "not_correct_state_msg" }), {
          type: "warning",
        });
      } else if (response["already_used"]) {
        showMsg(intl.formatMessage({ id: "alreadyUsedmsg" }), {
          type: "error",
        });
      } else if (response["duplicated"]) {
        showMsg(intl.formatMessage({ id: "duplicatedMsg" }), {
          type: "warning",
        });
      } else {
        showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
          type: "success",
        });
      }
      closeAddDialog();
    }
  };

  const handleDelete = async (case_number: string) => {
    const new_case_numbers: string[] | undefined =
      exitPlan?.case_numbers?.filter((el) => el !== case_number);
    if (exitPlan && exitPlan.id) {
      const result = await removeBoxesExitPlan(exitPlan.id, {
        case_numbers: [case_number],
      });
      if (result.status < 300) {
        exitPlan.case_numbers = new_case_numbers;
        const new_rows = rows.filter(
          (row) => row.packing_lists.case_number !== case_number
        );
        setRows(new_rows);
      } else if (result.status === 401) {
        showMsg(intl.formatMessage({ id: "not_own_box_msg" }), {
          type: "error",
        });
      } else {
        showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
          type: "success",
        });
      }
    }
  };

  const getBoxes = (
    items: { packing_lists: PackingList; checked: boolean }[]
  ): PackingList[] => {
    return items.map((item) => {
      return item.packing_lists;
    });
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const deleteElements = async () => {
    const new_case_numbers: string[] = [];
    if (exitPlan.case_numbers) {
      exitPlan.case_numbers.forEach((el) => {
        if (
          selectedRows.find((sr) => sr.packing_lists.case_number === el) ===
          undefined
        ) {
          new_case_numbers.push(el);
        }
      });
      if (exitPlan && exitPlan.id) {
        const result = await updateExitPlan(exitPlan.id, {
          case_numbers: new_case_numbers,
        });
        if (result.status < 300) {
          const ep = await getExitPlansById(exitPlan.id);
          if (ep) {
            exitPlan = ep;
          }
          const new_rows: { packing_lists: PackingList; checked: boolean }[] =
            [];
          if (ep && ep.case_numbers !== undefined) {
            ep.case_numbers.forEach((cn) => {
              const tmp = rows.find(
                (el) => el.packing_lists.case_number === cn
              );
              if (tmp) {
                new_rows.push(tmp);
              }
            });
          }

          setRows(new_rows);
          setSelectedRows([]);
          showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
            type: "success",
          });
        } else if (result.status === 401) {
          showMsg(intl.formatMessage({ id: "not_own_box_msg" }), {
            type: "error",
          });
        } else {
          const new_rows: { packing_lists: PackingList; checked: boolean }[] = [];
          rows.forEach((value) => {
            const findI = new_case_numbers.findIndex((cn: string) => cn===value.packing_lists.case_number);
            if (findI !== -1) {
              new_rows.push(value);
            }
          });
          setRows(new_rows);
          setSelectedRows([]);
          showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
            type: "success",
          });
        }
      }
    }
    closeConfirmDialog();
  };

  const getState = (): string => {
    // @ts-ignore
    return exitPlan?.state;
  };

  return (
    <>
      <div style={{ paddingTop: "20px" }}>
        <div
          className="exit-plan-data__header-pl"
          style={{ paddingRight: "16px" }}
        >
          <div className="elements-row-start show-sp-desktop"></div>
          <div className="elements-center-end">
            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" type="button" className="px-4">
                  {intl.formatMessage({ id: "actions" })}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions menu">
                <DropdownItem
                  className={
                    isOMS() && exitPlan && getState() !== "pending"
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleAction(1)}
                >
                  {intl.formatMessage({ id: "add" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    selectedRows.length === 0 ||
                    (isOMS() && exitPlan && getState() !== "pending")
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  onClick={() => handleAction(2)}
                >
                  {intl.formatMessage({ id: "Delete" })}
                </DropdownItem>
                <DropdownItem
                  className={
                    rows.length === 0 ? "do-not-show-dropdown-item" : ""
                  }
                  onClick={() =>
                    inventoryOfExitPlan(exitPlan, getBoxes(rows), intl)
                  }
                >
                  {intl.formatMessage({ id: "generate_xlsx_inventory" })}
                </DropdownItem>
                <DropdownItem>
                  <PDFDownloadLink
                    document={
                      <InventoryList
                        intl={intl}
                        exitPlan={exitPlan}
                        boxes={getBoxes(rows)}
                      />
                    }
                    fileName={`${exitPlan.output_number}.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      intl.formatMessage({ id: "generate_pdf_inventory" })
                    }
                  </PDFDownloadLink>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }} className="info-epb">
        <div>
          <div
            className="info-epb__table bg-default-100"
            style={{
              padding: "5px 0px 5px 5px",
              borderRadius: "5px 5px 5px 5px",
            }}
          >
            <div className="elements-center">
              <input
                type="checkbox"
                name="selectAll"
                checked={selectAllPackingListItems}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className="elements-center-start">
              <span>{intl.formatMessage({ id: "box_number" })}</span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "case_number" })}
              </span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "client_weight" })} (kg)
              </span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "client_height" })} (cm)
              </span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "storage_weight" })} (kg)
              </span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "storage_height" })} (cm)
              </span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "products_per_box" })}
              </span>
            </div>
            <div className="elements-center-start">
              <span>{intl.formatMessage({ id: "location" })}</span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "storage_time" })}
              </span>
            </div>
            <div className="elements-center-start">
              <span className="">
                {intl.formatMessage({ id: "delivery_time" })}
              </span>
            </div>
            <div
              className={
                isOMS() && exitPlan && getState() !== "pending"
                  ? "do-not-show-dropdown-item"
                  : "elements-center"
              }
            >
              <span className="text-center">
                {intl.formatMessage({ id: "actions" })}
              </span>
            </div>
          </div>
          <div className="boxes-container-values">
            {rows.map((row, index) => (
              <div
                key={index}
                className="info-epb__table storage-plan-header"
                style={{ padding: "8px 0px 8px 5px" }}
              >
                <div className="elements-start-center">
                  <input
                    style={{ marginTop: "3px" }}
                    type="checkbox"
                    name={`packing-list-${index}`}
                    checked={row.checked}
                    onChange={(event) => handleCheckboxChange(event, index)}
                  />
                </div>
                <div className="">{row.packing_lists?.box_number}</div>
                <div className="">{row.packing_lists?.case_number}</div>
                <div className="">{row.packing_lists?.client_weight}</div>
                <div className="">{row.packing_lists?.client_height}</div>
                <div className="">{"--"}</div>
                <div className="">{"--"}</div>
                <div className="">{row.packing_lists?.amount}</div>
                <div>
                  {row.packing_lists && row.packing_lists.package_shelf ? (
                    <>
                      {exitPlan.warehouse ? (
                        <>
                          {exitPlan.warehouse.code}-
                          {String(
                            // @ts-ignore
                            row.packing_lists.package_shelf.shelf
                              ?.partition_table
                          ).padStart(2, "0")}
                          -
                          {String(
                            // @ts-ignore
                            row.packing_lists.package_shelf.shelf
                              ?.number_of_shelves
                          ).padStart(2, "0")}
                          -
                          {String(
                            // @ts-ignore
                            row.packing_lists.package_shelf.layer
                          ).padStart(2, "0")}
                          -
                          {String(
                            // @ts-ignore
                            row.packing_lists.package_shelf.column
                          ).padStart(2, "0")}
                          <br />
                        </>
                      ) : null}
                      {intl.formatMessage({ id: "partition" })}:{" "}
                      {row.packing_lists.package_shelf &&
                      // @ts-ignore
                      row.packing_lists.package_shelf.shelf
                        ? // @ts-ignore
                          row.packing_lists.package_shelf.shelf.partition_table
                        : ""}
                      &nbsp;
                      {intl.formatMessage({ id: "shelf" })}:{" "}
                      {row.packing_lists.package_shelf &&
                      // @ts-ignore
                      row.packing_lists.package_shelf.shelf
                        ? // @ts-ignore
                          row.packing_lists.package_shelf.shelf
                            .number_of_shelves
                        : ""}
                      <br />
                      {intl.formatMessage({ id: "layer" })}:{" "}
                      {row.packing_lists.package_shelf
                        ? // @ts-ignore
                          row.packing_lists.package_shelf.layer
                        : ""}
                      &nbsp;
                      {intl.formatMessage({ id: "column" })}:{" "}
                      {row.packing_lists.package_shelf
                        ? // @ts-ignore
                          row.packing_lists.package_shelf.column
                        : ""}
                    </>
                  ) : (
                    "--"
                  )}
                </div>
                <div className="">
                  {/* @ts-ignore */}
                  {row.packing_lists.storage_time}{" "}
                  {intl.formatMessage({ id: "days" })}
                </div>
                <div className="">
                  {getDateFormat(
                    exitPlan.delivered_time ? exitPlan.delivered_time : ""
                  )}
                  ,{" "}
                  {getHourFormat(
                    exitPlan.delivered_time ? exitPlan.delivered_time : ""
                  )}
                </div>
                <div
                  className={
                    isOMS() && exitPlan && getState() !== "pending"
                      ? "do-not-show-dropdown-item"
                      : ""
                  }
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <VerticalDotsIcon className="text-default-300" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          handleDelete(row.packing_lists.case_number)
                        }
                      >
                        {intl.formatMessage({ id: "Delete" })}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAddDialog && (
        <AddExitPlanDialog
          close={closeAddDialog}
          confirm={addNewData}
          title={intl.formatMessage({ id: "add_exit_plan_boxes" })}
        />
      )}
      {showConfirmDialog && (
        <ConfirmationDialog
          close={closeConfirmDialog}
          confirm={deleteElements}
        />
      )}
    </>
  );
};

export default ExitPlanBox;
