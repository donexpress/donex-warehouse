import axios from 'axios';
import {
    countDivisionPath, countLinePath,
    divisionPath,
    removeDivisionPath,
} from '../backend';
import { RegionalDivision } from '@/types/regional_divisionerege1992';
import { GetServerSidePropsContext } from 'next';
import { getHeaders } from '../helpers';
import {Response} from "../types";
import {RegionalDivisionCountProps} from "../types/regional_division";


export const getRegionalDivision = async(context?: GetServerSidePropsContext): Promise<RegionalDivision[] | null> => {
    const path = divisionPath();
    try {
        const response = await axios.get(path, getHeaders(context));
        return response.data;
    } catch (error) {
        return null;
    }
}

export const countDivision = async (
    context?: GetServerSidePropsContext
): Promise<RegionalDivisionCountProps> => {
    const response = await axios.get(countDivisionPath(), getHeaders(context));
    return response.data;
};

export const removeDivision = async (id: number) => {
    const response = await axios.delete(removeDivisionPath(id), getHeaders());
    return response.data;
};

export const createDivision = async (data: any): Promise<Response> => {
    const path = divisionPath();
    try {
        const response = await axios.post(path, data, getHeaders());

        if (response.status && response.status >= 200 && response.status <= 299) {
            return { ...response.data, status: response.status };
        }
        return { status: response.status ? response.status : 0 };
    } catch (error: any) {
        return {
            status:
                error.response && error.response.status ? error.response.status : 0,
        };
    }
};

export const updateDivision = async (id: number, data: any):Promise<Response> => {
    const path = divisionPath() + `/${id}`;
    try {
        const response = await axios.put(path, data, getHeaders());

        if (response.status && (response.status >= 200 && response.status <= 299)) {
            return {data: response.data, status: response.status};
        }
        return { status: response.status ? response.status : 0 };
    } catch (error: any) {
        return { status: error.response && error.response.status ? error.response.status : 0 };
    }
}

export const getDivisionById = async(id:number, context?: GetServerSidePropsContext): Promise<RegionalDivision> => {
    const response = await axios.get(removeDivisionPath(id), getHeaders(context))
    return response.data
}
