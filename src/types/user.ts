import { RegionalDivision } from "./regional_division";
import { Staff } from "./staff";
import { Subsidiary } from "./subsidiary";
import { CargoStationWarehouseForm } from "./index";

export type User = {
    id: number;
    username: string;
    nickname: string;
    label_code: string;
    contact: string;
    company: string;
    email: string;
    phone: string;
    qq: string;
    credits: string;
    observations: string;
    state_id: number;
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
    regional_divisions: RegionalDivision;
    subsidiaries: Subsidiary;
    finantial_representatives: Staff | null;
    client_service_representatives: Staff | null;
    sales_representatives: Staff | null;
    sales_sources: Staff | null;
    payment_method_id: number | null;
    user_level_id: number | null
}