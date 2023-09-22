import { CargoStationWarehouseForm } from './index';
import { Role } from './role';
import { Organization } from './organization';
import { RoleType } from './profile';

export type StaffListProps = {
    role: RoleType | '';
    staffStates: StaffState[];
};

export type Staff = {
    id: number;
    username: string;
    chinesse_name: string;
    english_name: string;
    email: string;
    phone: string;
    observations: string | null;
    state: string | null;
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
    organization: Organization;
    warehouses: CargoStationWarehouseForm[],
    affiliations: number[] | null;
    default_cargo_station_id: number;
    change_password_on_login: boolean;
    allow_search: boolean;
}

export type StaffState = {
    id: number;
    name: string;
    es_name: string,
    zh_name: string,
    value: string,
    position: number,
}

export type StaffStateDefault = {
  normal: StaffState,
  frezze: StaffState,
  resign: StaffState,
};