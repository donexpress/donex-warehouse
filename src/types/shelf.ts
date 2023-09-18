import { PackingList } from './storage_plan';
import { Warehouse } from './warehouse';
import { PackageShelf } from './package_shelf';

export type Shelf = {
    id?: number;
    column_ammount: number;
    layers: number;
    warehouse_id: number;
    partition_table?: number;
    number_of_shelves: number;
    high_inventory?: number;
    location_length?: number;
    location_width?: number;
    designated_user?: number;
    location_type_id?: number;
    packages?: PackingList[];
    shelves_type_id?: number;
    billing_mode_id?: number;
    created_at?: string;
    updated_at?: string;
    meta?: any;
    checked?: boolean;
}

export type ShelfConfig = {
    id?: number;
    column_ammount: number;
    layers: number;
    warehouse_id: number;
    partition_table: number;
    number_of_shelves: number;
    high_inventory?: number;
    location_length?: number;
    location_width?: number;
    designated_user?: number;
    location_type_id?: number;
    packages: PackageShelf[];
    shelves_type_id?: number;
    billing_mode_id?: number;
    created_at?: string;
    updated_at?: string;
    meta?: any;
    checked?: boolean;
}

export type ShelfConfigProps = {
  id: number;
  shelf: ShelfConfig;
  warehouse: Warehouse;
  warehouse_id: number;
};