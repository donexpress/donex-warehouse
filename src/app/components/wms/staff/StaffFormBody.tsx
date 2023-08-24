import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import { showMsg } from "../../../../helpers";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { StaffForm, Response } from "../../../../types";
import { StaffFormProps } from "../../../../types";
import { generateValidationStaff } from "../../../../validation/generateValidationStaff";
import { createStaff, updateStaff } from "@/services/api.stafferege1992";

const StaffFormBody = ({ id, staff, isFromShowStaff }: StaffFormProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  let initialValues: StaffForm = {
    username: id && staff ? staff.username : "",
    chinesse_name: id && staff ? staff.chinesse_name : "",
    english_name: id && staff ? staff.english_name : "",
    email: id && staff ? staff.email : "",
    phone: id && staff ? staff.phone : "",
    observations: id && staff ? staff.observations : "",
    state_id:
      id && staff ? (staff.state_id !== null ? staff.state_id : null) : null,
    organization_id:
      id && staff
        ? staff.organization_id !== null
          ? staff.organization_id
          : null
        : null,
    role_id:
      id && staff ? (staff.role_id !== null ? staff.role_id : null) : null,
  };

  const handleSubmit = async (values: StaffForm) => {
    if (id) {
      await modify(id, values);
    } else {
      await create(values);
    }
  };

  const formatBody = (values: StaffForm): StaffForm => {
    return {
      ...values,
      state_id: values.state_id ? Number(values.state_id) : null,
      organization_id: values.state_id ? Number(values.organization_id) : null,
      role_id: values.state_id ? Number(values.role_id) : null,
    };
  };

  const create = async (values: StaffForm) => {
    const response: Response = await createStaff(formatBody(values));
    treatmentToResponse(response);
  };

  const modify = async (staffId: number, values: StaffForm) => {
    const response: Response = await updateStaff(staffId, formatBody(values));
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/staff`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const cancelSend = () => {
    router.push(`/${locale}/wms/staff`);
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/staff/${id}/update_staff`);
  };
  return (
    <div className="user-form-body shadow-small">
      <h1 className="text-xl font-semibold">
        {id
          ? isFromShowStaff
            ? intl.formatMessage({ id: "vizualice" })
            : intl.formatMessage({ id: "modify" })
          : intl.formatMessage({ id: "insert" })}{" "}
        {intl.formatMessage({ id: "staff" })}
      </h1>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          validationSchema={generateValidationStaff(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="username"
                    placeholder={intl.formatMessage({ id: "username" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="chinesse_name"
                    placeholder={intl.formatMessage({ id: "chinesse_name" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="english_name"
                    placeholder={intl.formatMessage({ id: "english_name" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="email"
                    placeholder={intl.formatMessage({ id: "email" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="phone"
                    placeholder={intl.formatMessage({ id: "phone" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>

                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="password"
                    name="password"
                    placeholder={intl.formatMessage({ id: "password" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                    required={!id}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="state_id"
                    selectLabel={intl.formatMessage({
                      id: "state_id",
                    })}
                    options={[]}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="organization_id"
                    selectLabel={intl.formatMessage({ id: "organization_id" })}
                    options={[]}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="role_id"
                    selectLabel={intl.formatMessage({ id: "role_id" })}
                    options={[]}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="w-full">
                  <GenericInput
                    type="textarea"
                    name="observations"
                    placeholder={intl.formatMessage({ id: "observations" })}
                    customClass="custom-input"
                    disabled={isFromShowStaff}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <div>
                  {!isFromShowStaff && (
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
                  {isFromShowStaff && id && (
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StaffFormBody;
