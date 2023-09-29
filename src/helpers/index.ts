import { toast } from 'react-toastify';
import { MessageOpts, TypeOptions } from '../types';
import { getCookie } from './cookieUtils';
import { AxiosRequestConfig } from 'axios';
import { parse } from 'cookie';
import { StoragePlan, PackingList } from '../types/storage_plan';
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { IntlShape } from 'react-intl';
import { getDateFormat, getHourFormat } from './utils';
import { Selection } from "@nextui-org/react";

const baseMessageOpts: Pick<MessageOpts, 'type' | 'position' | 'autoClose' | 'hideProgressBar' | 'closeOnClick' | 'pauseOnHover' | 'draggable' | 'theme'> = {
  type: 'success',
  position: 'top-right',
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
      (options.type && typesOfNotifications[options.type] && typesOfNotifications[options.type] as TypeOptions) ||
      'success',
  }

  toast(message, msgOpts);
}

export const isWMS = (context?: any): boolean => {
  if (context) {
    const pathname = context.req.url;
    return pathname.includes('/wms');
  } else if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    return pathname.includes('/wms');
  }
  return false;
};

export const isOMS = (context?: any): boolean => {
  if (context) {
    const pathname = context.req.url;
    return pathname.includes('/oms');
  } else if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    return pathname.includes('/oms');
  }
  return false;
};

export const getHeaders = (context?: any, isFile = false) => {
  let configs: AxiosRequestConfig = {
    headers: {
    'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
  }};
  let tokenWMS = getCookie('tokenWMS');
  let tokenOMS = getCookie('tokenOMS');
  if (context) {
    const { req } = context;
    const cookies = parse(req.headers.cookie || '');
    tokenWMS = cookies.tokenWMS || '';;
    tokenOMS = cookies.tokenOMS || '';;
  } else if (typeof window !== 'undefined') {
    tokenWMS = getCookie('tokenWMS');
    tokenOMS = getCookie('tokenOMS');
  }
  if (isWMS(context) && (tokenWMS !== undefined)) {
    configs = {
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${tokenWMS}`,
      }
    }
  }
  if (isOMS(context) && (tokenOMS !== undefined)) {
    configs = {
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${tokenOMS}`,
      }
    }
  }

  return configs;
}

export const getDateFromStr = (date: string | undefined): string => {
  if (date !== undefined && (date.length >= 10)) {
      return date.substring(0, 10);
  }
  return '';
}

export const getHourFromStr = (date: string | undefined): string => {
  if (date !== undefined && (date.length >= 19)) {
      return date.substring(11, 19);
  }
  return '';
}

