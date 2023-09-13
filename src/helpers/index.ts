import { toast } from 'react-toastify';
import { MessageOpts, TypeOptions } from '../types';
import { getCookie } from './cookieUtils';
import { AxiosRequestConfig } from 'axios';
import { parse } from 'cookie';

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