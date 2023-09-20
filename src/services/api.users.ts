import axios from 'axios';
import { 
  countUsersPath,
  selfPath,
  loginPath,
  paymentMethodPath,
  removeUserPath,
  userLevelPath,
  userPath,
  userStatePath
 } from '../backend';
import { LoginBody, LoginResponse, Response } from '../types/index';
import { Profile } from '../types/profile';
import { getHeaders, isWMS } from '../helpers';
import { User } from '@/types/usererege1992';
import { UserState, UserStateDefault } from '@/types/user_stateerege1992';
import { UserLevel } from '../types/user_levels';
import { PaymentMethod } from '../types/payment_methods';
import { GetServerSidePropsContext } from 'next';

export const login = async (values: LoginBody): Promise<LoginResponse> => {
  const path = loginPath();
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'warehouse_service': isWMS() ? 'wms' : 'oms',
      },
    };
    const response = await axios.post(path, values, config);
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0, message: (error.response.data && error.response.data.message) ? error.response.data.message : '' };
  }
};

export const getUserLevels = async (context?: GetServerSidePropsContext):Promise<UserLevel[] | null> => {
  const path = userLevelPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getPaymentMethods = async (context?: GetServerSidePropsContext):Promise<PaymentMethod[] | null> => {
  const path = paymentMethodPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const indexProfile = async (context?: GetServerSidePropsContext): Promise<Profile | null> => {
  const path = selfPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUsers = async(context?: GetServerSidePropsContext): Promise<User[]> => {
  const response = await axios.get(userPath(), getHeaders(context))
  return response.data
}

export const countUsers = async(): Promise<{count: number}> => {
  const response = await axios.get(countUsersPath())
  return response.data
}

export const getUserStates = async(context?: GetServerSidePropsContext): Promise<UserStateDefault> => {
  const response = await axios.get(userStatePath(), getHeaders(context))
  return response.data
}

export const removeUser = async(id: number) => {
  const response = await axios.delete(removeUserPath(id), getHeaders())
  return response.data
}

export const createUser = async(data: any): Promise<Response> => {
  const path = userPath();
  try {
    const response = await axios.post(path, data, getHeaders());
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0, data: error.response.data };
  }
}

export const getUserById = async(id:number, context?: GetServerSidePropsContext): Promise<User> => {
  const response = await axios.get(removeUserPath(id), getHeaders(context))
  return response.data
}

export const updateUser = async(id:number, data: any): Promise<Response> => {
  const path = removeUserPath(id);
  try {
    const response = await axios.put(path, data, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0, data: error.response.data };
  }
}
