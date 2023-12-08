
export type Guide = {
    id: number;
    waybill_id: string;
    tracking_number: string;
    weight: string;
    total_declare: number;
    currency: string;
    shipping_cost: number;
    sale_price: number;
    invoice_weight: number;
    paid: boolean;
    carrier: string;
}

export type ShippingInvoice = {
    waybill_id: string;
    carrier: string;
    eta: string;
}

export type GuideProps = {
    id: number;
    guide: Guide;
}

export type GuidesCount = {
    count: number,
};

export type ManifestBillCode = {
    url: string;
    name: string;
}

export type ManifestResponse = {
    manifest_count: number;
    manifest_charged_count: number;
    waybill_id: any;
    manifest_charged: Guide[];
    unrecorded_manifests: Guide[];
    manifests_bill_code: ManifestBillCode[];
    errors: any;
}