import axios from 'axios';
import { countRolePath } from '../backend';

export const countOrganization = async ():Promise<{count: number}> => {
    const response = await axios.get(countRolePath())
    return response.data
}