import { CargoStationWarehouseForm } from './index';
import { Role } from './role';

export type Staff = {
    id: number;
    username: string;
    chinesse_name: string;
    english_name: string;
    email: string;
    phone: string;
    observations: string | null;
    state_id: number;
    organization_id: number;
    role_id: number;
    states: {
        id: number;
        name: string;
    },
    organizations: {
        id: number;
        name: string;
        parent_organization: string;
        organization_type: string;
    },
    role: Role;
    state: StaffState;
    warehouses: CargoStationWarehouseForm[],
    affiliations: number[] | null;
    default_cargo_station_id: number;
    change_password_on_login: boolean;
    allow_search: boolean;
}

export type StaffState = {
    id: number;
    name: string;
}