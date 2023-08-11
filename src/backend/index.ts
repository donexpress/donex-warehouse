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
