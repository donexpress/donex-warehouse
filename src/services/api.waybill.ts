import axios from 'axios';
import {
  waybillPath
} from '../backend';
import { MWB } from '../types/index';
import { getHeaders } from '../helpers';
import { GetServerSidePropsContext } from 'next';

export const indexWaybillIDS = async (context?: GetServerSidePropsContext): Promise<MWB[] | null> => {
  const path = waybillPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
};