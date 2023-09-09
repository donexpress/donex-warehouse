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
import { getStoragePlanByOrder_number } from "../../../../services/api.storage_plan";
import {
  StoragePlanProps,
  StoragePlan,
  PackingList,
} from "../../../../types/storage_plan";
import { User } from "../../../../types/user";
import { Warehouse } from "../../../../types/warehouse";
import RowStoragePlan from "../../common/RowStoragePlan";
import RowStoragePlanHeader from "../../common/RowStoragePlanHeader";
import { Formik, Form } from "formik";
import PackingListDialog from "../../common/PackingListDialog";
import { getDateFormat, getHourFormat } from "@/helpers/utilserege1992";
import AddExitPlanDialog from "./AddExitPlanDialog";
import { updateExitPlan } from "@/services/api.exit_planerege1992";
import { ExitPlan, ExitPlanProps } from "@/types/exit_planerege1992";
import { getPackingListsByCaseNumber } from "@/services/api.packing_listerege1992";
import { VerticalDotsIcon } from "../../common/VerticalDotsIcon";

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
  const [showRemoveBoxDialog, setShowRemoveBoxDialog] =
    useState<boolean>(false);
  const [showSplitBillDialog, setShowSplitBillDialog] =
    useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  const cancelSend = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms/storage_plan`);
    }
  };

  const getUserLabel = (usersAll: User[], userId: number): string | number => {
    const response: User[] = usersAll.filter((user) => user.id === userId);
    if (response && response.length > 0) {
      return response[0].customer_number + " - " + response[0].username;
    }
    return userId;
  };

  const getWarehouseLabel = (
    warehouseAll: Warehouse[],
    warehouseId: number
  ): string | number => {
    const response: Warehouse[] = warehouseAll.filter(
      (warehouse) => warehouse.id === warehouseId
    );
    if (response && response.length > 0) {
      return response[0].name + ` (${response[0].code})`;
    }
    return warehouseId;
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/storage_plan/${id}/update`);
  };

  const handleAction = (action: number) => {
    switch (action) {
      case 1:
        {
          setShowAddDialog(true);
        }
        break;
      case 2:
        {
          setShowRemoveBoxDialog(true);
        }
        break;
      case 3:
        {
          router.push(`/${locale}/wms/storage_plan/${id}/modify_packing_list`);
        }
        break;
      case 4:
        {
          setShowSplitBillDialog(true);
        }
        break;
    }
  };

  const formatBody = (
    values: StoragePlan,
    isSplitBill = false
  ): StoragePlan => {
    return {
      user_id: values.user_id,
      warehouse_id: values.warehouse_id,
      customer_order_number:
        values.customer_order_number + (isSplitBill ? "_1" : ""),
      box_amount: values.box_amount,
      delivered_time: values.delivered_time,
      observations: values.observations,
      rejected_boxes: values.rejected_boxes,
      return: values.return,
    };
  };

  const closeRemoveBoxesDialog = () => {
    setShowRemoveBoxDialog(false);
  };

  const closeSplitBillDialog = () => {
    setShowSplitBillDialog(false);
  };

  // const handleCheckboxChange = async (
  //   event: ChangeEvent<HTMLInputElement>,
  //   index: number = -1
  // ) => {
  //   // @ts-ignore
  //   const { type, checked } = event.target;
  //   if (type === "checkbox" && exitPlan) {
  //     if (index === -1) {
  //       setSelectAllPackingListItems(checked);
  //       const altered = rows.map((row) => {
  //         return { ...row, checked };
  //       });
  //       await setRows(altered);
  //     } else {
  //       const altered = rows.map((row, i) => {
  //         if (i === index) {
  //           return { ...row, checked };
  //         }
  //         return row;
  //       });
  //       await setRows(altered);
  //     }
  //     const isCheckoutAllItems = rows.every((element) => element.checked);
  //     if (isCheckoutAllItems) {
  //       setSelectAllPackingListItems(true);
  //     } else {
  //       setSelectAllPackingListItems(false);
  //     }
  //   }
  // };

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
            selectedRows.filter((element) => element.packing_lists.id !== item.packing_lists.id)
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
    let exist = false;
    if (data.case_number) {
      const result = await getPackingListsByCaseNumber(data.case_number);
      exist = result ? true : false;
    }
    if (exitPlan) {
      if (!exitPlan.case_numbers) {
        exitPlan.case_numbers = [data.case_number];
      } else {
        const added = exitPlan.case_numbers?.find(
          (value) => value === data.case_number
        );
        if (!added) {
          exitPlan.case_numbers.push(data.case_number);
        }
      }
      if (exist && exitPlan.id) {
        await updateExitPlan(exitPlan.id, {
          case_numbers: exitPlan.case_numbers,
        });
        const result = await getPackingListsByCaseNumber(data.case_number);
        if (result && exitPlan.packing_lists) {
          rows.push({ packing_lists: result, checked: false });
          const tmprows = rows;
          setRows([]);
          setRows(tmprows);
          console.log(tmprows, result);
        }
      }
    }
    closeAddDialog();
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
      });
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
            onClick={() => goToEdit()}
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
      {/* {showRemoveBoxDialog && (
        <PackingListDialog
          close={closeRemoveBoxesDialog}
          confirm={removeBoxes}
          title={intl.formatMessage({ id: "remove_box" })}
          packingLists={selectedRows}
        />
      )}
      {showSplitBillDialog && (
        <PackingListDialog
          close={closeSplitBillDialog}
          confirm={splitBill}
          title={intl.formatMessage({ id: "split_bill" })}
          packingLists={selectedRows}
        />
      )} */}
    </div>
  );
};

export default ExitPlanConfig;
