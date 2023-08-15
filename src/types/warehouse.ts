export type Warehouse = {
    id: number;
    name: string;
    english_name: string;
    receiving_area: string;
    principal: string;
    contact_phone: string;
    address: string;
    city: string;
    province: string;
    country: string;
    cp: string;
    shared_warehouse_system_code: string;
    shared_warehouse_docking_code: string;
    customer_order_number_rules: string;
    stateId: number;
    states: {
        id: number;
        name: string;
    }
}