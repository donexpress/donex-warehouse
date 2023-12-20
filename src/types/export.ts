export type ExportPayload = {
    type: 'pdf' | 'xlsx';
    ids: number[];
    display_columns: string[];
};