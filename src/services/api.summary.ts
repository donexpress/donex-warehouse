import axios from "axios";
import { excelSummaryPath, summaryPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { BASE_URL } from "@/configerege1992";
import { Summary, SummaryResponse } from "@/types/summaryerege1992";

const getBaseUrl = () => {
  if (process.env.WAREHOUSE_ENV && (process.env.WAREHOUSE_ENV === 'staging' || process.env.WAREHOUSE_ENV === 'prod')) {
    return process.env.WAREHOUSE_API_HOST;
  }
  return BASE_URL;
}

export const getSummary = async (is_carrier: boolean, page: number | undefined = undefined, rowsPerPage: number | undefined = undefined, filters: string | undefined = undefined, context?: GetServerSidePropsContext): Promise<SummaryResponse | null> => {
  const path = summaryPath(is_carrier, page, rowsPerPage, filters);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const exportExcelSummary = async (queryFilters: string, context?: GetServerSidePropsContext): Promise<any> => {
  const path = `${excelSummaryPath()}?${queryFilters}`;
  const response = await exportExcelSummaryFn(path, context);
  return response;
}

export const exportExcelSummaryFn = async (path: string, context?: GetServerSidePropsContext): Promise<any> => {
  try {
    const response = await axios.get(path, getHeaders(context));
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      const link = document.createElement('a');
      link.href = response.data.url;
      link.setAttribute('download', response.data.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};
