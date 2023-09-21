import axios from "axios";
import {countLinePath, removeLinePath, linePath} from "../backend";
import { Line } from "@/types/lineerege1992";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { Response } from '../types/index';
import {StoragePlan} from "../types/storage_plan";

export const getLine = async(context?: GetServerSidePropsContext): Promise<Line[]> => {
  const response = await axios.get(linePath(), getHeaders(context))
  return response.data
}

export const countLine = async (
  context?: GetServerSidePropsContext
): Promise<{ count: number }> => {
  const response = await axios.get(countLinePath(), getHeaders(context));
  return response.data;
};

export const removeLine = async (id: number) => {
  const response = await axios.delete(removeLinePath(id), getHeaders());
  return response.data;
};

export const createLine = async (data: any): Promise<Response> => {
  const path = linePath();
  try {
    const response = await axios.post(path, data, getHeaders());

    if (response.status && response.status >= 200 && response.status <= 299) {
      return { ...response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
};

export const updateLine = async (id: number, data: any):Promise<Response> => {
  const path = linePath() + `/${id}`;
  try {
    const response = await axios.put(path, data, getHeaders());

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {data: response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

// export const updateLine = async (id: number, data: any): Promise<Response> => {
//   const path = removeLinePath(id);
//   try {
//     const response = await axios.put(path, data, getHeaders());
//
//     if (response.status && response.status >= 200 && response.status <= 299) {
//       return { ...response.data, status: response.status };
//     }
//     return { status: response.status ? response.status : 0 };
//   } catch (error: any) {
//     return {
//       status:
//         error.response && error.response.status ? error.response.status : 0,
//     };
//   }
// };

export const getLineById = async(id:number, context?: GetServerSidePropsContext): Promise<Line> => {
  const response = await axios.get(removeLinePath(id), getHeaders(context))
  return response.data
}
