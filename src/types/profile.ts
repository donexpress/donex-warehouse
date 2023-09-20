export type ProfileUser = {
    id: number,
    customer_number: number,
    username: string,
    nickname: string,
    label_code: string,
    contact: string,
    company: string,
    email: string,
    phone_number: string,
    phone: string,
    qq: string,
    credits: string,
    observations: string,
    state_id: number,
    finantial_representative: number,
    client_service_representative: number,
    sales_representative: number,
    sales_source: number,
    subsidiary_id: number,
    regional_division_id: number,
    warehouse_id: number,
    shipping_control: boolean,
    hidde_transfer_order: boolean,
    reset_password: boolean,
    user_level_id: number,
    payment_method_id: number,
    state: string,
    created_at: string,
    updated_at: string,
};

export type ProfileAdmin = {
    id: number,
    username: string,
    chinesse_name: string,
    english_name: string,
    email: string,
    phone: string,
    observations: string,
    state_id: number,
    organization_id: number,
    role_id: number,
    default_cargo_station_id: any,
    change_password_on_login: boolean,
    allow_search: boolean,
    meta: any,
    state: any,
    created_at: string,
    updated_at: string,
    role: Role;
};

export type Role = {
    id: number;
    name: string;
    type: RoleType;
    scope: any;
    created_at: string;
    updated_at: string;
};

export type RoleType = "ADMIN" | "OPERATION" | "CUSTOMER_SERVICE" | "SALE" | "FINANCE";

export type Profile = ProfileUser | ProfileAdmin;