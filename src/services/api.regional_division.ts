import axios from 'axios';
import { RegionalDivisionPath, subsidiaryPath } from '../backend';
import { RegionalDivision } from '@/types/regional_divisionerege1992';
export const getRegionalDivision = async ():Promise<RegionalDivision[]> => {
    const response = await axios.get(RegionalDivisionPath())
    return response.data
}