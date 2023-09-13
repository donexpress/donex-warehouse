import axios from "axios";
import { appendixPath, exitPlanPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { Response } from "../types/index";
import { Appendix } from "../types/appendix";

export const createAppendix = async (values: Appendix): Promise<Response> => {
  const path = appendixPath();
  try {
    const response = await axios.post(path, values, getHeaders());

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

export const getAppendagesByExitPlanId = async (
  exitPlanId: number,
  context?: GetServerSidePropsContext
): Promise<Appendix[] | null> => {
  const path = appendixPath();
  try {
    const response = await axios.get(
      `${path}/by_exitPlan/${exitPlanId}`,
      getHeaders(context)
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteAppendix = async (
  appendixId: number,
  context?: GetServerSidePropsContext
): Promise<Response> => {
  const path = appendixPath();
  try {
    const response = await axios.delete(
      `${path}/${appendixId}`,
      getHeaders(context)
    );
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
};
