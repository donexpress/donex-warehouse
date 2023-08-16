import axios from 'axios';
import { RegionalDivisionPath, subsidiaryPath } from '../backend';
import { RegionalDivision } from '@/types/regional_divisionerege1992';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';

export const getRegionalDivision = async (context?: GetServerSidePropsContext):Promise<RegionalDivision[]> => {
    const response = await axios.get(RegionalDivisionPath(), getHeaders(context))
    return response.data
}