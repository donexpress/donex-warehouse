import axios from "axios";
import { exitPlanPath, exportOutputPlanPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { ExitPlan, State, StateCount } from "../types/exit_plan";
import { ExportPayload } from "../types/export";
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

export const getCleanExitPlans = async (
  context?: GetServerSidePropsContext
): Promise<ExitPlan[] | null> => {
  const path = `${exitPlanPath()}/cleanIndex`;
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
      return { data: response.data, status: response.status };
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
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
};

export const removeBoxesExitPlan = async (
  exitPlanId: number,
  exitPlan: any
): Promise<Response> => {
  const path = exitPlanPath() + `/${exitPlanId}/remove_boxes`;
  try {
    const response = await axios.patch(path, exitPlan, getHeaders());

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
  state: string,
  page: number | undefined = undefined,
  rowsPerPage: number | undefined = undefined,
  query: string | undefined = undefined,
  initialDate: string | undefined = undefined,
  finalDate: string | undefined = undefined,
  location: string[] | undefined = undefined
): Promise<ExitPlan[] | null> => {
  let params = "";
  if (page && rowsPerPage) {
    params += `&current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  if (query && query !== "") {
    params += `&filter=${query}`;
  }
  if(initialDate && initialDate !== "") {
    params += `&initialDate=${initialDate}`
  }
  if(finalDate && finalDate !== "") {
    params += `&finalDate=${finalDate}`
  }
  if(location && location.length > 0) {
    params += `&location=${encodeURIComponent(JSON.stringify(location))}`
  }
  const path = exitPlanPath() + `?state=${state}${params}`;
  try {
    const response = await axios.get<ExitPlan[]>(path, getHeaders());
    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const countExitPlans = async (
  query: string = "",
  initialDate: string | undefined = undefined,
  finalDate: string | undefined = undefined,
  location: string[] | undefined = undefined
): Promise<StateCount> => {
  let params = "?api=back";
  if (query && query !== "") {
    params += `&filter=${query}`;
  }
  if(initialDate && initialDate !== "") {
    params += `&initialDate=${initialDate}`
  }
  if(finalDate && finalDate !== "") {
    params += `&finalDate=${finalDate}`
  }
  if(location && location.length > 0) {
    params += `&location=${encodeURIComponent(JSON.stringify(location))}`
  }
  const response = await axios.get(
    `${exitPlanPath()}/count${params}`,
    getHeaders()
  );
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

export const getExitPlanByFilter = async (
  filter: any,
  page: number | undefined = undefined,
  rowsPerPage: number | undefined = undefined,
  context?: GetServerSidePropsContext
): Promise<ExitPlan[]> => {
  let params = "";
  if (page && rowsPerPage) {
    params += `?current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  const response = await axios.post<ExitPlan[]>(
    `${exitPlanPath()}/filter${params}`,
    filter,
    getHeaders(context)
  );
  return response.data;
};

export const getNonBoxesOnExitPlans = async (
  excluded_output_plan: number,
  case_numbers: string[]
): Promise<Response> => {
  const path = exitPlanPath() + `/get_non_boxes_on_output_plans`;
  try {
    const response = await axios.post(
      path,
      { case_numbers, excluded_output_plan },
      getHeaders()
    );

    if (response.status && response.status >= 200 && response.status <= 299) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
};

export const exportExitPlan = async (values: ExportPayload): Promise<Response> => {
  const path = exportOutputPlanPath();
  try {
    const response = await axios.post(path, values, getHeaders());

    if (response.status && response.status >= 200 && response.status <= 299) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return {
      status:
        error.response && error.response.status ? error.response.status : 0,
    };
  }
};

export const pullBoxes = async (
  id: number,
  data: {
    case_number: string;
    warehouse_order_number: string;
  },
  context?: GetServerSidePropsContext
) => {
  const response = await axios.post<ExitPlan>(
    `${exitPlanPath()}/pull_boxes`,
    { id, data },
    getHeaders(context)
  );
  return response.data;
};
