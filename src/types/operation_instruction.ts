import { ExitPlan } from "./exit_plan";
import { User } from "./user";
import { Warehouse } from "./warehouse";

export type OperationInstruction = {
    id?: number, 
    operation_instruction_type: string[],
    warehouse_id: number,
    output_plan_id: number,
    user_id: number,
    type: string,
    number_delivery: string,
    remark: any,
    internal_remark: any,
    client_display: boolean,
    state?: string,
    instruction_type?: string[],
    user?: User,
    warehouse?: Warehouse,
    output_plan?: ExitPlan 
 }

 export type InstructionTypeList = {
    instruction_type: InstructionType[];
 }

export type InstructionType = {
    id: number;
    name: string;
    es_name: string,
    zh_name: string,
    value: string,
    position: number,
}