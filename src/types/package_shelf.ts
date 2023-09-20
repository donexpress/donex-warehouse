import { Shelf } from './shelf';
import { PackingList } from './storage_plan';

export type PackageShelf = {
    id?: number;
    shelf_id: number;
    package_id: number;
    layer: number;
    column: number;
    meta?: any;
    created_at?: string;
    updated_at?: string;
    shelf?: Shelf;
    package?: PackingList;
};