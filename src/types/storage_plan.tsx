import { User } from './user';
import { Warehouse } from './warehouse';

export type RowBoxData = {
  id: number;
  box_number: string;
  transfer_order_number: string;
  quantity: number;
  customer_weight: number;
  customer_length: number;
  customer_width: number;
  customer_height: number;
  product_name: string;
  english_product_name: string;
  declaration_unit_price: number;
  material: string;
  customs_code: string;
  fnscu: string;
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
    rows?: any[];
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