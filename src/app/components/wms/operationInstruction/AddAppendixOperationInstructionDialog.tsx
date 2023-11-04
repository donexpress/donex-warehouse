import React, { useState } from "react";
import { useIntl } from "react-intl";
import GenericInput from "../../common/GenericInput";
import { Form, Formik } from "formik";
import { Button } from "@nextui-org/react";
import ImageUploader from "../../common/ImageUploader";
import { FaFileUpload } from "react-icons/fa";
import { User } from "../../../../types/user";
import { ExitPlan } from "../../../../types/exit_plan";
import { createAppendix } from "@/services/api.appendixerege1992";
import { Appendix } from "@/types/appendixerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { isWMS } from "@/helperserege1992";

interface Props {
  close: () => any;
  confirm: () => any;
  title: string;
  owner?: User;
  operationInstruction?: OperationInstruction;
}

const AddAppendixOperationInstructionDialog = ({
  close,
  confirm,
  title,
  owner,
  operationInstruction,
}: Props) => {
  const intl = useIntl();

  const calcExitplan = (): string => {
    if (
      operationInstruction &&
      operationInstruction.output_plan &&
      operationInstruction.output_plan.output_number
    ) {
      return operationInstruction.output_plan.output_number;
    }
    return "";
  };
  const [initialValues, setInitialValues] = useState({
    name: "",
    user: owner ? owner.nickname: 'tmp_operation_instruction',
    exit_plan: calcExitplan(),
    function: "",
    url: "",
  });

  const uploadImageClient = (imagePath: string) => {
    let name = initialValues.name;
    if (name === "") {
      const name_arr = imagePath.split("/");
      name = name_arr[name_arr.length - 1];
    }
    setInitialValues({ ...initialValues, url: imagePath, name });
  };

  const handleSubmit = async (values: {
    name: string;
    user: string;
    exit_plan: string;
    function: string;
    url: string;
  }) => {
    let appendix: Appendix | null = null;
      appendix = {
        name: values.name,
        user_id: owner ? owner.id : -1,
        function: values.function,
        url: values.url,
        operation_instruction_id: operationInstruction ? operationInstruction.id: -1,
        is_owner_admin: isWMS() ? true : false
      };
    if (appendix) {
      const response = await createAppendix(appendix);
      confirm();
    }
  };

  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card" style={{ width: "500px" }}>
        <div className="confirmation_card_header black-label">
          <strong>{title}</strong>
        </div>
        <div className="flex justify-center my-4  black-label elements-center">
          <div className="user-form-body__container">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, isValid }) => (
                <Form className="flex flex-col gap-3">
                  <div className="flex gap-3 flex-wrap justify-between">
                    <div className="w-full sm:w-[48%]">
                      <GenericInput
                        type="text"
                        name="name"
                        placeholder={intl.formatMessage({
                          id: "name",
                        })}
                        customClass="custom-input"
                      />
                    </div>
                    <div className="w-full sm:w-[48%]">
                      <GenericInput
                        type="text"
                        disabled
                        name="user"
                        placeholder={intl.formatMessage({
                          id: "user",
                        })}
                        customClass="custom-input"
                      />
                    </div>
                    <div className="w-full sm:w-[48%]">
                      <GenericInput
                        type="text"
                        name="exit_plan"
                        disabled
                        placeholder={intl.formatMessage({
                          id: "exitPlan",
                        })}
                        customClass="custom-input"
                      />
                    </div>
                    <div className="w-full sm:w-[48%]">
                      <GenericInput
                        type="text"
                        name="function"
                        placeholder={intl.formatMessage({
                          id: "function",
                        })}
                        customClass="custom-input"
                      />
                    </div>
                    <ImageUploader isFile onImageUpload={uploadImageClient}>
                      <div
                        className="upload_button"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FaFileUpload style={{ marginRight: "5px" }} />
                        {intl.formatMessage({
                          id: initialValues.url ? "modify" : "upload",
                        })}
                      </div>
                    </ImageUploader>
                  </div>
                  <div className="elements-row-end">
                    <Button
                      color="primary"
                      type="submit"
                      className="px-4"
                      // disabled={initialValues.url === ""}
                      style={{ marginRight: "15px" }}
                    >
                      {intl.formatMessage({ id: "confirmation_header" })}
                    </Button>
                    <Button
                      onClick={close}
                      type="button"
                      className="bg-secundary px-4"
                    >
                      {intl.formatMessage({ id: "cancel" })}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppendixOperationInstructionDialog;
