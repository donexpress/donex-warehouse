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

export const getProfilePath = () => {
  return BASE_URL + '/api/users/profile';
};

export const getStateWarehousePath = () => {
  return BASE_URL + '/api/v1/warehouse_state';
};

export const warehousePath = () => {
  return BASE_URL + '/api/v1/warehouse';
};

export const countWarehousePath = () => {
  return BASE_URL + '/api/v1/warehouse/count';
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

export const countriesPath = () => {
  return BASE_URL + '/api/v1/countries';
}
