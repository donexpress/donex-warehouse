import axios from 'axios';
import {
    countWarehousePath,
    getStateWarehousePath, warehousePath
   } from '../backend';
import { StateWarehouse, StateDefault, CargoStationWarehouseForm, Response } from '../types/index';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

export const indexStateWarehouse = async (context?: GetServerSidePropsContext): Promise<StateDefault | null> => {
  const path = getStateWarehousePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createCargoTerminal = async (values: CargoStationWarehouseForm): Promise<Response> => {
  const path = warehousePath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0, data: error.response.data };
  }
};

export const getWarehouseById = async (warehouseId: number, context?: GetServerSidePropsContext):Promise<CargoStationWarehouseForm | null> => {
  const path = warehousePath() + `/${warehouseId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const updateWarehouseById = async (warehouseId: number, warehouse: CargoStationWarehouseForm):Promise<Response> => {
  const path = warehousePath() + `/${warehouseId}`;
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

export const removeWarehouseById = async (warehouseId: number):Promise<Response> => {
  const path = warehousePath() + `/${warehouseId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getWarehouses = async (context?: GetServerSidePropsContext):Promise<CargoStationWarehouseForm[] | null> => {
  const path = warehousePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const countWarehouse = async():Promise<{count: number}> => {
  const response = await axios.get(countWarehousePath())
  return response.data
}
