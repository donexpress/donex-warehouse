import { Country } from ".";
import { PackingList, StoragePlan } from "./storage_plan";
import { User } from "./user";
import { Warehouse } from "./warehouse";

export type ExitPlan = {
  user?: User;
  warehouse?: Warehouse;
  city: null | string;
  country: null | string;
  address: null | string;
  observations: null | string;
  type: null | number;
  delivered_time: null | string;
  id?: number;
  amount?: null | number;
  box_amount?: null | number;
  case_numbers?: string[];
  created_at?: string;
  delivered_quantity?: null | number;
  meta?: any;
  output_boxes?: null | number;
  output_number?: string;
  palets_amount?: null | number;
  updated_at?: string;
  user_id?: number;
  warehouse_id?: number;
  state?: State
  packing_lists?: PackingList[]
};

export type ExitPlanProps = {
  id?: number;
  exitPlan?: ExitPlan;
  isFromDetails?: boolean;
  users: User[];
  countries: Country[];
  warehouses: Warehouse[];
};

export type ExitPlanState = {
  states: State[];
};

export type State = {
  name: string;
  es_name: string;
  zh_name: string;
  value: string;
  position: number;
};
