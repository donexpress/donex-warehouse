import React, { useState, useEffect } from "react";
import { ExitPlan, State } from "@/types/exit_planerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { generateValidationSchemaExitPlan, generateValidationSchemaOperationinstruction } from "@/validation/generateValidationSchemaerege1992";
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
import { showMsg, isWMS, isOMS } from "@/helperserege1992";
import LocationTable from "../../common/LocationTable";
import "../../../../styles/wms/user.form.scss";
import OperationInstructionAppendix from "./OperationInstructionAppendix";
import { ParsedUrlQueryInput } from 'querystring';
import ExitPlanAppendixFromOP from '../exitPlan/ExitPlanAppendixFromOP';
import { AppendixFromOPBody, Appendix } from "../../../../types/appendix";
import { createAppendix } from "@/services/api.appendixerege1992";
import { Staff } from "@/types/stafferege1992";

interface Props {
  types: State[];
  id?: number;
  isFromDetails?: boolean;
  isModify?: boolean;
  warehouses: Warehouse[];
  exitPlans: ExitPlan[];
  operationInstruction?: OperationInstruction;
  users: User[];
  userOwner?: User | Staff;
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
  userOwner,
}: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale, exit_plan_id } = router.query;
  const [user, setUser] = useState<User| undefined>((isOMS() && !id) ? users[0] : (users.find(el => el.id === operationInstruction?.user_id)))
  const [oI, setOI] = useState<OperationInstruction| undefined>(operationInstruction)
  const [filterType, setFilterType] = useState<{
    filter: ExitPlan | Warehouse | User | undefined;
    type: string;
  }>({ filter: undefined, type: "none" });
  const [isFromEPConfig, setIsFromEPConfig] = useState<boolean>(false);
  const [stateEP, setStateEP] = useState<string>('');
  const [ePId, setEPId] = useState<string>('');
  const [appendixes, setAppendixes] = useState<AppendixFromOPBody[]>([]);

  useEffect(() => {
    const exitPId = router.query.exit_plan_id;
    const exitPState = router.query.exit_plan_state;
    if (exitPId && exitPState && (exitPId !== '') && (exitPState !== '')) {
      setStateEP(exitPState.toString());
      setIsFromEPConfig(true);
      setEPId(exitPId.toString());
    }
  }, []);

  const getPositions = (operationInstruction: any): string[] => {
    const pos: string[] = [];
    operationInstruction.instruction_type.forEach((el: any) => {
      pos.push(el.position);
    });
    return pos;
  };

  const initialValues: OperationInstruction = {
    client_display: id ? false : false,
    internal_remark: id ? "" : "",
    number_delivery:
      id && operationInstruction ? operationInstruction.number_delivery : "",
    operation_instruction_type:
      id && operationInstruction
        ? getPositions(operationInstruction.operation_instruction_type)
        : [],
    // @ts-ignore
    output_plan_id:
      id || exit_plan_id
        ? id
          ? Number(operationInstruction?.output_plan_id)
          : Number(exit_plan_id)
        : null,
    remark: id && operationInstruction ? operationInstruction.remark : "",
    type: id ? "" : "",
    // @ts-ignore
    user_id:
      id || exit_plan_id
        ? id
          ? Number(operationInstruction?.user_id)
          : Number(
              exitPlans.find((el) => el.id === Number(exit_plan_id))?.user_id
            )
        : ((isOMS() && !id) ? users[0].id : null),
    // @ts-ignore
    warehouse_id:
      id || exit_plan_id
        ? id
          ? Number(operationInstruction?.warehouse_id)
          : Number(
              exitPlans.find((el) => el.id === Number(exit_plan_id))
                ?.warehouse_id
            )
        : null,
  };

  const createAppendixes = async (operationInstructionId: number) => {
    if (userOwner) {
      try {
        const promises = appendixes.map((el) => {
          const appdx: Appendix = {
            name: el.name,
            user_id: userOwner.id,
            operation_instruction_id: operationInstructionId,
            function: el.function,
            url: el.url,
            is_owner_admin: isWMS() ? true : false
          };
          return createAppendix(appdx);
        }
        );
        await Promise.all(promises);
        showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
          type: "success",
        });
      } catch (e) {
        showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
          type: "error",
        });
      }
    }
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
      const r = await updateOperationInstruction(id ? id : -1, values);
      if (r.status >= 200 && r.status <= 299) {
        showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
          type: "success",
        });
      } else {
        showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
          type: "error",
        });
      }
    } else {
      const r = await createOperationInstruction(values);
      if (r.status >= 200 && r.status <= 299) {
        setOI(r.data)
        setUser(users.find(el => el.id === values.user_id))
        if (appendixes.length > 0) {
          await createAppendixes(r.data.id);
        } else {
          const message = intl.formatMessage({ id: "successfullyMsg" });
          showMsg(message, { type: "success" });
        }
      } else {
        showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
          type: "error",
        });
      }
    }
    cancelSend();
  };
  const goToEdit = () => {
    let params: ParsedUrlQueryInput = { goBack: 'vizualice'};
    const exitPId = router.query.exit_plan_id;
    const exitPState = router.query.exit_plan_state;
    if (exitPId) {
      params = {
        ...params,
        exit_plan_id: exitPId,
      };
    }
    if (exitPState) {
      params = {
        ...params,
        exit_plan_state: exitPState,
      };
    }
    router.push(
      {
        pathname: `/${locale}/${isOMS() ? "oms" : "wms"}/operation_instruction/${operationInstruction?.id}/update`,
        query: params,
      }
    );
  };
  const cancelSend = () => {
    const goBack = router.query.goBack;
    const exitPId = router.query.exit_plan_id;

    if (exitPId) {
      if (goBack && goBack === 'vizualice') {
        let params: ParsedUrlQueryInput = {};
        const exitPState = router.query.exit_plan_state;
    
        if (exitPId) {
          params = {
            ...params,
            exit_plan_id: exitPId,
          };
        }
        if (exitPState) {
          params = {
            ...params,
            exit_plan_state: exitPState,
          };
        }
        router.push(
          {
            pathname: `/${locale}/${isOMS() ? "oms" : "wms"}/operation_instruction/${id}/show`,
            query: params,
          }
        );
      } else {
        router.push(
          {
            pathname: `/${locale}/${isOMS() ? "oms" : "wms"}/exit_plan/${exitPId}/config`
          }
        );
      }
    } else {
      if (goBack && goBack === 'vizualice') {
        router.push(
          {
            pathname: `/${locale}/${isOMS() ? "oms" : "wms"}/operation_instruction/${id}/show`
          }
        );
      } else {
        router.push(
          `/${locale}/${isOMS() ? "oms" : "wms"}/operation_instruction`
        );
      }
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
    const warehouses_ids: number[] = [];
    if (filterType.type === "exit_plan") {
      const tmp = filterType.filter as ExitPlan;
      if (tmp.warehouse_id) {
        warehouses_ids.push(tmp.warehouse_id);
      }
    }
    let response: ValueSelect[] = [];
    warehouses.forEach((warehouse) => {
      if (warehouses_ids.length > 0) {
        if (warehouses_ids.find((el) => el === warehouse.id)) {
          response.push({
            value: Number(warehouse.id),
            label: warehouse.name,
          });
        }
      } else {
        response.push({
          value: Number(warehouse.id),
          label: warehouse.name,
        });
      }
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
    const users_ids: number[] = [];
    if (filterType.type === "exit_plan") {
      const tmp = filterType.filter as ExitPlan;
      if (tmp.user_id) {
        users_ids.push(tmp.user_id);
      }
    }
    let response: ValueSelect[] = [];
    usrs.forEach((user) => {
      if (users_ids.length > 0) {
        if (users_ids.find((el) => el === user.id)) {
          response.push({
            value: Number(user.id),
            label: user.nickname,
          });
        }
      } else {
        response.push({
          value: Number(user.id),
          label: user.nickname,
        });
      }
    });
    return response;
  };

  const changeValueExitPlan = (value: number) => {
    const exitPlan = exitPlans.find((el) => el.id === value);
    if (exitPlan) {
      setFilterType({ filter: exitPlan, type: "exit_plan" });
    }
  };

  const changeValueUser = (value: number) => {
    const user = users.find((el) => el.id === value);
    if (user) {
      setFilterType({ filter: user, type: "user" });
    }
  };

  const changeValueWarehouse = (value: number) => {
    const warehouse = warehouses.find((el) => el.id === value);
    if (warehouse) {
      setFilterType({ filter: warehouse, type: "warehouse" });
    }
  };

  return (
    <div className="user-form-body">
      <div className='flex'>
        <h1 className="flex-1 text-xl font-semibold">
          {id
            ? isFromDetails
              ? intl.formatMessage({ id: "vizualice" })
              : intl.formatMessage({ id: "modify" })
            : intl.formatMessage({ id: "insert" })}{" "}
          {intl.formatMessage({ id: "operation_instruction" })}
        </h1>
        <div className='w-100' style={{ marginLeft: '10px' }}>
          <Button
            color="primary"
            type="button"
            className='px-4'
            onClick={()=>cancelSend()}
          >
            {intl.formatMessage({ id: 'back' })}
          </Button>
        </div>
      </div>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          validationSchema={generateValidationSchemaOperationinstruction(intl)}
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
                    getValueChangeFn={changeValueWarehouse}
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
                    getValueChangeFn={changeValueExitPlan}
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
                    getValueChangeFn={changeValueUser}
                    isMulti={false}
                    disabled={
                      isFromDetails || exit_plan_id !== undefined || isModify || isOMS()
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
                    disabled={isFromDetails}
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
                    {isFromDetails && id && !(isOMS() && isFromEPConfig && stateEP!== "pending") && (
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
      {
        !!id && !(isOMS() && isFromEPConfig && stateEP!== "pending") && (
          <OperationInstructionAppendix owner={user} operationInstruction={oI} />
        )
      }
      {
        !id && userOwner && (
          <ExitPlanAppendixFromOP owner={userOwner} updateAppendix={setAppendixes}></ExitPlanAppendixFromOP>
        )
      }
      {isFromDetails && !(isOMS() && isFromEPConfig && stateEP!== "pending") && (
        <LocationTable
        // @ts-ignore
          exitPlan={exitPlans.find((el) => el.id === operationInstruction?.output_plan_id)}
        />
      )}
    </div>
  );
};

export default OperationInstructionFormBody;
