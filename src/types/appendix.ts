import { User } from "./user"

export type Appendix = {
    created_at?: string
    deleted?: boolean
    function: string
    id?: number
    meta?: any
    name: string
    output_plan_id?: number
    operation_instruction_id?: number
    updated_at?: string
    url: string
    user_id: number
    user?: User
    is_owner_admin: boolean
}

export type AppendixFromOPBody = {
    id?: number;
    name: string;
    function: string;
    url: string;
};