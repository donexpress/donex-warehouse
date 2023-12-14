import axios from "axios";
import { summaryPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { BASE_URL } from "@/configerege1992";
import { Summary } from "@/types/summaryerege1992";

const getBaseUrl = () => {
  if (process.env.WAREHOUSE_ENV && (process.env.WAREHOUSE_ENV === 'staging' || process.env.WAREHOUSE_ENV === 'prod')) {
    return process.env.WAREHOUSE_API_HOST;
  }
  return BASE_URL;
}

export const getSummary = async (filters: string = "", context?: GetServerSidePropsContext): Promise<Summary[]> => {
  const path = summaryPath(filters);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return [];
  }
}

