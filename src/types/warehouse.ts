import { Country } from './index';

export type Warehouse = {
    id?: number;
    code: string;
    name: string;
    contact_person: string;
    company: string;
    country: string;
    address: string;
    address2: string;
    city: string;
    province: string;
    cp: string;
    phone: string;
    email: string;
    observations: string;
}

export type WarehouseProps = {
  id?: number;
  warehouse?: Warehouse;
  isFromDetails?: boolean;
  countries: Country[];
};

export type WHListProps = {
  warehouseList: Warehouse[];
};