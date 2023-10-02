import axios from "axios";
import { countStaffPath, removeStaffPath, staffPath, staffStatePath } from "../backend";
import { Staff } from "@/types/stafferege1992";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { Response } from '../types/index';
import { StaffState, StaffStateDefault } from '../types/staff';

export const getStaff = async(context?: GetServerSidePropsContext): Promise<Staff[]> => {
  const response = await axios.get(staffPath(), getHeaders(context))
  return response.data
}


export const countStaff = async (
  context?: GetServerSidePropsContext
): Promise<{ count: number }> => {
  const response = await axios.get(countStaffPath(), getHeaders(context));
  return response.data;
};

export const removeStaff = async (id: number):Promise<Response> => {
  try {
    const response = await axios.delete(removeStaffPath(id), getHeaders());
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const createStaff = async (data: any): Promise<Response> => {
  const path = staffPath();
  try {
    const response = await axios.post(path, data, getHeaders());

    if (response.status && response.status >= 200 && response.status <= 299) {
      return { ...response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0, data: error.response.data
    };
  }
};

export const updateStaff = async (id: number, data: any): Promise<Response> => {
  const path = removeStaffPath(id);
  try {
    const response = await axios.put(path, data, getHeaders());

    if (response.status && response.status >= 200 && response.status <= 299) {
      return { ...response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0, data: error.response.data
    };
  }
};

export const getStaffById = async(id:number, context?: GetServerSidePropsContext): Promise<Staff> => {
  const response = await axios.get(removeStaffPath(id), getHeaders(context))
  return response.data
}

export const getStaffStates = async (context?: GetServerSidePropsContext):Promise<StaffStateDefault | null> => {
  const path = staffStatePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}