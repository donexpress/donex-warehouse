export type ExportPayload = {
    type: 'pdf' | 'xlsx';
    ids: number[];
    display_columns: DisplayColumns[];
};

export type DisplayColumns = {
    key: string;
    value: string;
};