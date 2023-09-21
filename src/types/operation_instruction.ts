export type OperationInstruction = {
    operation_instruction_type: string,
    warehouse_id: number,
    output_plan_id: number,
    user_id: number,
    type: string,
    number_delivery: string,
    remark: any,
    internal_remark: any,
    client_display: boolean
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