import axios from 'axios';
import { countStaffPath, staffPath } from '../backend';
import { Staff } from '@/types/stafferege1992';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';

export const getStaff = async (context?: GetServerSidePropsContext):Promise<Staff[]> => {
    const response = await axios.get(staffPath(), getHeaders(context))
    return response.data
}

export const countStaff = async (context?: GetServerSidePropsContext):Promise<{count: number}> => {
    const response = await axios.get(countStaffPath(), getHeaders(context))
    return response.data
}