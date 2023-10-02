
export type Line = {
    id: number;
    name: string;
    contain_channels: string;
    include_order_account: string;
}

export type LineProps = {
    id: number;
    line: Line;
}
