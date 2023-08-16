import axios from 'axios';
import { countPaymentMethodPath } from '../backend';

export const countPaymentMethod = async ():Promise<{count: number}> => {
    const response = await axios.get(countPaymentMethodPath())
    return response.data
}