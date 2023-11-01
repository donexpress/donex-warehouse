import axios from 'axios';
import {
  carriersPath
} from '../backend';
import { Carrier } from '../types/index';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

export const indexCarriers = async (context?: GetServerSidePropsContext): Promise<Carrier[] | null> => {
  const path = carriersPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data.carriers;
  } catch (error) {
    return null;
  }
};