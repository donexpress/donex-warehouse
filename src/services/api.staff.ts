import axios from 'axios';
import { countStaffPath, staffPath } from '../backend';
import { Staff } from '@/types/stafferege1992';
export const getStaff = async ():Promise<Staff[]> => {
    const response = await axios.get(staffPath())
    return response.data
}

export const countStaff = async ():Promise<{count: number}> => {
    const response = await axios.get(countStaffPath())
    return response.data
}