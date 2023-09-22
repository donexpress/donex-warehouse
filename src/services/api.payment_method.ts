import axios from 'axios';
import { countPaymentMethodPath, paymentMethodPath } from '../backend';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import { Response } from '../types/index';
import { PaymentMethod } from '../types/payment_methods';

export const countPaymentMethod = async ():Promise<{count: number}> => {
    const response = await axios.get(countPaymentMethodPath())
    return response.data
}

export const createPaymentMethod = async (values: PaymentMethod): Promise<Response> => {
  const path = paymentMethodPath();
  try {
    const response = await axios.post(path, values, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
};

export const updatePaymentMethodById = async (paymentMethodId: number, paymentMethod: PaymentMethod):Promise<Response> => {
  const path = paymentMethodPath() + `/${paymentMethodId}`;
  try {
    const response = await axios.put(path, paymentMethod, getHeaders());
    
    if (response.status && (response.status >= 200 && response.status <= 299)) {
      return {...response.data, status: response.status};
    }
    return { status: response.status ? response.status : 0 };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getPaymentMethodById = async (paymentMethodId: number, context?: GetServerSidePropsContext):Promise<PaymentMethod | null> => {
  const path = paymentMethodPath() + `/${paymentMethodId}`;
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}

export const removePaymentMethodById = async (paymentMethodId: number):Promise<Response> => {
  const path = paymentMethodPath() + `/${paymentMethodId}`;
  try {
    const response = await axios.delete(path, getHeaders());
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return { status: error.response && error.response.status ? error.response.status : 0 };
  }
}

export const getPaymentMethods = async (context?: GetServerSidePropsContext):Promise<PaymentMethod[] | null> => {
  const path = paymentMethodPath();
  try {
    const response = await axios.get(path, getHeaders(context));
    return response.data;
  } catch (error) {
    return null;
  }
}