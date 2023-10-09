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
  updateExitPlan,
} from "../../../../services/api.exit_plan";
import AddExitPlanDialog from "./AddExitPlanDialog";
import { getPackingListsByBoxNumber, getPackingListsByCaseNumber } from "../../../../services/api.packing_list";
import { getStoragePlanByOrder_number } from "../../../../services/api.storage_plan";
import { showMsg, inventoryOfExitPlan } from "../../../../helpers";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InventoryList from "./InventoryList";
import { getDateFormat, getHourFormat } from "@/helpers/utilserege1992";

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
    if (exitPlan) {
      if (!exitPlan.case_numbers) {
        exitPlan.case_numbers = [];
      }
      let exist: PackingList | StoragePlan | null = null;
      let added: string | undefined = undefined;
      if (data.case_number) {
        const arr = data.case_number.split(",");
        for (let i = 0; i < arr.length; i++) {
          const caseNumber = arr[i].trim();
          exist = caseNumber.indexOf('DEW') >-1 ? await getPackingListsByCaseNumber(caseNumber) : await getPackingListsByBoxNumber(caseNumber);
          if (!exist) {
            showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
              type: "error",
            });
          }
          added = exitPlan.case_numbers?.find(
            (value) => value === (exist as PackingList).case_number
          );
          if (added === undefined) {
            exitPlan.case_numbers.push((exist as PackingList).case_number);
          } else {
            showMsg(intl.formatMessage({ id: "duplicatedMsg" }), {
              type: "warning",
            });
          }
        }
      }
      if (data.warehouse_order_number) {
        const arr = data.warehouse_order_number.split(",");
        let tmp: StoragePlan[] = [];
        for (let i = 0; i < arr.length; i++) {
          const t = await getStoragePlanByOrder_number(arr[i]);
          if (t) {
            tmp = tmp.concat(t);
          }
        }
        exist = tmp ? tmp[0] : null;
        if (tmp && exitPlan) {
          tmp.forEach((t) => {
            const storage_plan = t;
            storage_plan.packing_list?.forEach((pl) => {
              // @ts-ignore
              const tmp_added = exitPlan.case_numbers?.find(
                (value) => value === pl.case_number
              );
              if (tmp_added === undefined) {
                // @ts-ignore
                exitPlan.case_numbers.push(pl.case_number);
              } else {
                showMsg(intl.formatMessage({ id: "duplicatedMsg" }), {
                  type: "warning",
                });
              }
            });
          });
        }
      }
      // update portion
      if (exitPlan.id && exist) {
        console.log(exitPlan.case_numbers)
        const result = await updateExitPlan(exitPlan.id, {
          case_numbers: exitPlan.case_numbers,
        });
        if (result.status === 401) {
          showMsg(intl.formatMessage({ id: "not_own_box_msg" }), {
            type: "error",
          });
        } else {
          if (result.status === 422) {
            showMsg(intl.formatMessage({ id: "not_correct_state_msg" }), {
              type: "warning",
            });
          } else {
            showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
              type: "success",
            });
          }
          if (exitPlan.id) {
            const ep = await getExitPlansById(exitPlan.id);
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
    }
  };

  const handleDelete = async (case_number: string) => {
    const new_case_numbers: string[] | undefined =
      exitPlan?.case_numbers?.filter((el) => el !== case_number);
    if (exitPlan && exitPlan.id) {
      const result = await updateExitPlan(exitPlan.id, {
        case_numbers: new_case_numbers,
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

  const getBoxes = (items: { packing_lists: PackingList; checked: boolean }[]): PackingList[] => {
    return items.map((item) => {
      return item.packing_lists
    });
  }

  return (
    <>
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
                <DropdownItem className={(rows.length === 0) ? "do-not-show-dropdown-item" : ""} onClick={() => inventoryOfExitPlan(exitPlan, getBoxes(rows), intl )}>
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
            <div className='elements-center-start'>
              <span>
                {intl.formatMessage({ id: 'box_number' })}
              </span>
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
              <span>
                {intl.formatMessage({ id: "location" })}
              </span>
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
            <div className="elements-center">
              <span className="text-center">
                {intl.formatMessage({ id: "actions" })}
              </span>
            </div>
          </div>
          {rows.map((row, index) => (
            <div
              key={index}
              className="info-epb__table storage-plan-header"
              style={{ padding: "8px 0px 8px 5px" }}
            >
              <div className="elements-start-center">
                <input style={{ marginTop: '3px' }}
                  type="checkbox"
                  name={`packing-list-${index}`}
                  checked={row.checked}
                  onChange={(event) => handleCheckboxChange(event, index)}
                />
              </div>
              <div className="">
                {row.packing_lists?.box_number}
              </div>
              <div className="">
                {row.packing_lists?.case_number}
              </div>
              <div className="">
                {row.packing_lists?.client_weight}
              </div>
              <div className="">
                {row.packing_lists?.client_height}
              </div>
              <div className="">{"--"}</div>
              <div className="">{"--"}</div>
              <div className="">{row.packing_lists?.amount}</div>
              <div>
              {
                (row.packing_lists && row.packing_lists.package_shelf && row.packing_lists.package_shelf.length > 0) ? (
                  <>
                    {exitPlan.warehouse ? (
                      <>
                        {exitPlan.warehouse.code}-{String(row.packing_lists.package_shelf[0].shelf?.partition_table).padStart(2, '0')}-{String(row.packing_lists.package_shelf[0].shelf?.number_of_shelves).padStart(2, '0')}-{String(row.packing_lists.package_shelf[0].layer).padStart(2, '0')}-{String(row.packing_lists.package_shelf[0].column).padStart(2, '0')}
                        <br />
                      </>
                    ) : null}
                    {intl.formatMessage({ id: 'partition' })}: {(row.packing_lists.package_shelf && row.packing_lists.package_shelf.length > 0 && row.packing_lists.package_shelf[0].shelf) ? row.packing_lists.package_shelf[0].shelf.partition_table : ''}
                    &nbsp;
                    {intl.formatMessage({ id: 'shelf' })}: {(row.packing_lists.package_shelf && row.packing_lists.package_shelf.length > 0 && row.packing_lists.package_shelf[0].shelf) ? row.packing_lists.package_shelf[0].shelf.number_of_shelves : ''}
                    <br />
                    {intl.formatMessage({ id: 'layer' })}: {(row.packing_lists.package_shelf && row.packing_lists.package_shelf.length > 0) ? row.packing_lists.package_shelf[0].layer : ''}
                    &nbsp;
                    {intl.formatMessage({ id: 'column' })}: {(row.packing_lists.package_shelf && row.packing_lists.package_shelf.length > 0) ? row.packing_lists.package_shelf[0].column : ''}
                  </>
                ) : '--'
              }
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
              <div className="">
                {getDateFormat(
                  exitPlan.delivered_time ? exitPlan.delivered_time : ""
                )}
                ,{" "}
                {getHourFormat(
                  exitPlan.delivered_time ? exitPlan.delivered_time : ""
                )}
              </div>
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
      {showAddDialog && (
        <AddExitPlanDialog
          close={closeAddDialog}
          confirm={addNewData}
          title={intl.formatMessage({ id: "add_exit_plan_boxes" })}
        />
      )}
    </>
  );
};

export default ExitPlanBox;
