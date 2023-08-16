import axios from 'axios';
import { 
    servicePath
   } from '../backend';
import { Service } from '../types/service';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

export const indexServices = async (context?: GetServerSidePropsContext):Promise<Service[] | null> => {
  const path = servicePath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}
