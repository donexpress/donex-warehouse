import { toast } from 'react-toastify';
import { MessageOpts, TypeOptions } from '../types';
import { getCookie } from './cookieUtils';
import { AxiosRequestConfig, RawAxiosRequestHeaders, AxiosHeaders } from 'axios';

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

export const getHeaders = (context?: any) => {
  let configs: AxiosRequestConfig = {
    headers: {
    'Content-Type': 'application/json',
  }};
  const tokenWMS = getCookie('tokenWMS');
  const tokenOMS = getCookie('tokenOMS');
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