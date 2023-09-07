import axios from 'axios';
import {
    filePath
   } from '../backend';
import { Response } from '../types/index';
import { getHeaders } from '../helpers';

export const uploadFile = async (formData: FormData): Promise<Response> => {
  const path = filePath();
  try {
    const response = await axios.post(path, formData, getHeaders(null, true));
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};