import { User } from './user';
import { Warehouse } from './warehouse';

export type StoragePlan = {
    id?: number;
    customer_order_number: string;
    user_id: number | null;
    warehouse_id: number | null;
    boxes_count: number;
    delivery_time: string;
    observations: string;
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