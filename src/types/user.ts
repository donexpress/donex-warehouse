import { RegionalDivision } from "./regional_division";
import { Staff } from "./staff";
import { Subsidiary } from "./subsidiary";
import { CargoStationWarehouseForm } from "./index";
import { PaymentMethod } from './payment_methods';
import { UserLevel } from './user_levels';
import { UserState } from './user_state';
import { RoleType } from './profile';

export type UserListProps = {
    role: RoleType | '';
    userStateList: any[];
};

export type User = {
    id: number;
    username: string;
    nickname: string;
    label_code: string;
    contact: string;
    company: string;
    email: string;
    phone_number: string;
    phone: string;
    qq: string;
    credits: string;
    observations: string;
    state: string | null;
    finantial_representative: number;
    client_service_representative: number;
    sales_representative: number;
    sales_source: number;
    subsidiary_id: number;
    regional_division_id: number;
    warehouse_id: number;
    shipping_control: boolean;
    hidde_transfer_order: boolean;
    reset_password: boolean;
    warehouses: CargoStationWarehouseForm;
    warehouse?: CargoStationWarehouseForm;
    regional_divisions: RegionalDivision;
    subsidiaries: Subsidiary;
    finantial_representatives: Staff | null;
    client_service_representatives: Staff | null;
    sales_representatives: Staff | null;
    sales_sources: Staff | null;
    payment_method_id: number | null;
    user_level_id: number | null;
    customer_number?: string;
    payment_method?: PaymentMethod;
    user_level?: UserLevel;
}