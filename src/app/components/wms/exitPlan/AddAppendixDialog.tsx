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

interface Props {
  close: () => any;
  confirm: () => any;
  title: string;
  owner: User;
  exitPlan: ExitPlan;
}

const AddAppendixDialog = ({
  close,
  confirm,
  title,
  exitPlan,
  owner,
}: Props) => {
  const intl = useIntl();
  const [initialValues, setInitialValues] = useState({
    name: "",
    user: owner.nickname,
    exit_plan: exitPlan.output_number ? exitPlan.output_number : '',
    function: "",
    url: "",
  });

  const uploadImageClient = (imagePath: string) => {
    console.log(imagePath);
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
    const appendix: Appendix = {
        name: values.name,
        user_id: owner.id,
        output_plan_id: exitPlan.id ? exitPlan.id : -1,
        function: values.function,
        url: values.url
    }
    const response = await createAppendix(appendix);
    confirm()
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
                    <ImageUploader onImageUpload={uploadImageClient}>
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
                      disabled={initialValues.url === ""}
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

export default AddAppendixDialog;