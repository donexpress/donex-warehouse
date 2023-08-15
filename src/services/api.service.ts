import axios from 'axios';
import { countServicePath } from '../backend';

export const countService = async ():Promise<{count: number}> => {
    const response = await axios.get(countServicePath())
    return response.data
}