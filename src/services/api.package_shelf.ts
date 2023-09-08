import axios from 'axios';
import { PackageShelf } from '../types/package_shelf';
import { Response } from '../types';
import { packageShelfPath } from '../backend';
import { getHeaders } from '../helpers';

export const createPackageShelf = async (values: PackageShelf): Promise<Response> => {
    const path = packageShelfPath();
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

export const updatePackageShelfById = async (packageShelfId: number, values: PackageShelf): Promise<Response> => {
    const path = packageShelfPath() + `/${packageShelfId}`;
    try {
      const response = await axios.put(path, values, getHeaders());
      
      if (response.status && (response.status >= 200 && response.status <= 299)) {
        return {data: response.data, status: response.status};
      }
      return { status: response.status ? response.status : 0 };
    } catch (error: any) {
      return { status: error.response && error.response.status ? error.response.status : 0 };
    }
};