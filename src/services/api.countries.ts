import axios from 'axios';
import { 
    countriesPath
   } from '../backend';
import { Country } from '../types/index';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

export const indexCountries = async (context?: GetServerSidePropsContext): Promise<Country[] | null> => {
  const path = countriesPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
};