import axios from 'axios';
import { countsPath } from '../backend';
import { Counts } from '../types';

export const getAllCounts = async ():Promise<Counts | null> => {
    try {
        const response = await axios.get(countsPath())
        return response.data
    } catch (error) {
        return null;
    }
}