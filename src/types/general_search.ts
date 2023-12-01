export type InputData = {
    key: string;
    initialValue: string;
    placeholder: string;
    type: 'text' | 'select';
    selectionItems?: SelectionItem[];
};

export type SelectionItem = {
    value: string;
    label: string;
};