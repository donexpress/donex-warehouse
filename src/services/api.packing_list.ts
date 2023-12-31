import axios from 'axios';
import { countPackingListPath, packingListPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Response } from '../types/index';
import { PackingList, BulkPLRequest } from '../types/storage_plan';

export const countPackingList = async ():Promise<{count: number}> => {
    const response = await axios.get(countPackingListPath())
    return response.data
}

export const createPackingList = async (values: PackingList): Promise<Response> => {
  const path = packingListPath();
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

export const bulkPackingList = async (values: BulkPLRequest): Promise<Response> => {
  const path = `${packingListPath()}/bulk_create`;
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

export const updatePackingListById = async (packingListId: number, packingList: PackingList):Promise<Response> => {
  const path = packingListPath() + `/${packingListId}`;
  try {
    const response = await axios.put(path, packingList, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getPackingListById = async (packingListId: number, context?: GetServerSidePropsContext):Promise<PackingList | null> => {
  const path = packingListPath() + `/${packingListId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const removePackingListById = async (packingListId: number):Promise<Response> => {
  const path = packingListPath() + `/${packingListId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getPackingLists = async (context?: GetServerSidePropsContext):Promise<PackingList[] | null> => {
  const path = packingListPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getPackingListsByCaseNumber = async (case_nummber :string, context?: GetServerSidePropsContext):Promise<PackingList | null> => {
  const path = packingListPath();
  try {
    const response = await axios.get(`${path}/by_case_number?case_number=${case_nummber}`, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getPackingListsByBoxNumber = async (box_nummber :string, context?: GetServerSidePropsContext):Promise<PackingList | null> => {
  const path = packingListPath();
  try {
    const response = await axios.get(`${path}/by_box_number?box_number=${box_nummber}`, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}