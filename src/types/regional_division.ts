import {Line} from "./line";
import {StoragePlan, StoragePlanCount, StoragePlanState} from "./storage_plan";

export type RegionalDivision = {
    id: number;
    type: number;
    area_code: string;
    name: string;
    company?: string;
    contain_country?: string;
    zip_start_with?: string;
    num_ruler_pakage_follow?: string;
}

export type RegionalDivisionProps = {
    id: number;
    regionalDivision: RegionalDivision;
}

export type RegionalDivisionForm = {
    type: number;
    area_code: string;
    name: string;
    company?: number;
    contain_country?: string;
    zip_start_with?: string;
    num_ruler_pakage_follow?: string;
}

export type RegionalDivisionFormProps = {
    regionalDivisionsTypes: {value: number, label: string}[]
    id?: number;
    regionalDivision?: RegionalDivision;
    isFromDetails?: boolean;
}

export type RegionalDivisionListProps = {
    regionalDivisionList?: RegionalDivision[];
    regionalDivisionsTypes: {value: number, label: string}[];
    divisionsCount?: RegionalDivisionCount;
};

export type RegionalDivisionCountProps = {
    divisionsCount: RegionalDivisionCount;
};

export type RegionalDivisionCount = {
    count: number
};
