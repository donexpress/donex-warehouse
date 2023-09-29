import React, { useState, ChangeEvent } from "react";
import {
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { PDFDownloadLink } from "@react-pdf/renderer";
import "../../../styles/wms/exit.plan.config.scss";
import { PackageShelf } from "@/types/package_shelferege1992";
import { ExitPlan } from "@/types/exit_planerege1992";
import { PackingList, StoragePlan } from "@/types/storage_planerege1992";
import { getPackingListsByCaseNumber } from "@/services/api.packing_listerege1992";
import { showMsg } from "@/helperserege1992";
import { getStoragePlanByOrder_number } from "@/services/api.storage_planerege1992";
import {
  getExitPlansById,
  updateExitPlan,
} from "@/services/api.exit_planerege1992";
import InventoryList from "../wms/exitPlan/InventoryList";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import AddExitPlanDialog from "../wms/exitPlan/AddExitPlanDialog";
import { getDateFormat, getHourFormat } from "@/helpers/utilserege1992";

interface Props {
  exitPlan: ExitPlan;
  isDetail?: boolean;
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

const LocationTable = ({ exitPlan, isDetail }: Props) => {
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


  const packageShelfFormat = (packageShelfs: PackageShelf[] | undefined) => {
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
    <>
      <div style={{ paddingTop: "20px" }}>
        <div
          className="storage-plan-data__header-pl"
          style={{ paddingRight: "16px" }}
        >
          <div className="elements-row-start show-sp-desktop"></div>
        </div>
      </div>
      <div style={{ paddingTop: "10px" }} className="info-packing-list">
        <div>
          <div
            className="info-packing-list__table_display bg-default-100"
            style={{
              padding: "5px 0px 5px 5px",
              borderRadius: "5px 5px 5px 5px",
            }}
          >
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
                {intl.formatMessage({ id: "warehouse" })}
              </span>
            </div>
            <div className="elements-center">
              <span className="text-center">
                {intl.formatMessage({ id: "location" })}
              </span>
            </div>
          </div>
          {rows.map((row, index) => (
            <div
              key={index}
              className="info-packing-list__table_display storage-plan-header"
              style={{ padding: "8px 0px 8px 5px" }}
            >
              <div className="elements-center">
                {row.packing_lists?.case_number}
              </div>
              <div className="elements-center">
                {row.packing_lists?.client_weight}
              </div>
              <div className="elements-center">
                {row.packing_lists?.client_height}
              </div>
              <div className="elements-center">{row.packing_lists?.amount}</div>
              <div className="elements-center">
                {getDateFormat(
                  exitPlan.delivered_time ? exitPlan.delivered_time : ""
                )}
                ,{" "}
                {getHourFormat(
                  exitPlan.delivered_time ? exitPlan.delivered_time : ""
                )}
              </div>
              <div className="elements-center">
                {getDateFormat(
                  exitPlan.delivered_time ? exitPlan.delivered_time : ""
                )}
                ,{" "}
                {getHourFormat(
                  exitPlan.delivered_time ? exitPlan.delivered_time : ""
                )}
              </div>
              <div className="elements-center">{exitPlan.warehouse?.name}</div>
              <div className="elements-center">
                {packageShelfFormat(row.packing_lists.package_shelf)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationTable;
