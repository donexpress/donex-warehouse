import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import "../../../../styles/wms/exit.plan.config.scss";
import { showMsg, isOMS, isWMS } from "../../../../helpers";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { PackingList, StoragePlan } from "../../../../types/storage_plan";
import { getDateFormat, getHourFormat } from "../../../../helpers/utils";
import AddExitPlanDialog from "./AddExitPlanDialog";
import {
  getExitPlansById,
  updateExitPlan,
} from "../../../../services/api.exit_plan";
import { ExitPlan, ExitPlanProps } from "../../../../types/exit_plan";
import { getPackingListsByCaseNumber } from "../../../../services/api.packing_list";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";
import { getStoragePlanByOrder_number } from "../../../../services/api.storage_plan";

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

const ExitPlanConfig = ({ id, exitPlan }: ExitPlanProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
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
  const [selectAllPackingListItems, setSelectAllPackingListItems] =
    useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  const handleAction = (action: number) => {
    switch (action) {
      case 1:
        {
          setShowAddDialog(true);
        }
        break;
      case 2: {
        break;
      }
      case 3:
        {
          router.push(`/${locale}/wms/exit_plan/${id}/update`);
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

  const addNewData = async (data: any) => {
    console.log(data.case_number);
    if (exitPlan) {
      if (!exitPlan.case_numbers) {
        exitPlan.case_numbers = [];
      }
      let exist: PackingList | StoragePlan | null = null;
      let added: string | undefined = undefined;
      if (data.case_number) {
        exist = await getPackingListsByCaseNumber(data.case_number);
        if (!exist) {
          showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
            type: "error",
          });
        }
        added = exitPlan.case_numbers?.find(
          (value) => value === data.case_number
        );
        if (added === undefined) {
          exitPlan.case_numbers.push(data.case_number);
        } else {
          showMsg(intl.formatMessage({ id: "duplicatedMsg" }), {
            type: "warning",
          });
        }
      }
      if (data.warehouse_order_number) {
        const tmp = await getStoragePlanByOrder_number(
          data.warehouse_order_number
        );
        exist = tmp ? tmp[0] : null;
        if (tmp && exitPlan) {
          const storage_plan = tmp[0];
          storage_plan.packing_list?.forEach((pl) => {
            // @ts-ignore
            const tmp_added = exitPlan.case_numbers?.find(
              (value) => value === pl.case_number
            );
            if (tmp_added === undefined) {
              // @ts-ignore
              exitPlan.case_numbers.push(pl.case_number);
            }
          });
        }
      }
      if (exitPlan.id && exist) {
        await updateExitPlan(exitPlan.id, {
          case_numbers: exitPlan.case_numbers,
          state: "to_be_chosen",
        });
        console.log();
        if (id) {
          const ep = await getExitPlansById(id);
          if (ep) {
            ep.packing_lists?.forEach((pl) => {
              if (
                !rows.find(
                  (r) => r.packing_lists.case_number === pl.case_number
                )
              ) {
                rows.push({ checked: false, packing_lists: pl });
              }
            });
            const tmprows = rows;
            setRows([]);
            setRows(tmprows);
          }
          closeAddDialog();
        }
      }
    }
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
  };

  const handleDelete = async (case_number: string) => {
    const new_case_numbers: string[] | undefined =
      exitPlan?.case_numbers?.filter((el) => el !== case_number);
    if (exitPlan && exitPlan.id) {
      await updateExitPlan(exitPlan.id, {
        case_numbers: new_case_numbers,
        state: "to_be_chosen",
      });
      exitPlan.case_numbers = new_case_numbers;
      const new_rows = rows.filter(
        (row) => row.packing_lists.case_number !== case_number
      );
      setRows(new_rows);
    }
  };

  return (
    <div
      className="user-form-body shadow-small"
      style={{ paddingRight: "0px" }}
    >
      <div className="flex" style={{ paddingRight: "16px" }}>
        <h1 className="flex-1 text-xl font-semibold">
          {intl.formatMessage({ id: "config" })}{" "}
          {intl.formatMessage({ id: "exitPlan" })}
        </h1>
        <div className="w-100">
          <Button
            color="primary"
            type="button"
            className="px-4"
            onClick={() => handleAction(3)}
          >
            {intl.formatMessage({ id: "go_to_edit" })}
          </Button>
        </div>
      </div>
      <div className="user-form-body__container">
        <div className="storage-plan-data">
          <div style={{ paddingTop: "10px" }}>
            <div
              className="storage-plan-data__table bg-default-100"
              style={{
                padding: "5px 0px 5px 5px",
                borderRadius: "5px 5px 0 0",
              }}
            >
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "delivery_time" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "address" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "observations" })}
                </span>
              </div>
            </div>
            <div
              className="storage-plan-data__table storage-plan-header"
              style={{
                padding: "5px 0px 5px 5px",
                borderRadius: "0 0 5px 5px",
              }}
            >
              <div className="elements-center">
                {exitPlan?.delivered_time
                  ? `${getDateFormat(exitPlan?.delivered_time)} ${getHourFormat(
                      exitPlan.delivered_time
                    )}`
                  : "-"}
              </div>
              <div className="elements-center">
                {exitPlan?.address ? exitPlan?.address : "-"}
              </div>
              <div className="elements-center">
                {exitPlan?.observations ? exitPlan?.observations : "-"}
              </div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "20px" }}>
          <div
            className="storage-plan-data__header-pl"
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
                  <DropdownItem onClick={() => handleAction(1)}>
                    {intl.formatMessage({ id: "add" })}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleAction(2)}>
                    {intl.formatMessage({ id: "print_inventory_list" })}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "10px" }} className="info-packing-list">
          <div>
            <div
              className="info-packing-list__table bg-default-100"
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
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "case_number" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "client_weight" })} (kg)
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "client_height" })} (cm)
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "storage_weight" })} (kg)
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "storage_height" })} (cm)
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "products_per_box" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "storage_time" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "delivery_time" })}
                </span>
              </div>
              <div className="elements-center">
                <span className="text-center">
                  {intl.formatMessage({ id: "actions" })}
                </span>
              </div>
            </div>
            {rows.map((row, index) => (
              <div
                key={index}
                className="info-packing-list__table storage-plan-header"
                style={{ padding: "8px 0px 8px 5px" }}
              >
                <div className="elements-center">
                  <input
                    type="checkbox"
                    name={`packing-list-${index}`}
                    checked={row.checked}
                    onChange={(event) => handleCheckboxChange(event, index)}
                  />
                </div>
                <div className="elements-center">
                  {row.packing_lists?.case_number}
                </div>
                <div className="elements-center">
                  {row.packing_lists?.client_weight}
                </div>
                <div className="elements-center">
                  {row.packing_lists?.client_height}
                </div>
                <div className="elements-center">{"--"}</div>
                <div className="elements-center">{"--"}</div>
                <div className="elements-center">
                  {row.packing_lists?.box_number}
                </div>
                <div className="elements-center">{"--"}</div>
                <div className="elements-center">{"--"}</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
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
    </div>
  );
};

export default ExitPlanConfig;
