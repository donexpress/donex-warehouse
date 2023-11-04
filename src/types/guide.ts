
export type Guide = {
    id: number;
    waybill_id: string;
    tracking_number: string;
    weigth: string;
    total_declare: number;
    currency: string;
    shipping_cost: number;
    sale_price: number;
    invoice_weight: number;
    paid: boolean;
    carrier: string;
}

export type GuideProps = {
    id: number;
    guide: Guide;
}

export type GuidesCount = {
    count: number,
};