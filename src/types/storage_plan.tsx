import { User } from './user';
import { Warehouse } from './warehouse';
import { PackageShelf } from './package_shelf';

export type BulkPLRequest = {
  storage_plan_id: number;
  data: PackingList[];
};

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
  output_plan_delivered_number?: string;
  package_shelf?: PackageShelf[];
  meta?: any;
  checked?: boolean;
  dispatched?: boolean;
  dispatched_time?: string;
  created_at?: string;
  updated_at?: string;
};

export type StoragePlan = {
    id?: number;
    customer_order_number: string;
    user_id: number | null;
    warehouse_id: number | null;
    box_amount: number;
    delivered_time: string | null;
    observations: string;
    rejected_boxes: boolean;
    return: boolean;
    reference_number?: string | null;
    pr_number?: string | null;
    images?: string[] | null;
    is_images?: boolean;
    packing_list?: PackingList[];
    country?: string;
    weight?: string;
    volume?: string;
    show_packing_list?: boolean;
    show_expansion_box_number?: boolean;
    prefix_expansion_box_number?: string;
    digits_box_number?: number;
    rows?: PackingList[];
    user?: User;
    warehouse?: Warehouse;
    order_number?: string;
    state?: string;
    history?: History[];
    created_at?: string;
    updated_at?: string;
};

export type History = {
  type: "packing_list" | "storage_plan" | "shelf_package";
  data: PackingList | StoragePlan | PackageShelf;
}

export type StoragePlanProps = {
  id?: number;
  storagePlan?: StoragePlan;
  isFromDetails?: boolean;
  users: User[];
  warehouses: Warehouse[];
  inWMS: boolean;
};

export type StoragePlanConfigProps = {
  id: number;
  //storagePlan: StoragePlan;
  inWMS: boolean;
};

export type PackingListProps = {
  id: number;
  storagePlan: StoragePlan | null;
  isFromAddPackingList?: boolean;
  isFromModifyPackingList?: boolean;
  loading: boolean;
  inWMS: boolean;
}

export type HistoryStoragePlanProps = {
  id: number;
  storagePlan: StoragePlan | null;
  users: User[];
  warehouses: Warehouse[];
  inWMS: boolean;
}

export type StoragePlanListProps = {
  storagePlanList?: StoragePlan[];
  storagePlanStates: StoragePlanState[];
  storagePCount?: StoragePlanCount;
  inWMS: boolean;
};

export type BoxNumberLabelFn = { 
  showEBN: boolean; 
  prefixEBN: string; 
  dBN: number;
};

export type StoragePlanState = {
  name: string;
  es_name: string;
  zh_name: string;
  value: string;
  position: number;
};

export type StoragePlanCount = {
  total: number,
  to_be_storage: number,
  into_warehouse: number,
  cancelled: number,
  refused: number,
  returns: number,
  stocked: number
};

export type BarCode = {
  number: string;
  boxes_amount: number;
  customer_code: string;
};