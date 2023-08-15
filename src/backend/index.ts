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

export const staffPath = () => {
  return BASE_URL + '/api/v1/staff';
};

export const subsidiaryPath = () => {
  return BASE_URL + '/api/v1/subsidiary';
};

export const RegionalDivisionPath = () => {
  return BASE_URL + '/api/v1/regional_division';
};

export const WarehousePath = () => {
  return BASE_URL + '/api/v1/warehouse';
};

