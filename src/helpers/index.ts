import { toast } from "react-toastify";
import { MessageOpts, TypeOptions, BatchStoragePlans } from "../types";
import { getCookie } from "./cookieUtils";
import { AxiosRequestConfig } from "axios";
import { parse } from "cookie";
import { StoragePlan, PackingList } from "../types/storage_plan";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { IntlShape } from "react-intl";
import { getDateFormat, getHourFormat, getLanguage } from "./utils";
import { Selection } from "@nextui-org/react";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { ExitPlan } from "@/types/exit_planerege1992";
import { PackageShelf } from "@/types/package_shelferege1992";

const baseMessageOpts: Pick<
  MessageOpts,
  | "type"
  | "position"
  | "autoClose"
  | "hideProgressBar"
  | "closeOnClick"
  | "pauseOnHover"
  | "draggable"
  | "theme"
> = {
  type: "success",
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const typesOfNotifications: {
  error: string;
  success: string;
  info: string;
  warning: string;
  default: string;
  [key: string]: string;
} = {
  error: "error",
  success: "success",
  info: "info",
  warning: "warning",
  default: "default",
};

export const showMsg = (message: string, options: MessageOpts = {}) => {
  const msgOpts: MessageOpts = {
    ...baseMessageOpts,
    ...options,
    type:
      (options.type &&
        typesOfNotifications[options.type] &&
        (typesOfNotifications[options.type] as TypeOptions)) ||
      "success",
  };

  toast(message, msgOpts);
};

export const isWMS = (context?: any): boolean => {
  if (context) {
    const pathname = context.req.url;
    return pathname.includes("/wms");
  } else if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    return pathname.includes("/wms");
  }
  return false;
};

export const isOMS = (context?: any): boolean => {
  if (context) {
    const pathname = context.req.url;
    return pathname.includes("/oms");
  } else if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    return pathname.includes("/oms");
  }
  return false;
};

export const getHeaders = (context?: any, isFile = false) => {
  let configs: AxiosRequestConfig = {
    headers: {
      "Content-Type": isFile ? "multipart/form-data" : "application/json",
    },
  };
  let tokenWMS = getCookie("tokenWMS");
  let tokenOMS = getCookie("tokenOMS");
  if (context) {
    const { req } = context;
    const cookies = parse(req.headers.cookie || "");
    tokenWMS = cookies.tokenWMS || "";
    tokenOMS = cookies.tokenOMS || "";
  } else if (typeof window !== "undefined") {
    tokenWMS = getCookie("tokenWMS");
    tokenOMS = getCookie("tokenOMS");
  }
  if (isWMS(context) && tokenWMS !== undefined) {
    configs = {
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${tokenWMS}`,
      },
    };
  }
  if (isOMS(context) && tokenOMS !== undefined) {
    configs = {
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${tokenOMS}`,
      },
    };
  }

  return configs;
};

export const getDateFromStr = (date: string | undefined): string => {
  if (date !== undefined && date.length >= 10) {
    return date.substring(0, 10);
  }
  return "";
};

export const getHourFromStr = (date: string | undefined): string => {
  if (date !== undefined && date.length >= 19) {
    return date.substring(11, 19);
  }
  return "";
};

export const downloadTemplateSP = () => {
  const dataToExport: object[] = [
    {
      customer_order_number: '',
      username: '',
      warehouse_code: '',
      reference_number: '',
      pr_number: '',
      box_amount: '',
      delivered_time: '',
      observations: '',
      return: '',
      rejected_boxes: '',
      expansion_box_number: '',
      digits_box_number: ''
    }
  ];

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(
    data,
    `template_to_import_entry_plans` + fileExtension
  );
}

