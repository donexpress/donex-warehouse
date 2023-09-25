import React, { useState } from "react";
import { ExitPlan, State } from "@/types/exit_planerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { generateValidationSchemaExitPlan } from "@/validation/generateValidationSchemaerege1992";
import { Form, Formik } from "formik";
import { useIntl } from "react-intl";
import GenericInput from "../../common/GenericInput";
import { ValueSelect } from "@/typeserege1992";
import { getLanguage } from "@/helpers/utilserege1992";
import { Warehouse } from "@/types/warehouseerege1992";
import { Button } from "@nextui-org/react";
import {
  createOperationInstruction,
  updateOperationInstruction,
} from "@/services/api.operation_instructionerege1992";
import { useRouter } from "next/router";
import { User } from "@/types/usererege1992";
import ExitPlanAppendix from "../exitPlan/ExitPlanAppendix";

interface Props {
  types: State[];
  id?: number;
  isFromDetails?: boolean;
  isModify?: boolean;
  warehouses: Warehouse[];
  exitPlans: ExitPlan[];
  operationInstruction?: OperationInstruction;
  users: User[];
}

const OperationInstructionFormBody = ({
  types,
  id,
  isFromDetails,
  isModify,
  warehouses,
  exitPlans,
  operationInstruction,
  users,
}: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale, exit_plan_id } = router.query;

  const getPositions = (operationInstruction: any): string[] => {
    const pos: string[] = [];
    operationInstruction.instruction_type.forEach((el: any) => {
      pos.push(el.position);
    });
    return pos;
  };

  const getOwner = (): User | undefined => {
    let user_id = -1
    if(exit_plan_id) {
      const tmp = exitPlans.find(el => el.id === Number(exit_plan_id))
      if(tmp && tmp.user_id) {
        user_id = tmp.user_id
      }
    } else {
      const tmp = operationInstruction?.user_id
      if(tmp) {
        user_id = tmp
      }
    }
    const owner = users.find(el => el.id === user_id)
    return owner
  }
  const initialValues: OperationInstruction = {
    client_display: id ? false : false,
    internal_remark: id ? "" : "",
    number_delivery:
      id && operationInstruction ? operationInstruction.number_delivery : "",
    operation_instruction_type:
      id && operationInstruction
        ? getPositions(operationInstruction.operation_instruction_type)
        : [],
    output_plan_id:
      id || exit_plan_id
        ? id
          ? Number(operationInstruction?.output_plan_id)
          : Number(exit_plan_id)
        : 0,
    remark: id && operationInstruction ? operationInstruction.remark : "",
    type: id ? "" : "",
    user_id:
      id || exit_plan_id
        ? id
          ? Number(operationInstruction?.user_id)
          : Number(
              exitPlans.find((el) => el.id === Number(exit_plan_id))?.user_id
            )
        : 0,
    warehouse_id:
      id || exit_plan_id
        ? id
          ? Number(operationInstruction?.warehouse_id)
          : Number(
              exitPlans.find((el) => el.id === Number(exit_plan_id))
                ?.warehouse_id
            )
        : 0,
  };

  const handleSubmit = async (values: OperationInstruction) => {
    const instruction_type: string[] = [];
    types.forEach((type) => {
      if (
        values.operation_instruction_type?.find(
          (t) => Number(t) === type.position
        )
      ) {
        instruction_type.push(type.value);
      }
    });
    values.operation_instruction_type = instruction_type;
    if (isModify) {
      console.log(values);
      await updateOperationInstruction(id ? id : -1, values);
    } else {
      await createOperationInstruction(values);
    }
    if (exit_plan_id) {
      router.push(`/${locale}/wms/exit_plan/${exit_plan_id}/config`);
    } else {
      router.push(
        `/${locale}/wms/operation_instruction`
      );
    }
  };
  const goToEdit = () => {
    router.push(
      `/${locale}/wms/operation_instruction/${operationInstruction?.id}/update`
    );
  };
  const cancelSend = () => {
    if (exit_plan_id) {
      router.push(`/${locale}/wms/exit_plan/${exit_plan_id}/config`);
    } else {
      router.push(
        `/${locale}/wms/operation_instruction`
      );
    }
  };

  const getTypesFormatted = (types: State[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    types.forEach((type) => {
      response.push({
        value: Number(type.position),
        label: type[getLanguage(intl)],
      });
    });
    return response;
  };

  const getwarehouseFormatted = (warehouses: Warehouse[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    warehouses.forEach((warehouse) => {
      response.push({
        value: Number(warehouse.id),
        label: warehouse.name,
      });
    });
    return response;
  };

  const getExitPlanFormatted = (exitPLans: ExitPlan[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    exitPLans.forEach((exitPlan) => {
      response.push({
        value: Number(exitPlan.id),
        label: exitPlan.output_number ? exitPlan.output_number : "",
      });
    });
    return response;
  };

  const getUserFormatted = (usrs: User[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    usrs.forEach((user) => {
      response.push({
        value: Number(user.id),
        label: user.nickname,
      });
    });
    return response;
  };

  return (
    <div className="user-form-body">
      <h1 className="text-xl font-semibold">
        {id
          ? isFromDetails
            ? intl.formatMessage({ id: "vizualice" })
            : intl.formatMessage({ id: "modify" })
          : intl.formatMessage({ id: "insert" })}{" "}
        {intl.formatMessage({ id: "operation_instruction" })}
      </h1>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          validationSchema={generateValidationSchemaExitPlan(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="operation_instruction_type"
                    placeholder={intl.formatMessage({
                      id: "operation_instruction_type",
                    })}
                    options={getTypesFormatted(types)}
                    customClass="select-filter"
                    isMulti={true}
                    disabled={isFromDetails || isModify}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="warehouse_id"
                    placeholder={intl.formatMessage({ id: "warehouse" })}
                    options={getwarehouseFormatted(warehouses)}
                    customClass="select-filter"
                    disabled={
                      isFromDetails || exit_plan_id !== undefined || isModify
                    }
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="output_plan_id"
                    placeholder={intl.formatMessage({ id: "exitPlan" })}
                    options={getExitPlanFormatted(exitPlans)}
                    customClass="select-filter"
                    isMulti={false}
                    disabled={
                      isFromDetails || exit_plan_id !== undefined || isModify
                    }
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="user_id"
                    placeholder={intl.formatMessage({ id: "user" })}
                    options={getUserFormatted(users)}
                    customClass="select-filter"
                    isMulti={false}
                    disabled={
                      isFromDetails || exit_plan_id !== undefined || isModify
                    }
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="number_delivery"
                    placeholder={intl.formatMessage({
                      id: "number_delivery",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails || isModify}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="remark"
                    placeholder={intl.formatMessage({
                      id: "observations",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <div className="flex justify-end gap-3">
                  <div>
                    {!isFromDetails && (
                      <Button
                        color="primary"
                        type="submit"
                        className="px-4"
                        disabled={isSubmitting || !isValid}
                      >
                        {isSubmitting
                          ? intl.formatMessage({ id: "sending" })
                          : id
                          ? intl.formatMessage({ id: "modify" })
                          : intl.formatMessage({ id: "add" })}
                      </Button>
                    )}
                    {isFromDetails && id && (
                      <Button
                        color="primary"
                        onClick={() => goToEdit()}
                        className="px-4"
                        type="button"
                      >
                        {intl.formatMessage({ id: "go_to_edit" })}
                      </Button>
                    )}
                  </div>
                  <div>
                    <Button
                      onClick={() => cancelSend()}
                      type="button"
                      className="bg-secundary px-4"
                    >
                      {intl.formatMessage({ id: "cancel" })}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {id && exitPlans && (
        // @ts-ignore
        <ExitPlanAppendix owner={getOwner()} operationInstruction={operationInstruction}
        />
      )}
    </div>
  );
};

export default OperationInstructionFormBody;
