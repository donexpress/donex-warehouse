import axios from 'axios';
import { countUserLevelPath, userLevelPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Response } from '../types/index';
import { UserLevel } from '../types/user_levels';

export const countUserLevel = async ():Promise<{count: number}> => {
    const response = await axios.get(countUserLevelPath())
    return response.data
}

export const createUserLevel = async (values: UserLevel): Promise<Response> => {
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

export const updateUserLevelById = async (userLevelId: number, userLevel: UserLevel):Promise<Response> => {
  const path = userLevelPath() + `/${userLevelId}`;
  try {
    const response = await axios.put(path, userLevel, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getUserLevelById = async (userLevelId: number, context?: GetServerSidePropsContext):Promise<UserLevel | null> => {
  const path = userLevelPath() + `/${userLevelId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const removeUserLevelById = async (userLevelId: number):Promise<any | null> => {
  const path = userLevelPath() + `/${userLevelId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getUserLevels = async (context?: GetServerSidePropsContext):Promise<UserLevel[] | null> => {
  const path = userLevelPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}