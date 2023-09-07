import axios from "axios";
import { exitPlanPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { ExitPlan } from "../types/exit_plan";
import { Response } from "../types/index";

export const getExitPlans = async (
  context?: GetServerSidePropsContext
): Promise<ExitPlan[] | null> => {
  const path = exitPlanPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
};


export const getExitPlansById = async (exit_plan_id: number, context?: GetServerSidePropsContext): Promise<ExitPlan | null> => {
  const path = exitPlanPath();
  try {
    const response = await axios.get(`${path}/${exit_plan_id}`, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
};


export const createExitPlan = async (values: ExitPlan): Promise<Response> => {
  const path = exitPlanPath();
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

export const updateExitPlan = async (
  exitPlanId: number,
  exitPlan: ExitPlan
): Promise<Response> => {
  const path = exitPlanPath() + `/${exitPlanId}`;
  try {
    const response = await axios.put(path, exitPlan, getHeaders());

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
