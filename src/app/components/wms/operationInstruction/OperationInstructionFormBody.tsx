import { State } from "@/types/exit_planerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { generateValidationSchemaExitPlan } from "@/validation/generateValidationSchemaerege1992";
import { Form, Formik } from "formik";
import { useIntl } from "react-intl";
import GenericInput from "../../common/GenericInput";
import { ValueSelect } from "@/typeserege1992";
import { getLanguage } from "@/helpers/utilserege1992";
import { Warehouse } from "@/types/warehouseerege1992";
import { Button } from "@nextui-org/react";
import { createOperationInstruction } from "@/services/api.operation_instructionerege1992";
import { useRouter } from "next/router";

interface Props {
  types: State[];
  id?: number;
  isFromDetails?: boolean;
  warehouses: Warehouse[];
}

const OperationInstructionFormBody = ({
  types,
  id,
  isFromDetails,
  warehouses,
}: Props) => {
  const intl = useIntl();
  const router = useRouter();
  const { locale } = router.query;
  const initialValues: OperationInstruction = {
    client_display: id ? false : false,
    internal_remark: id ? null : null,
    number_delivery: id ? "" : "",
    operation_instruction_type: id ? "" : "",
    output_plan_id: id ? 0 : 0,
    remark: null,
    type: id ? "" : "",
    user_id: id ? 0 : 0,
    warehouse_id: id ? 0 : 0,
  };

  const handleSubmit = async (values: OperationInstruction) => {
    await createOperationInstruction(values)
    router.push(`/${locale}/wms/exit_plan/`);
    
  };
  const goToEdit = () => {}
  const cancelSend = () => {}

  const getTypesFormatted = (types: State[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    types.forEach((type) => {
      response.push({
        value: type.value,
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

  return (
    <div className="user-form-body">
      <h1 className="text-xl font-semibold">
        {id
          ? isFromDetails
            ? intl.formatMessage({ id: "vizualice" })
            : intl.formatMessage({ id: "modify" })
          : intl.formatMessage({ id: "insert" })}{" "}
        {intl.formatMessage({ id: "exitPlan" })}
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
                    placeholder={intl.formatMessage({ id: "operation_instruction_type" })}
                    options={getTypesFormatted(types)}
                    customClass="select-filter"
                    isMulti={false}
                    // getValueChangeFn={getValueChange}
                    disabled={isFromDetails}
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
                    isMulti={false}
                    // getValueChangeFn={getValueChange}
                    disabled={isFromDetails}
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
    </div>
  );
};

export default OperationInstructionFormBody;
