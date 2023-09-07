import axios from 'axios';
import { countStoragePlanPath, storagePlanPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Response } from '../types/index';
import { StoragePlan } from '../types/storage_plan';

export const countStoragePlan = async ():Promise<{count: number}> => {
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

export const removeStoragePlanById = async (storagePlanId: number):Promise<any | null> => {
  const path = storagePlanPath() + `/${storagePlanId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getStoragePlans = async (status: number = 0, context?: GetServerSidePropsContext):Promise<StoragePlan[] | null> => {
  const path = storagePlanPath(status);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}