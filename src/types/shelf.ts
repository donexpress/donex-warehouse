import { PackingList } from './storage_plan';

export type Shelf = {
    id?: number;
    column_ammount: number;
    layers: number;
    warehouse_id: number;
    partition_table: number;
    designated_user?: number;
    high_inventory?: number;
    location_length?: number;
    location_type_id?: number;
    location_width?: number;
    number_of_shelves: number;
    packages?: PackingList[];
    shelves_type_id?: number;
    billing_mode_id?: number;
    created_at?: string;
    updated_at?: string;
    meta?: any;
}