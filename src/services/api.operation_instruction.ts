import { getHeaders } from "@/helperserege1992";
import { operationInstructionPath } from "../backend";
import axios from "axios";

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