export const storagePlanDataToExcel = (
  storagePlans: StoragePlan[],
  intl: IntlShape,
  selection: Selection = "all"
) => {
  let dataToExport: object[] = [];
  const key1: string = intl.formatMessage({ id: "warehouse_order_number" });
  const key2: string = intl.formatMessage({ id: "customer_order_number" });
  const key3: string = intl.formatMessage({ id: "user" });
  const key4: string = intl.formatMessage({ id: "storage" });
  const key5: string = intl.formatMessage({ id: "number_of_boxes_entered" });
  const key6: string = intl.formatMessage({ id: "number_of_boxes_stored" });
  const key7: string = intl.formatMessage({ id: "evidence" });
  const key8: string = intl.formatMessage({ id: "reference_number" });
  const key9: string = intl.formatMessage({ id: "pr_number" });
  const key10: string = intl.formatMessage({ id: "state" });
  const key11: string = intl.formatMessage({ id: "delivery_time" });
  const key12: string = intl.formatMessage({ id: "observations" });

  storagePlans.forEach((sp: StoragePlan) => {
    const sPlan: { [key: string]: string } = {};
    if (selection === "all" || selection.has("order_number")) {
      sPlan[key1] = sp.order_number ? sp.order_number : "";
    }
    if (selection === "all" || selection.has("customer_order_number")) {
      sPlan[key2] = sp.customer_order_number;
    }
    if (selection === "all" || selection.has("user_id")) {
      sPlan[key3] = sp.user ? sp.user.username : "";
    }
    if (selection === "all" || selection.has("warehouse_id")) {
      sPlan[key4] = sp.warehouse
        ? `${sp.warehouse.name} (${sp.warehouse.code})`
        : "";
    }
    if (selection === "all" || selection.has("box_amount")) {
      sPlan[key5] = sp.box_amount.toString();
    }
    if (selection === "all" || selection.has("number_of_boxes_stored")) {
      sPlan[key6] =
        sp.packing_list && sp.packing_list.length > 0
          ? sp.packing_list
              .filter(
                (pl: PackingList) =>
                  pl.package_shelf && pl.package_shelf.length > 0
              )
              .length.toString()
          : "0";
    }
    if (selection === "all" || selection.has("evidence")) {
      sPlan[key7] = sp.images ? sp.images.length.toString() : "0";
    }
    if (selection === "all" || selection.has("reference_number")) {
      sPlan[key8] = sp.reference_number ? sp.reference_number : "";
    }
    if (selection === "all" || selection.has("pr_number")) {
      sPlan[key9] = sp.pr_number ? sp.pr_number : "";
    }
    if (selection === "all" || selection.has("state")) {
      sPlan[key10] = sp.rejected_boxes
        ? intl.formatMessage({ id: "rejected_boxes" })
        : sp.return
        ? intl.formatMessage({ id: "return" })
        : intl.formatMessage({ id: "normal" });
    }
    if (selection === "all" || selection.has("delivered_time")) {
      sPlan[key11] = `${
        sp.delivered_time ? getDateFormat(sp.delivered_time) : ""
      } ${sp.delivered_time ? getHourFormat(sp.delivered_time) : ""}`;
    }
    if (selection === "all" || selection.has("observations")) {
      sPlan[key12] = sp.observations;
    }

    dataToExport.push(sPlan);
  });

  const date = new Date();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(
    data,
    `${intl.formatMessage({ id: "storage_plans" })}(` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
};

export const inventoryOfExitPlan = (exitPlan: ExitPlan, packingLists: PackingList[], intl: IntlShape) => {
  let dataToExport: object[] = [];

  const key1: string = intl.formatMessage({ id: "box_number" });
  const key2: string = intl.formatMessage({ id: "case_number" });
  const key3: string = `${intl.formatMessage({ id: "client_weight" })} (kg)`;
  const key4: string = `${intl.formatMessage({ id: "client_height" })} (cm)`;
  const key5: string = `${intl.formatMessage({ id: "storage_weight" })} (kg)`;
  const key6: string = `${intl.formatMessage({ id: "storage_height" })} (cm)`;
  const key7: string = intl.formatMessage({ id: "products_per_box" });
  const key8: string = intl.formatMessage({ id: "location" });
  const key9: string = intl.formatMessage({ id: "storage_time" });
  const key10: string = intl.formatMessage({ id: "delivery_time" });

  
  packingLists.forEach((pl: PackingList) => {
    const pList: { [key: string]: string } = {};

    pList[key1] = pl.box_number;
    pList[key2] = pl.case_number;
    pList[key3] = (pl.client_weight || pl.client_weight === 0) ? pl.client_weight.toString() : "--";
    pList[key4] = (pl.client_height || pl.client_height === 0) ? pl.client_height.toString() : "--";
    pList[key5] = "--";
    pList[key6] = "--";
    pList[key7] = (pl.amount || pl.amount === 0) ? pl.amount.toString() : "--";
    pList[key8] =
      pl.package_shelf && pl.package_shelf.length > 0
        ? (exitPlan.warehouse
            ? `${exitPlan.warehouse.code}-${String(
                pl.package_shelf[0].shelf?.partition_table
              ).padStart(2, "0")}-${String(
                pl.package_shelf[0].shelf?.number_of_shelves
              ).padStart(2, "0")}-${String(
                pl.package_shelf[0].layer
              ).padStart(2, "0")}-${String(
                pl.package_shelf[0].column
              ).padStart(2, "0")} `
            : "") +
          `${intl.formatMessage({ id: "partition" })}: ${
            pl.package_shelf &&
            pl.package_shelf.length > 0 &&
            pl.package_shelf[0].shelf
              ? pl.package_shelf[0].shelf.partition_table
              : ""
          } ` +
          `${intl.formatMessage({ id: "shelf" })}: ${
            pl.package_shelf &&
            pl.package_shelf.length > 0 &&
            pl.package_shelf[0].shelf
              ? pl.package_shelf[0].shelf.number_of_shelves
              : ""
          } ` +
          `${intl.formatMessage({ id: "layer" })}: ${
            pl.package_shelf && pl.package_shelf.length > 0
              ? pl.package_shelf[0].layer
              : ""
          }  ` +
          `${intl.formatMessage({ id: "column" })}: ${
            pl.package_shelf && pl.package_shelf.length > 0
              ? pl.package_shelf[0].column
              : ""
          } `
        : "--";
    pList[key9] = "--";
    pList[key10] = exitPlan.delivered_time
      ? `${getDateFormat(exitPlan.delivered_time)}, ${getHourFormat(
        exitPlan.delivered_time
        )}`
      : "--";

    dataToExport.push(pList);
  });

  const date = new Date();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(
    data,
    `exit_plan_inventory_${exitPlan.output_number} (` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
}

export const packingListDataToExcel = (
  storagePlan: StoragePlan,
  packingLists: PackingList[],
  intl: IntlShape,
  type: "ic" | "lg"
) => {
  let dataToExport: object[] = [];

  if (type === "ic") {
    const key1: string = intl.formatMessage({ id: "box_number" });
    const key2: string = intl.formatMessage({ id: "expansion_box_number" });
    const key3: string = intl.formatMessage({ id: "outgoing_order" });
    const key4: string = intl.formatMessage({ id: "transfer_order_number" });
    const key5: string = intl.formatMessage({ id: "bill_lading_number" });
    const key6: string = `${intl.formatMessage({
      id: "client_weight",
    })}(kg) / ${intl.formatMessage({ id: "dimensions" })}(cm)`;
    const key7: string = `${intl.formatMessage({
      id: "storage_weight",
    })}(kg) / ${intl.formatMessage({ id: "dimensions" })}(cm)`;
    const key8: string = intl.formatMessage({ id: "location" });
    const key9: string = intl.formatMessage({ id: "storage_time" });
    const key10: string = intl.formatMessage({ id: "delivery_time" });

    packingLists.forEach((pl: PackingList) => {
      const pList: { [key: string]: string } = {};

      pList[key1] = pl.box_number;
      pList[key2] = pl.case_number;
      pList[key3] = "--";
      pList[key4] = pl.order_transfer_number ? pl.order_transfer_number : "--";
      pList[key5] = storagePlan.pr_number ? storagePlan.pr_number : "--";
      pList[
        key6
      ] = `${pl.client_weight} / ${pl.client_length}*${pl.client_width}*${pl.client_height}`;
      pList[key7] = "--";
      pList[key8] =
        pl.package_shelf && pl.package_shelf.length > 0
          ? (storagePlan.warehouse
              ? `${storagePlan.warehouse.code}-${String(
                  pl.package_shelf[0].shelf?.partition_table
                ).padStart(2, "0")}-${String(
                  pl.package_shelf[0].shelf?.number_of_shelves
                ).padStart(2, "0")}-${String(
                  pl.package_shelf[0].layer
                ).padStart(2, "0")}-${String(
                  pl.package_shelf[0].column
                ).padStart(2, "0")} `
              : "") +
            `${intl.formatMessage({ id: "partition" })}: ${
              pl.package_shelf &&
              pl.package_shelf.length > 0 &&
              pl.package_shelf[0].shelf
                ? pl.package_shelf[0].shelf.partition_table
                : ""
            } ` +
            `${intl.formatMessage({ id: "shelf" })}: ${
              pl.package_shelf &&
              pl.package_shelf.length > 0 &&
              pl.package_shelf[0].shelf
                ? pl.package_shelf[0].shelf.number_of_shelves
                : ""
            } ` +
            `${intl.formatMessage({ id: "layer" })}: ${
              pl.package_shelf && pl.package_shelf.length > 0
                ? pl.package_shelf[0].layer
                : ""
            }  ` +
            `${intl.formatMessage({ id: "column" })}: ${
              pl.package_shelf && pl.package_shelf.length > 0
                ? pl.package_shelf[0].column
                : ""
            } `
          : "--";
      pList[key9] = "--";
      pList[key10] = storagePlan.delivered_time
        ? `${getDateFormat(storagePlan.delivered_time)}, ${getHourFormat(
            storagePlan.delivered_time
          )}`
        : "--";

      dataToExport.push(pList);
    });
  } else {
    const key1: string = intl.formatMessage({ id: "box_number" });
    const key2: string = intl.formatMessage({ id: "expansion_box_number" });
    const key3: string = intl.formatMessage({ id: "transfer_order_number" });
    const key4: string = intl.formatMessage({ id: "amount" });
    const key5: string = intl.formatMessage({ id: "client_weight" });
    const key6: string = intl.formatMessage({ id: "client_length" });
    const key7: string = intl.formatMessage({ id: "client_width" });
    const key8: string = intl.formatMessage({ id: "client_height" });
    const key9: string = intl.formatMessage({ id: "product_name" });
    const key10: string = intl.formatMessage({ id: "english_product_name" });
    const key11: string = intl.formatMessage({ id: "price" });
    const key12: string = intl.formatMessage({ id: "material" });
    const key13: string = intl.formatMessage({ id: "customs_code" });
    const key14: string = intl.formatMessage({ id: "fnscu" });

    packingLists.forEach((pl: PackingList) => {
      const pList: { [key: string]: string } = {};

      pList[key1] = pl.box_number ? pl.box_number : "--";
      pList[key2] = pl.case_number ? pl.case_number : "--";
      pList[key3] = pl.order_transfer_number ? pl.order_transfer_number : "--";
      pList[key4] = (pl.amount || pl.amount === 0) ? pl.amount.toString() : "--";
      pList[key5] = (pl.client_weight || pl.client_weight === 0) ? pl.client_weight.toString() : "--";
      pList[key6] = (pl.client_length || pl.client_length === 0) ? pl.client_length.toString() : "--";
      pList[key7] = (pl.client_width || pl.client_width === 0) ? pl.client_width.toString() : "--";
      pList[key8] = (pl.client_height || pl.client_height === 0) ? pl.client_height.toString() : "--";
      pList[key9] = pl.product_name ? pl.product_name : "--";
      pList[key10] = pl.english_product_name ? pl.english_product_name : "--";
      pList[key11] = (pl.price || pl.price === 0) ? pl.price.toString() : "--";
      pList[key12] = pl.material ? pl.material : "--";
      pList[key13] = pl.customs_code ? pl.customs_code : "--";
      pList[key14] = pl.fnscu ? pl.fnscu : "--";

      dataToExport.push(pList);
    });
  }

  const date = new Date();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(
    data,
    `storage_plan_inventory (` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
};

export const operationInstructionDataToExcel = (
  operationInstructions: OperationInstruction[],
  intl: IntlShape,
  visibleColumn: string[]
) => {
  let dataToExport: object[] = [];
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

  const getLocation = (ep: OperationInstruction): string => {
    let locations = "";
    ep.output_plan &&
      ep.output_plan.packing_lists &&
      ep.output_plan.packing_lists.forEach((pl) => {
        locations += packageShelfFormat(pl.package_shelf);
      });
    return locations;
  };

  const getType = (data: any[]): string[] => {
    const result: string[] = [];
    data.forEach((el) => {
      result.push(el[getLanguage(intl)]);
    });
    return result;
  };
  
  operationInstructions.forEach((oi: OperationInstruction) => {
    const oInst: { [key: string]: string } = {};
    visibleColumn.forEach((column) => {
      switch (column) {
        case "warehouse_id":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = oi.warehouse?.name;
        case "user_id":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = oi.user?.username;
          break;
        case "output_plan_id":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] =
            oi.output_plan?.output_number;
          break;
        case "operation_instruction_type":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = getType(
            // @ts-ignore
            oi.operation_instruction_type.instruction_type
          ).join(", ");
          break;
        case "location":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = getLocation(oi);
          break;
        case "updated_at":
        case "created_at":
          {
            // @ts-ignore
            if (oi[column] && oi[column] !== "") {
              return (oInst[
                intl.formatMessage({ id: column })
                // @ts-ignore
              ] = `${getDateFormat(oi[column])}, ${getHourFormat(oi[column])}`);
            } else {
              return "";
            }
          }
          break;
        default: {
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = oi[column];
        }
      }
    });
    dataToExport.push(oInst);
  });
  const date = new Date();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(
    data,
    `${intl.formatMessage({ id: "operation_instruction" })}(` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
};

export const exitPlanDataToExcel = (
  exiPlan: ExitPlan[],
  intl: IntlShape,
  visibleColumn: string[]
) => {
  let dataToExport: object[] = [];
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
${intl.formatMessage({ id: "column" })}: ${packageShelf.column} 
\n`;
    }
    return "";
  };
  const getLocation = (ep: ExitPlan): string => {
    let locations = "";
    ep.packing_lists?.forEach((pl) => {
      locations += packageShelfFormat(pl.package_shelf);
    });
    return locations;
  };
  exiPlan.forEach((oi: ExitPlan) => {
    const oInst: { [key: string]: string } = {};
    visibleColumn.forEach((column) => {
      switch (column) {
        case "warehouse":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = oi.warehouse?.name;
        case "user":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = oi.user?.username;
          break;
        case "destination":
          if (oi.destination_ref) {
            // @ts-ignore
            oInst[intl.formatMessage({ id: column })] =
              oi.destination_ref[getLanguage(intl)];
          } else {
            oInst[intl.formatMessage({ id: column })] = oi.destination
              ? oi.destination
              : "";
          }
          break;
        case "address":
          if (oi.address_ref) {
            // @ts-ignore
            oInst[intl.formatMessage({ id: column })] =
              oi.address_ref[getLanguage(intl)];
          } else {
            oInst[intl.formatMessage({ id: column })] = oi.address
              ? oi.address
              : "";
          }
          break;
        case "location":
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = getLocation(oi);
        case "updated_at":
        case "created_at":
        case "delivered_time":
          {
            // @ts-ignore
            if (oi[column] && oi[column] !== "") {
              return (oInst[
                intl.formatMessage({ id: column })
                // @ts-ignore
              ] = `${getDateFormat(oi[column])}, ${getHourFormat(oi[column])}`);
            } else {
              return "";
            }
          }
          break;
        default: {
          // @ts-ignore
          oInst[intl.formatMessage({ id: column })] = oi[column];
        }
      }
    });
    dataToExport.push(oInst);
  });
  const date = new Date();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(
    data,
    `${intl.formatMessage({ id: "exitPlan" })}(` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
};
