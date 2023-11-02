import axios from "axios";
import { guidePath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { BASE_URL } from "@/configerege1992";

const getBaseUrl = () => {
  if (process.env.WAREHOUSE_ENV && (process.env.WAREHOUSE_ENV === 'staging' || process.env.WAREHOUSE_ENV === 'prod')) {
    return process.env.WAREHOUSE_API_HOST;
  }
  return BASE_URL;
}

export const getGuides = async (filters?: string, context?: GetServerSidePropsContext): Promise<any[]> => {
  const response = await axios.get(guidePath(filters), getHeaders(context))
  return response.data
}

export const createManifest = async (formData: FormData, carrier?: string): Promise<any> => {
  const path = getBaseUrl() + `/api/v1/manifest?carrier=${carrier}`;

  try {
    const response = await axios.post(path, formData, getHeaders(null, true));

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const updateCustomerManifest = async (formData: FormData): Promise<any> => {
  const path = getBaseUrl() + `/api/v1/manifest_customer`;

  try {
    const response = await axios.patch(path, formData, getHeaders(null, true));

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const updateSupplierManifest = async (formData: FormData): Promise<any> => {
  const path = getBaseUrl() + `/api/v1/manifest_supplier`;

  try {
    const response = await axios.patch(path, formData, getHeaders(null, true));

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

