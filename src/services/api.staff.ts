import axios from 'axios';
import { staffPath } from '../backend';
import { Staff } from '@/types/stafferege1992';
export const getStaff = async ():Promise<Staff[]> => {
    const response = await axios.get(staffPath())
    return response.data
}