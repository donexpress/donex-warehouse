import { getHeaders } from "@/helperserege1992";
import { operationInstructionPath } from "../backend";
import axios from "axios";
import { GetServerSidePropsContext } from "next";

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

export const createOperationInstruction = async (data: any, context?: GetServerSidePropsContext) => {
  const path = operationInstructionPath()
  try {
    const response = await axios.post(path, data, getHeaders(context));
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


export const getOperationInstructions = async (state:string = 'pending', context?: GetServerSidePropsContext) => {
  const path = `${operationInstructionPath()}?state=${state}`
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