export const storagePlanDataToExcel = (storagePlans: StoragePlan[], intl: IntlShape, selection: Selection = "all") => {
  let dataToExport: object[] = [];
  const key1: string = intl.formatMessage({ id: 'warehouse_order_number' });
  const key2: string = intl.formatMessage({ id: 'customer_order_number' });
  const key3: string = intl.formatMessage({ id: 'user' });
  const key4: string = intl.formatMessage({ id: 'storage' });
  const key5: string = intl.formatMessage({ id: 'number_of_boxes_entered' });
  const key6: string = intl.formatMessage({ id: 'number_of_boxes_stored' });
  const key7: string = intl.formatMessage({ id: 'evidence' });
  const key8: string = intl.formatMessage({ id: 'reference_number' });
  const key9: string = intl.formatMessage({ id: 'pr_number' });
  const key10: string = intl.formatMessage({ id: 'state' });
  const key11: string = intl.formatMessage({ id: 'delivery_time' });
  const key12: string = intl.formatMessage({ id: 'observations' });

  storagePlans.forEach((sp: StoragePlan) => {
    const sPlan: { [key: string]: string } = {};
    if (selection === "all" || selection.has("order_number")) {
      sPlan[key1] = sp.order_number ? sp.order_number : '';
    }
    if (selection === "all" || selection.has("customer_order_number")) {
      sPlan[key2] = sp.customer_order_number;
    }
    if (selection === "all" || selection.has("user_id")) {
      sPlan[key3] = sp.user ? sp.user.username : '';
    }
    if (selection === "all" || selection.has("warehouse_id")) {
      sPlan[key4] = sp.warehouse ? (`${sp.warehouse.name} (${sp.warehouse.code})`) : '';
    }
    if (selection === "all" || selection.has("box_amount")) {
      sPlan[key5] = sp.box_amount.toString();
    }
    if (selection === "all" || selection.has("number_of_boxes_stored")) {
      sPlan[key6] = sp.packing_list && sp.packing_list.length > 0 ? (sp.packing_list.filter((pl: PackingList) => pl.package_shelf && pl.package_shelf.length > 0).length.toString()) : '0';
    }
    if (selection === "all" || selection.has("evidence")) {
      sPlan[key7] = sp.images ? (sp.images.length.toString()) : '0';
    }
    if (selection === "all" || selection.has("reference_number")) {
      sPlan[key8] = sp.reference_number ? sp.reference_number: '';
    }
    if (selection === "all" || selection.has("pr_number")) {
      sPlan[key9] = sp.pr_number ? sp.pr_number: '';
    }
    if (selection === "all" || selection.has("state")) {
      sPlan[key10] = sp.rejected_boxes ? intl.formatMessage({ id: "rejected_boxes" }) : (sp.return ? intl.formatMessage({ id: "return" }) : intl.formatMessage({ id: "normal" }));
    }
    if (selection === "all" || selection.has("delivered_time")) {
      sPlan[key11] = `${sp.delivered_time ? getDateFormat(sp.delivered_time) : ''} ${sp.delivered_time ? getHourFormat(sp.delivered_time) : ''}`;
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
    `${intl.formatMessage({id: 'storage_plans'})}(` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
}

export const packingListDataToExcel = (storagePlan: StoragePlan, packingLists: PackingList[], intl: IntlShape, type: 'ic'| 'lg') => {
  let dataToExport: object[] = [];
  
  if (type === 'ic') {
    const key1: string = intl.formatMessage({ id: 'box_number' });
    const key2: string = intl.formatMessage({ id: 'expansion_box_number' });
    const key3: string = intl.formatMessage({ id: 'outgoing_order' });
    const key4: string = intl.formatMessage({ id: 'transfer_order_number' });
    const key5: string = intl.formatMessage({ id: 'bill_lading_number' });
    const key6: string = `${intl.formatMessage({ id: 'client_weight' })}(kg) / ${intl.formatMessage({ id: 'dimensions' })}(cm)`;
    const key7: string = `${intl.formatMessage({ id: 'storage_weight' })}(kg) / ${intl.formatMessage({ id: 'dimensions' })}(cm)`;
    const key8: string = intl.formatMessage({ id: 'location' });
    const key9: string = intl.formatMessage({ id: 'storage_time' });
    const key10: string = intl.formatMessage({ id: 'delivery_time' });

    packingLists.forEach((pl: PackingList) => {
      const pList: { [key: string]: string } = {};

      pList[key1] = pl.box_number;
      pList[key2] = pl.case_number;
      pList[key3] = '--';
      pList[key4] = pl.order_transfer_number ? pl.order_transfer_number : '--';
      pList[key5] = storagePlan.pr_number ? storagePlan.pr_number : '--';
      pList[key6] = `${pl.client_weight} / ${pl.client_length}*${pl.client_width}*${pl.client_height}`;
      pList[key7] = '--';
      pList[key8] = (pl.package_shelf && pl.package_shelf.length > 0) ? (
          (storagePlan.warehouse ? (
            `${storagePlan.warehouse.code}-${String(pl.package_shelf[0].shelf?.partition_table).padStart(2, '0')}-${String(pl.package_shelf[0].shelf?.number_of_shelves).padStart(2, '0')}-${String(pl.package_shelf[0].layer).padStart(2, '0')}-${String(pl.package_shelf[0].column).padStart(2, '0')} `
          ) : '') +
          `${intl.formatMessage({ id: 'partition' })}: ${(pl.package_shelf && pl.package_shelf.length > 0 && pl.package_shelf[0].shelf) ? pl.package_shelf[0].shelf.partition_table : ''} ` +
          `${intl.formatMessage({ id: 'shelf' })}: ${(pl.package_shelf && pl.package_shelf.length > 0 && pl.package_shelf[0].shelf) ? pl.package_shelf[0].shelf.number_of_shelves : ''} ` +
          `${intl.formatMessage({ id: 'layer' })}: ${(pl.package_shelf && pl.package_shelf.length > 0) ? pl.package_shelf[0].layer : ''}  ` +
          `${intl.formatMessage({ id: 'column' })}: ${(pl.package_shelf && pl.package_shelf.length > 0) ? pl.package_shelf[0].column : ''} `
      ) : '--';
      pList[key9] = '--';
      pList[key10] = storagePlan.delivered_time ? `${getDateFormat(storagePlan.delivered_time)}, ${getHourFormat(storagePlan.delivered_time)}` : '--';

      dataToExport.push(pList);
    });
  } else {
    const key1: string = intl.formatMessage({ id: 'box_number' });
    const key2: string = intl.formatMessage({ id: 'expansion_box_number' });
    const key3: string = intl.formatMessage({ id: 'transfer_order_number' });
    const key4: string = intl.formatMessage({ id: 'amount' });
    const key5: string = intl.formatMessage({ id: 'client_weight' });
    const key6: string = intl.formatMessage({ id: 'client_length' });
    const key7: string = intl.formatMessage({ id: 'client_width' });
    const key8: string = intl.formatMessage({ id: 'client_height' });
    const key9: string = intl.formatMessage({ id: 'product_name' });
    const key10: string = intl.formatMessage({ id: 'english_product_name' });
    const key11: string = intl.formatMessage({ id: 'price' });
    const key12: string = intl.formatMessage({ id: 'material' });
    const key13: string = intl.formatMessage({ id: 'customs_code' });
    const key14: string = intl.formatMessage({ id: 'fnscu' });

    packingLists.forEach((pl: PackingList) => {
      const pList: { [key: string]: string } = {};

      pList[key1] = pl.box_number;
      pList[key2] = pl.case_number;
      pList[key3] = pl.order_transfer_number ? pl.order_transfer_number : '--';
      pList[key4] = pl.amount.toString();
      pList[key5] = pl.client_weight.toString();
      pList[key6] = pl.client_length.toString();
      pList[key7] = pl.client_width.toString();
      pList[key8] = pl.client_height.toString();
      pList[key9] = pl.product_name;
      pList[key10] = pl.english_product_name;
      pList[key11] = pl.price.toString();
      pList[key12] = pl.material;
      pList[key13] = pl.customs_code;
      pList[key14] = pl.fnscu;

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
    `${intl.formatMessage({id: 'storage_plan_inventory'})}(` +
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      ")" +
      fileExtension
  );
}