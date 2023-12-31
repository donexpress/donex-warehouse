import { Country } from ".";
import { OperationInstruction } from "./operation_instruction";
import { Staff } from "./staff";
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
  packing_lists?: PackingList[];
  destination?: string;
  operation_instructions?: OperationInstruction[]
  destination_ref?: {
    name: string;
    es_name: string;
    zh_name: string;
    value: string;
    position: number;
  }
  address_ref?: State;
  reference_number: string | null
  client_box_number?: string;
  relabel?: boolean | null
};

export type AddBoxes = {
  case_number: string;
  warehouse_order_number: string;
};

export type ExitPlanProps = {
  id?: number;
  exitPlan?: ExitPlan;
  isFromDetails?: boolean;
  users: User[];
  countries: Country[];
  warehouses: Warehouse[];
  destinations?: {destinations: State[]};
  addresses: {addresses: {amazon:State[], meli:State[]}};
  user?: User | Staff;
  userOwner?: User | Staff;
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

export type StateCount = {
  total: number;
  pending: number;
  to_be_processed: number;
  processing: number;
  dispatched: number;
  cancelled: number;
  collecting: number;
}
