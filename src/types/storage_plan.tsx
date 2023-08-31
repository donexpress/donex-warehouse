import { User } from './user';
import { Warehouse } from './warehouse';

export type PackingList = {
  id?: number,
  box_number: string,
  box_number_aux?: number,
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
  order_transfer_number?: string;
  meta?: any;
  checked?: boolean;
};

export type StoragePlan = {
    id?: number;
    customer_order_number: string;
    user_id: number | null;
    warehouse_id: number | null;
    box_amount: number;
    delivered_time: string;
    observations: string;
    rejected_boxes: boolean;
    return: boolean;
    packing_list?: PackingList[];
    country?: string;
    weight?: string;
    volume?: string;
    show_packing_list?: boolean;
    show_expansion_box_number?: boolean;
    prefix_expansion_box_number?: string;
    digits_box_number?: number;
    rows?: PackingList[];
};

export type StoragePlanProps = {
  id?: number;
  storagePlan?: StoragePlan;
  isFromDetails?: boolean;
  users: User[];
  warehouses: Warehouse[];
};

export type PackingListProps = {
  id: number;
  storagePlan: StoragePlan;
  isFromAddPackingList?: boolean;
  isFromModifyPackingList?: boolean;
}

export type StoragePlanListProps = {
  storagePlanList: StoragePlan[];
};

export type BoxNumberLabelFn = { 
  showEBN: boolean; 
  prefixEBN: string; 
  dBN: number;
};