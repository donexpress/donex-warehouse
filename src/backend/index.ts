import { BASE_URL } from '../config/index';

export const loginPath = () => {
  return BASE_URL + '/api/v1/login';
};

export const userPath = () => {
  return BASE_URL + '/api/v1/user';
};

export const countUsersPath = () => {
  return BASE_URL + '/api/v1/user/count';
};

export const removeUserPath = (id: number) => {
  return `${BASE_URL}/api/v1/user/${id}`
}

export const getProfilePath = () => {
  return BASE_URL + '/api/users/profile';
};

export const userStatePath = () => {
  return BASE_URL + '/api/v1/user_state';
};

export const staffPath = (page?: number, rowsPerPage?: number) => {
  let params = '';
  if (page && rowsPerPage) {
    params = `?current_page=${page}&number_of_rows=${rowsPerPage}`;
  }
  return BASE_URL + '/api/v1/staff' + params;
};

export const countStaffPath = () => {
  return BASE_URL + '/api/v1/staff/count';
};

export const removeStaffPath = (id: number) => {
  return `${BASE_URL}/api/v1/staff/${id}`
}

export const subsidiaryPath = () => {
  return BASE_URL + '/api/v1/subsidiary';
};

export const RegionalDivisionPath = () => {
  return BASE_URL + '/api/v1/regional_division';
};

export const WarehousePath = () => {
  return BASE_URL + '/api/v1/cargo_station';
};

export const getStateWarehousePath = () => {
  return BASE_URL + '/api/v1/cargo_station_state';
};

export const warehousePath = () => {
  return BASE_URL + '/api/v1/cargo_station';
};

export const countWarehousePath = () => {
  return BASE_URL + '/api/v1/cargo_station/count';
};

export const paymentMethodPath = () => {
  return BASE_URL + '/api/v1/payment_method';
};

export const countPaymentMethodPath = () => {
  return BASE_URL + '/api/v1/payment_method/count';
};

export const userLevelPath = () => {
  return BASE_URL + '/api/v1/user_level';
};

export const countUserLevelPath = () => {
  return BASE_URL + '/api/v1/user_level/count';
};

export const storagePlanPath = (status: number = 0) => {
  const params = status !== 0 ? `?state=${status}` : '';
  return BASE_URL + '/api/v1/storage_plan' + params;
};

export const countStoragePlanPath = () => {
  return BASE_URL + '/api/v1/storage_plan/count';
};

export const packingListPath = () => {
  return BASE_URL + '/api/v1/packing_list';
};

export const countPackingListPath = () => {
  return BASE_URL + '/api/v1/packing_list/count';
};

export const countriesPath = () => {
  return BASE_URL + '/api/v1/countries';
}

export const servicePath = () => {
  return BASE_URL + '/api/v1/service';
}

export const countRolePath = () => {
  return BASE_URL + '/api/v1/role/count';
}

export const rolePath = () => {
  return BASE_URL + '/api/v1/role';
}

export const staffStatePath = () => {
  return BASE_URL + '/api/v1/staff_state';
}

export const organizationPath = () => {
  return BASE_URL + '/api/v1/organization';
}

export const countOrganizationPath = () => {
  return BASE_URL + '/api/v1/organization/count';
}

export const countServicePath = () => {
  return BASE_URL + '/api/v1/service/count';
}

export const whPath = () => {
  return BASE_URL + '/api/v1/aos_warehouse';
}

export const countWhPath = () => {
  return BASE_URL + '/api/v1/aos_warehouse/count';
}

export const filePath = () => {
  return BASE_URL + '/api/v1/file';
}
