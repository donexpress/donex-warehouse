import { getHeaders } from "@/helperserege1992";
import { operationInstructionPath } from "../backend";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { Response } from '../types/index';

export const getOperationInstructionStates = async () => {
    const path = operationInstructionPath() + `/states`;
  try {
    const response = await axios.get(path, getHeaders());
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
}

export const getOperationInstructionType = async (context?: GetServerSidePropsContext) => {
  const path = operationInstructionPath() + `/type/list`
  try {
    const response = await axios.get(path, getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return {...response.data, status: response.status}
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}

export const countOperationInstruction = async (exit_plan_id?: number, query?: string, context?: GetServerSidePropsContext) => {
  let path: string = operationInstructionPath() + `/count`
  if(exit_plan_id) {
    path += `?output_plan_id=${exit_plan_id}`
  }
  if (query && (query !== '')) {
    path += `${ exit_plan_id ? '&' : '?'}filter=${query}`;
  }
  try {
    const response = await axios.get(path, getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return {...response.data, status: response.status}
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}

export const createOperationInstruction = async (data: any, context?: GetServerSidePropsContext): Promise<Response> => {
  const path = operationInstructionPath()
  try {
    const response = await axios.post(path, data, getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return {data: response.data, status: response.status}
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}

export const updateOperationInstruction = async (id: number, data: any, context?: GetServerSidePropsContext) => {
  const path = `${operationInstructionPath()}/${id}`
  try {
    const response = await axios.put(path, data, getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return {...response.data, status: response.status}
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}



export const getOperationInstructions = async (state:string = 'pending', page?: number, rowsPerPage?: number, query?: string, context?: GetServerSidePropsContext) => {
  let params = '';
  if (page && rowsPerPage) {
    params += `&current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  if (query && query !== '') {
    params += `&filter=${query}`;
  }
  const path = `${operationInstructionPath()}?state=${state}${params}`
  try {
    const response = await axios.get(path,getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return response.data
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}

export const deleteOperationInstructions = async (id: number, context?: GetServerSidePropsContext) => {
  const path = `${operationInstructionPath()}/${id}`
  try {
    const response = await axios.delete(path,getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return response.data
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}

export const getOperationInstructionsByOutputPlan = async (outputPlan: number, state:string = 'pending', page?: number, rowsPerPage?: number, query?: string, context?: GetServerSidePropsContext) => {
  let params = '';
  if (page && rowsPerPage) {
    params += `&current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  if (query && query !== '') {
    params += `&filter=${query}`;
  }
  const path = `${operationInstructionPath()}/output_plan/${outputPlan}?state=${state}${params}`
  try {
    const response = await axios.get(path,getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return response.data
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}

export const getOperationInstructionsById = async (id:number, context?: GetServerSidePropsContext) => {
  const path = `${operationInstructionPath()}/${id}`
  try {
    const response = await axios.get(path,getHeaders(context));
    if(response.status && response.status >=200 && response.status <= 299) {
      return response.data
    }
    return {status: response.status ? response.status : 0}
  } catch(error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
}