import axios from "axios";
import { GuideCountPath, excelPath, guidePath, profitPath } from "../backend";
import { GetServerSidePropsContext } from "next";
import { getHeaders } from "../helpers";
import { BASE_URL } from "@/configerege1992";
import { Guide, GuidesCount } from "@/types/guideerege1992";
import { Response } from "@/types/indexerege1992";

const getBaseUrl = () => {
  if (process.env.WAREHOUSE_ENV && (process.env.WAREHOUSE_ENV === 'staging' || process.env.WAREHOUSE_ENV === 'prod')) {
    return process.env.WAREHOUSE_API_HOST;
  }
  return BASE_URL;
}

export const getGuides = async (page: number | undefined = undefined, rowsPerPage: number | undefined = undefined, filters: string | undefined = undefined, context?: GetServerSidePropsContext): Promise<Guide[]> => {
  const path = guidePath(page, rowsPerPage, filters);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return [];
  }
}

export const guidesCount = async (filters: string = "", context?: GetServerSidePropsContext): Promise<GuidesCount | null> => {
  const path = GuideCountPath(filters);
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const createManifest = async (formData: FormData, carrier?: string, mwb?: string, customer_code?: string, force: boolean = false): Promise<any> => {
  let path;
  if (force) {
    path = getBaseUrl() + `/api/v1/manifest?carrier=${carrier}&mwb=${mwb}&customer_code=${customer_code}&force=${force}`;
  } else {
    path = getBaseUrl() + `/api/v1/manifest?carrier=${carrier}&mwb=${mwb}&customer_code=${customer_code}`;
  }

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

export const updateCustomerManifest = async (formData: FormData, willCharge: boolean): Promise<any> => {
  let params = willCharge ? `?collected=true` : '';
  const path = getBaseUrl() + `/api/v1/manifest_customer${params}`;

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

export const updateSupplierManifest = async (formData: FormData, currentChange: string, billCode: String, willPaid: boolean): Promise<any> => {
  let params = willPaid ? `&paid=true` : '';
  const path = getBaseUrl() + `/api/v1/manifest_supplier?currency_exchange=${currentChange}&bill_code=${billCode}${params}`;

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

export const exportExcelManifest = async (waybill_id: string, carrier?: string, context?: GetServerSidePropsContext): Promise<any> => {
  const path = carrier ? `${excelPath()}?waybill_id=${waybill_id}&carrier=${carrier}` : `${excelPath()}?waybill_id=${waybill_id}`;
  const response = await exportExcelManifestFn(path, context);
  return response;
}

export const exportExcelManifestBillCode = async (billCode: string): Promise<any> => {
  const path = `${excelPath()}?bill_code=${billCode}`;
  const response = await exportExcelManifestFn(path);
  return response;
}

export const exportExcelManifestFn = async (path: string, context?: GetServerSidePropsContext): Promise<any> => {
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

export const calculateProfit = async (waybill_id: string, carrier?: string, context?: GetServerSidePropsContext): Promise<any> => {
  const path = carrier ? `${profitPath()}?waybill_id=${waybill_id}&carrier=${carrier}` : `${profitPath()}?waybill_id=${waybill_id}`;

  try {
    const response = await axios.get(path, getHeaders(context));

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const paidBill = async (billCode: string): Promise<Response> => {
  const path = getBaseUrl() + `/api/v1/paid?bill_code=${billCode}`;

  try {
    const response = await axios.patch(path, {}, getHeaders(null));

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const chargeWaybill = async (waybillCode: string): Promise<Response> => {
  const path = getBaseUrl() + `/api/v1/paid?client=customer&waybill_id=${waybillCode}`;

  try {
    const response = await axios.patch(path, {}, getHeaders(null));

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const exportBill = async (billCode: string): Promise<Response> => {
  const path = getBaseUrl() + `/api/v1/supplier_invoice?bill_code=${billCode}`;

  try {
    const response = await axios.get(path, getHeaders());

    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return { data: response.data, status: response.status };
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

