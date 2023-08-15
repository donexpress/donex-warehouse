import axios from 'axios';
import { subsidiaryPath } from '../backend';
import { Subsidiary } from '@/types/subsidiaryerege1992';
export const getSubsidiary = async ():Promise<Subsidiary[]> => {
    const response = await axios.get(subsidiaryPath())
    return response.data
}