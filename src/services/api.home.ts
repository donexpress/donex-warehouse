import axios from 'axios';
import { countsPath } from '../backend';
import { Counts } from '../types';
import { getHeaders } from '../helpers';

export const getAllCounts = async ():Promise<Counts | null> => {
    try {
        const response = await axios.get(countsPath(), getHeaders())
        return response.data
    } catch (error) {
        return null;
    }
}