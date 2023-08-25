import { User } from './user';
import { Warehouse } from './warehouse';

export type PackingList = {
  id?: number,
  box_number: string,
  case_number: string,
  client_weight: number,
  client_length: number,
  client_width: number,
  client_height: number,
  product_sku?: any,
  amount: number,
  product_name: string,
  english_product_name: string,
  price: number,
  material: string,
  customs_code: string,
  fnscu: string,
  custome_picture?: string,
  operator_picture?: string,
  storage_plan_id?: number,
  meta?: any
};

export type StoragePlan = {
    id?: number;
    customer_order_number: string;
    user_id: number | null;
    warehouse_id: number | null;
    box_amount: number;
    delivered_time: string;
    observations: string;
    show_packing_list?: boolean;
    rows?: PackingList[];
};

export type StoragePlanProps = {
  id?: number;
  storagePlan?: StoragePlan;
  isFromDetails?: boolean;
  users: User[];
  warehouses: Warehouse[];
};

export type StoragePlanListProps = {
  storagePlanList: StoragePlan[];
};