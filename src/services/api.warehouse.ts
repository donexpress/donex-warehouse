import axios from 'axios';
import { WarehousePath } from '../backend';
import { Warehouse } from '@/types/warehouseerege1992';
export const getWarehouses = async ():Promise<Warehouse[]> => {
    const response = await axios.get(WarehousePath())
    return response.data
}