import { Country } from ".";
import { User } from "./user";
import { Warehouse } from "./warehouse";

export type ExitPlan = {
    user?: User;
    warehouse?: Warehouse;
    city: null | string;
    country: null |  string;
    address: null | string;
    observations: null | string;
    type: null | number;
    delivered_time: null | string;
    id?: number;
    amount?: null | number;
    box_amount?: null | number;
    case_numbers?: any[];
    created_at?: string;
    delivered_quantity?: null | number;
    meta?: any;
    output_boxes?: null | number;
    output_number?: string;
    palets_amount?: null | number;
    updated_at?: string;
    user_id?: number;
    warehouse_id?: number
}

export type ExitPlanProps = {
   id?: number
   exitPlan? : ExitPlan;
   isFromDetails?: boolean;
   users: User[];
   countries: Country[],
   warehouses: Warehouse[],
  };