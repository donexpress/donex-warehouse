import axios from 'axios';
import { 
  WarehousePath,
    countWarehousePath,
    getStateWarehousePath, warehousePath
   } from '../backend';
import { StateWarehouse, CargoStationWarehouseForm, CargoStationWarehouseResponse } from '../types/index';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';
import { Warehouse } from '@/types/warehouseerege1992';

export const indexStateWarehouse = async (context?: GetServerSidePropsContext): Promise<StateWarehouse[] | null> => {
  const path = getStateWarehousePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createCargoTerminal = async (values: CargoStationWarehouseForm): Promise<CargoStationWarehouseResponse> => {
  const path = warehousePath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...{warehouse: response.data}, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const getWarehouses = async ():Promise<Warehouse[]> => {
  const response = await axios.get(WarehousePath())
  return response.data
}

export const countWarehouse = async():Promise<{count: number}> => {
  const response = await axios.get(countWarehousePath())
  return response.data
}
