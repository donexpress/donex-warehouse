import axios from 'axios';
import { shelfPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Response } from '../types/index';
import { Shelf } from '../types/shelf';

export const createShelf = async (values: Shelf): Promise<Response> => {
  const path = shelfPath();
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

export const updateShelfById = async (shelfId: number, shelf: Shelf):Promise<Response> => {
  const path = shelfPath() + `/${shelfId}`;
  try {
    const response = await axios.put(path, shelf, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getShelfById = async (shelfId: number, context?: GetServerSidePropsContext):Promise<Shelf | null> => {
  const path = shelfPath() + `/${shelfId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const removeShelfById = async (shelfId: number):Promise<Response> => {
  const path = shelfPath() + `/${shelfId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getShelves = async (context?: GetServerSidePropsContext):Promise<Shelf[] | null> => {
  const path = shelfPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}