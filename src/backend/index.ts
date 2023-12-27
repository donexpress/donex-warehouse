import { BASE_URL } from "../config/index";

const getBaseUrl = () => {
  if (process.env.WAREHOUSE_ENV && (process.env.WAREHOUSE_ENV === 'staging' || process.env.WAREHOUSE_ENV === 'prod')) {
    return process.env.WAREHOUSE_API_HOST;
  }
  return BASE_URL;
}

export const loginPath = () => {
  return getBaseUrl() + "/api/v1/login";
};

export const userPath = () => {
  return getBaseUrl() + "/api/v1/user";
};

export const countUsersPath = () => {
  return getBaseUrl() + "/api/v1/user/count";
};

export const removeUserPath = (id: number) => {
  return `${getBaseUrl()}/api/v1/user/${id}`;
};

export const userStatePath = () => {
  return getBaseUrl() + "/api/v1/user/states";
};

export const staffPath = (page?: number, rowsPerPage?: number) => {
  let params = "";
  if (page && rowsPerPage) {
    params = `?current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  return getBaseUrl() + "/api/v1/staff" + params;
};

export const countStaffPath = () => {
  return getBaseUrl() + "/api/v1/staff/count";
};

export const removeStaffPath = (id: number) => {
  return `${getBaseUrl()}/api/v1/staff/${id}`;
};

export const subsidiaryPath = () => {
  return getBaseUrl() + "/api/v1/subsidiary";
};

export const RegionalDivisionPath = () => {
  return getBaseUrl() + "/api/v1/regional_division";
};

export const WarehousePath = () => {
  return getBaseUrl() + "/api/v1/cargo_station";
};

export const getStateWarehousePath = () => {
  return getBaseUrl() + "/api/v1/cargo_station/states";
};

export const warehousePath = () => {
  return getBaseUrl() + "/api/v1/cargo_station";
};

export const countWarehousePath = () => {
  return getBaseUrl() + "/api/v1/cargo_station/count";
};

export const paymentMethodPath = () => {
  return getBaseUrl() + "/api/v1/payment_method";
};

export const countPaymentMethodPath = () => {
  return getBaseUrl() + "/api/v1/payment_method/count";
};

export const userLevelPath = () => {
  return getBaseUrl() + "/api/v1/user_level";
};

export const countUserLevelPath = () => {
  return getBaseUrl() + "/api/v1/user_level/count";
};

export const barCodePath = () => {
  return getBaseUrl() + "/api/v1/generate_label";
};

export const storagePlanPath = (status: string = '', page?: number, rowsPerPage?: number, query?: string) => {
  let params = status !== '' ? `?state=${status}` : "";
  if (page && rowsPerPage) {
    params += `${params === "" ? '?' : '&'}current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  if (query && query !== '') {
    params += `${params === "" ? '?' : '&'}filter=${query}`;
  }
  return getBaseUrl() + "/api/v1/storage_plan" + params;
};

export const storagePlanStatePath = () => {
  return getBaseUrl() + "/api/v1/storage_plan/states";
};

export const storagePlanCountPath = (query: string = "") => {
  let params = "";
  if (query && query !== "") {
    params += `?filter=${query}`;
  }
  return getBaseUrl() + "/api/v1/storage_plan/count" + params;
};

export const storagePlanByOrderNumberPath = (order_number: string) => {
  const params = `?query=${order_number}`;
  return getBaseUrl() + "/api/v1/storage_plan" + params;
};

export const countStoragePlanPath = () => {
  return getBaseUrl() + "/api/v1/storage_plan/count";
};

export const selfPath = () => {
  return getBaseUrl() + "/api/v1/self";
};

export const packingListPath = () => {
  return getBaseUrl() + "/api/v1/packing_list";
};

export const countPackingListPath = () => {
  return getBaseUrl() + "/api/v1/packing_list/count";
};

export const countriesPath = () => {
  return getBaseUrl() + "/api/v1/countries";
};

export const carriersPath = () => {
  return getBaseUrl() + "/api/v1/carriers";
};

export const excelPath = () => {
  return getBaseUrl() + "/api/v1/excel";
};

export const excelSummaryPath = () => {
  return getBaseUrl() + "/api/v1/download/summary";
};

export const shippingInvoicePath = () => {
  return getBaseUrl() + "/api/v1/shipping_invoice";
};

export const profitPath = () => {
  return getBaseUrl() + "/api/v1/sum";
};

export const waybillPath = () => {
  return getBaseUrl() + "/api/v1/byWaybill";
};

export const servicePath = () => {
  return getBaseUrl() + "/api/v1/service";
};

export const countRolePath = () => {
  return getBaseUrl() + "/api/v1/role/count";
};

export const rolePath = () => {
  return getBaseUrl() + "/api/v1/role";
};

export const staffStatePath = () => {
  return getBaseUrl() + "/api/v1/staff/states";
};

export const organizationPath = () => {
  return getBaseUrl() + "/api/v1/organization";
};

export const countOrganizationPath = () => {
  return getBaseUrl() + "/api/v1/organization/count";
};

export const countServicePath = () => {
  return getBaseUrl() + "/api/v1/service/count";
};

export const whPath = () => {
  return getBaseUrl() + "/api/v1/aos_warehouse";
};

export const countWhPath = () => {
  return getBaseUrl() + "/api/v1/aos_warehouse/count";
};

export const exitPlanPath = () => {
  return getBaseUrl() + "/api/v1/output_plan";
};
export const filePath = () => {
  return getBaseUrl() + "/api/v1/file";
};

export const packageShelfPath = () => {
  return getBaseUrl() + "/api/v1/shelf_package";
};

export const appendixPath = () => {
  return getBaseUrl() + "/api/v1/appendix";
};

export const shelfPath = () => {
  return getBaseUrl() + "/api/v1/shelf";
}

export const countsPath = () => {
  return getBaseUrl() + "/api/v1/counts";
};

export const operationInstructionPath = () => {
  return getBaseUrl() + '/api/v1/operation_instruction'
}

export const linePath = (page?: number, rowsPerPage?: number) => {
  let params = "";
  if (page && rowsPerPage) {
    params = `?current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  return getBaseUrl() + "/api/v1/line_classification" + params;
};

export const countLinePath = () => {
  return getBaseUrl() + "/api/v1/line_classification/count";
};

export const removeLinePath = (id: number) => {
  return `${getBaseUrl()}/api/v1/line_classification/${id}`;
};

export const divisionPath = (page?: number, rowsPerPage?: number) => {
  let params = "";
  if (page && rowsPerPage) {
    params = `?current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  return getBaseUrl() + "/api/v1/regional_division" + params;
};

export const countDivisionPath = () => {
  return getBaseUrl() + "/api/v1/regional_division/count";
};

export const removeDivisionPath = (id: number) => {
  return `${getBaseUrl()}/api/v1/regional_division/${id}`;
};

export const guidePath = (page?: number, rowsPerPage?: number, filters?: string) => {
  let params = "";
  if (page && rowsPerPage) {
    params += `${params === "" ? '?' : '&'}current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  if (filters && filters !== "") {
    params += `${params === "" ? '?' : '&'}${filters}`;
  }
  return getBaseUrl() + "/api/v1/manifest" + params;
};

export const summaryPath = (is_carrier: boolean, page?: number, rowsPerPage?: number, filters?: string) => {
  let params = "";
  if (page && rowsPerPage) {
    params += `${params === "" ? '?' : '&'}current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  if (filters && filters !== "") {
    params += `${params === "" ? '?' : '&'}${filters}`;
  }
  return getBaseUrl() + "/api/v1/summary" + params + `&is_carrier=${is_carrier}`;
};

export const GuideCountPath = (filters: string = "") => {
  let params = "";
  if (filters && filters !== "") {
    params += `?${filters}`;
  }
  return getBaseUrl() + "/api/v1/count" + params;
};

export const exportOutputPlanPath = () => {
  return getBaseUrl() + "/api/v1/output_plan/export";
};

export const exportEntryPlanPath = () => {
  return getBaseUrl() + "/api/v1/storage_plan/export";
};

export const self = () => {
  return getBaseUrl() + "/api/v1/self";
};

export const autoAssignLocationPath = (id: number) => {
  return getBaseUrl() + `/api/v1/storage_plan/${id}/auto_assign`;
}