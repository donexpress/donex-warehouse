import axios from 'axios';
import { countUserLevelPath } from '../backend';
export const countUserLevel = async ():Promise<{count: number}> => {
    const response = await axios.get(countUserLevelPath())
    return response.data
}