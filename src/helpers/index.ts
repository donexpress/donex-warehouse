import { toast } from 'react-toastify';
import { MessageOpts, TypeOptions } from '../types';
import { getCookie } from './cookieUtils';
import { AxiosRequestConfig } from 'axios';
import { parse } from 'cookie';
import { StoragePlan } from '../types/storage_plan';
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { IntlShape } from 'react-intl';
import { getDateFormat, getHourFormat } from './utils';

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

export const storagePlanDataToExcel = (storagePlans: StoragePlan[], intl: IntlShape) => {
  let dataToExport: object[] = [];
  const key1: string = intl.formatMessage({ id: 'warehouse_order_number' });
  const key2: string = intl.formatMessage({ id: 'customer_order_number' });
  const key3: string = intl.formatMessage({ id: 'user' });
  const key4: string = intl.formatMessage({ id: 'storage' });
  const key5: string = intl.formatMessage({ id: 'number_of_boxes' });
  const key6: string = intl.formatMessage({ id: 'delivery_time' });
  const key7: string = intl.formatMessage({ id: 'observations' });

  storagePlans.forEach((sp: StoragePlan) => {
    const sPlan: { [key: string]: string } = {};
    sPlan[key1] = sp.order_number ? sp.order_number : '';
    sPlan[key2] = sp.customer_order_number;
    sPlan[key3] = sp.user ? sp.user.username : '';
    sPlan[key4] = sp.warehouse ? (`${sp.warehouse.name} (${sp.warehouse.code})`) : '';
    sPlan[key5] = sp.box_amount.toString();
    sPlan[key6] = `${sp.delivered_time ? getDateFormat(sp.delivered_time) : ''} ${sp.delivered_time ? getHourFormat(sp.delivered_time) : ''}`;
    sPlan[key7] = sp.observations;
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