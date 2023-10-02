import axios from 'axios';
import {
    countWhPath, whPath
   } from '../backend';
import { Response } from '../types/index';
import { Warehouse } from '../types/warehouse';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

export const createWh = async (values: Warehouse): Promise<Response> => {
  const path = whPath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0,  data: error.response.data };
  }
};

export const getWhById = async (warehouseId: number, context?: GetServerSidePropsContext):Promise<Warehouse | null> => {
  const path = whPath() + `/${warehouseId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const updateWhById = async (warehouseId: number, warehouse: Warehouse):Promise<Response> => {
  const path = whPath() + `/${warehouseId}`;
  try {
    const response = await axios.put(path, warehouse, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0, data: error.response.data };
  }
}

export const removeWhById = async (warehouseId: number):Promise<Response> => {
  const path = whPath() + `/${warehouseId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getWhs = async (context?: GetServerSidePropsContext):Promise<Warehouse[] | null> => {
  const path = whPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const countWhs = async():Promise<{count: number}> => {
  const path = countWhPath();
  const response = await axios.get(path)
  return response.data
}