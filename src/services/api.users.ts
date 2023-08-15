import axios from 'axios';
import { 
  countUsersPath,
  getProfilePath,
  loginPath,
  paymentMethodPath,
  removeUserPath,
  userLevelPath,
  userPath,
  userStatePath
 } from '../backend';
import { LoginBody, LoginResponse, UserProfile, UserLevelForm, PaymentMethodForm, Response } from '../types/index';
import { getHeaders } from '../helpers';
import { User } from '@/types/usererege1992';
import { UserState } from '@/types/user_stateerege1992';

export const login = async (values: LoginBody): Promise<LoginResponse> => {
  const path = loginPath();
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(path, values, config);
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const createPaymentMethod = async (values: PaymentMethodForm): Promise<Response> => {
  const path = paymentMethodPath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const createUserLevel = async (values: UserLevelForm): Promise<Response> => {
  const path = userLevelPath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const indexProfile = async (): Promise<UserProfile | null> => {
  const path = getProfilePath();
  try {
    //const response = await axios.get(path);
    const data: UserProfile = {
      id: 1,
      username: 'connor92', 
      fullname: 'Connor Street Eugene',
      profile_image: 'https://img.freepik.com/foto-gratis/joven-confiado_1098-20868.jpg?t=st=1681790781~exp=1681791381~hmac=e7a9f1fd2c2ff3892d470cd5a02a18d08db3ef4524596f1dbaa5cde540254dda',
      phone_number: '1234***5678',
      email: 'test***135@gmail.com'
    };
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUsers = async(): Promise<User[]> => {
  const response = await axios.get(userPath())
  return response.data
}

export const countUsers = async(): Promise<{count: number}> => {
  const response = await axios.get(countUsersPath())
  return response.data
}

export const getUserStates = async(): Promise<UserState[]> => {
  const response = await axios.get(userStatePath())
  return response.data
}

export const removeUser = async(id: number) => {
  const response = await axios.delete(removeUserPath(id))
  return response.data
}

export const createUser = async(data: any) => {
  const response = await axios.post(userPath(), data)
  return response.data
}

export const getUserById = async(id:number): Promise<User> => {
  const response = await axios.get(removeUserPath(id))
  return response.data
}

export const updateUser = async(id:number, data: any) => {
  const response = await axios.put(removeUserPath(id), data)
  return response.data
}
