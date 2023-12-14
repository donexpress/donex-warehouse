
export type Summary = {
    id: number;
    MWB: string;
    quantity_package: number;
    quantity_kilograms: number;
    created_at: string;
    quantity_shipping_cost: number;
    quantity_sale_price: number;
    earnings: number;
}

export type SummaryFilters = {
    waybill_id: string;
    date_rage: string;
}