import axios from 'axios';
import { subsidiaryPath } from '../backend';
import { Subsidiary } from '@/types/subsidiaryerege1992';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';

export const getSubsidiary = async (context?: GetServerSidePropsContext):Promise<Subsidiary[]> => {
    const response = await axios.get(subsidiaryPath(), getHeaders(context))
    return response.data
}