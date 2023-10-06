import axios from "axios";
import { exitPlanPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { ExitPlan, State, StateCount } from "../types/exit_plan";
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

export const getExitPlansById = async (
  exit_plan_id: number,
  context?: GetServerSidePropsContext
): Promise<ExitPlan | null> => {
  const path = exitPlanPath();
  try {
    const response = await axios.get(
      `${path}/${exit_plan_id}`,
      getHeaders(context)
    );
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
  exitPlan: any
): Promise<Response> => {
  const path = exitPlanPath() + `/${exitPlanId}`;
  try {
    const response = await axios.put(path, exitPlan, getHeaders());

    if (response.status && response.status >= 200 && response.status <= 299) {
      return { ...response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    console.log({
      status:
        error.response && error.response.status ? error.response.status : 0,
    })
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
};

export const removeExitPlan = async (exitPlanId: number): Promise<Response> => {
  const path = exitPlanPath() + `/${exitPlanId}`;
  try {
    const response = await axios.delete(path, getHeaders());

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

export const getExitPlansState = async () => {
  const path = exitPlanPath() + `/states`;
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
};

export const getExitPlansByState = async (
  state: string
): Promise<ExitPlan[] | null> => {
  const path = exitPlanPath() + `?state=${state}`;
  try {
    const response = await axios.get<ExitPlan[]>(path, getHeaders());
    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const countExitPlans = async (): Promise<StateCount> => {
  const response = await axios.get(`${exitPlanPath()}/count`, getHeaders());
  return response.data;
};

export const getExitPlanDestinations = async (
  context?: GetServerSidePropsContext
): Promise<{ destinations: State[] }> => {
  const response = await axios.get(
    `${exitPlanPath()}/destinations`,
    getHeaders(context)
  );
  return response.data;
};

export const getExitPlanDestinationsAddresses = async (
  context?: GetServerSidePropsContext
): Promise<{ destinations: State[] }> => {
  const response = await axios.get(
    `${exitPlanPath()}/addresses`,
    getHeaders(context)
  );
  return response.data;
};

export const getExitPlanByFilter = async (filter:any, context?: GetServerSidePropsContext): Promise<ExitPlan[]> => {
  const response = await axios.post<ExitPlan[]>(`${exitPlanPath()}/filter`,filter, getHeaders(context))
  return response.data
}
