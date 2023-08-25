import axios from 'axios';
import { countRolePath, rolePath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Role } from '../types/role';

export const countRole = async ():Promise<{count: number}> => {
    const response = await axios.get(countRolePath())
    return response.data
}

export const getRoles = async (context?: GetServerSidePropsContext):Promise<Role[] | null> => {
  const path = rolePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}