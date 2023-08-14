import axios from 'axios';
import { 
    getStateWarehousePath, warehousePath
   } from '../backend';
import { StateWarehouse, CargoStationWarehouseForm, CargoStationWarehouseResponse } from '../types/index';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

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