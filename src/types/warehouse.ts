import { Country } from './index';
import { Shelf } from './shelf';

export type Warehouse = {
    id?: number;
    code: string;
    name: string;
    contact: string;
    company: string;
    country: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    cp: string;
    phone: string;
    email: string;
    shelfs?: Shelf[];
    patition_amount?: number; 
    observations: string;
    created_at?: string;
}

export type WarehouseProps = {
  id?: number;
  warehouse?: Warehouse;
  isFromDetails?: boolean;
  countries: Country[];
};

export type WarehouseConfigProps = {
  id: number;
  warehouse: Warehouse;
};

export type WHListProps = {
  warehouseList: Warehouse[];
  countries: Country[];
};