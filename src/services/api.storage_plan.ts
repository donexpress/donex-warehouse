import axios from 'axios';
import { countStoragePlanPath, barCodePath, storagePlanByOrderNumberPath, storagePlanPath, storagePlanStatePath, storagePlanCountPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Response, BatchStoragePlans } from '../types/index';
import { StoragePlan, StoragePlanState, StoragePlanCount, BarCode } from '../types/storage_plan';
import { StateCount } from '@/types/exit_planerege1992';

export const countStoragePlan = async ():Promise<StateCount> => {
    const response = await axios.get(countStoragePlanPath())
    return response.data
}

export const createStoragePlan = async (values: StoragePlan): Promise<Response> => {
  const path = storagePlanPath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const createBatchStoragePlan = async (values: BatchStoragePlans[]): Promise<Response> => {
  const path = storagePlanPath() + '/multi';
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const updateStoragePlanById = async (storagePlanId: number, storagePlan: StoragePlan):Promise<Response> => {
  const path = storagePlanPath() + `/${storagePlanId}`;
  try {
    const response = await axios.put(path, storagePlan, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getStoragePlanById = async (storagePlanId: number, context?: GetServerSidePropsContext):Promise<StoragePlan | null> => {
  const path = storagePlanPath() + `/${storagePlanId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getStoragePlanByIdNoDependencies = async (storagePlanId: number, context?: GetServerSidePropsContext):Promise<StoragePlan | null> => {
  const path = storagePlanPath() + `/${storagePlanId}/no_dependencies`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const storagePlanCount = async (query: string = "", context?: GetServerSidePropsContext):Promise<StoragePlanCount | null> => {
  const path = storagePlanCountPath(query);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const removeStoragePlanById = async (storagePlanId: number):Promise<Response> => {
  const path = storagePlanPath() + `/${storagePlanId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getStoragePlans = async (status: string = '', page: number | undefined = undefined, rowsPerPage: number | undefined = undefined, query: string | undefined = undefined, context?: GetServerSidePropsContext):Promise<StoragePlan[] | null> => {
  const path = storagePlanPath(status, page, rowsPerPage, query);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getStoragePlanByOrder_number = async(order_number: string, context?: GetServerSidePropsContext): Promise<StoragePlan[] | null> => {
  const path = storagePlanByOrderNumberPath(order_number);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getStoragePlansState = async (context?: GetServerSidePropsContext):Promise<{ states: StoragePlanState[] } | null> => {
  const path = storagePlanStatePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

/* export const barCodePdf = async (code: BarCode[]): Promise<Response> => {
  const path = barCodePath();
  try {
    const response = await axios.post(path, { code }, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}; */

export const barCodePdf = async (code: BarCode[]): Promise<Response> => {
  const path = barCodePath();
  const headers = getHeaders(null, undefined, 'application/pdf');
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: headers.headers as any,
      body: JSON.stringify({code}),
    });

    const blob = await response.blob();
    
    if (response.ok && response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: blob, status: response.status };
    }
    return { status: response && response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};