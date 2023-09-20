import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import { showMsg } from "../../../../helpers";
import { useRouter } from "next/router";
import {
  generateValidationSchemaUser,
  generateValidationSchemaUserModify,
} from "../../../../validation/generateValidationSchema";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { UserForm, Response, ValueSelect } from "../../../../types";
import { createUser, updateUser } from "@/services/api.userserege1992";
import { UserFormProps } from "../../../../types";

const UserFormBody = ({
  id,
  user,
  isFromShowUser,
  staffList,
  regionalDivisionList,
  subsidiarieList,
  warehouseList,
  userLevelList,
  paymentMethodList,
  userStateList,
}: UserFormProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  const [staff, setStaff] = useState<{ value: number; label: string }[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<
    { value: number; label: string }[]
  >([]);
  const [regionalDivisions, setRegionalDivisions] = useState<
    { value: number; label: string }[]
  >([]);
  const [warehouses, setWarehouses] = useState<
    { value: number; label: string }[]
  >([]);
  const [userLevels, setUserLevels] = useState<
    { value: number; label: string }[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { value: number; label: string }[]
  >([]);

  let initialValues: UserForm = {
    nickname: id && user ? user.nickname : "",
    username: id && user ? user.username : "",
    label_code: id && user ? user.label_code : "",
    password: "",
    payment_method_id:
      id && user
        ? user.payment_method_id !== null
          ? user.payment_method_id
          : null
        : null,
    // @ts-ignore
    state: id && user && user.user_state ? user.user_state.value : 'normal',
    contact: id && user ? user.contact : "",
    company: id && user ? user.company : "",
    email: id && user ? user.email : "",
    phone_number: id && user ? user.phone_number : "",
    phone: id && user ? user.phone : "",
    qq: id && user ? user.qq : "",
    user_level_id:
      id && user
        ? user.user_level_id !== null
          ? user.user_level_id
          : null
        : null,
    credits: "",
    finantial_representative:
      id && user
        ? user.finantial_representative !== null
          ? user.finantial_representative
          : null
        : null,
    client_service_representative:
      id && user
        ? user.client_service_representative !== null
          ? user.client_service_representative
          : null
        : null,
    sales_representative:
      id && user
        ? user.sales_representative !== null
          ? user.sales_representative
          : null
        : null,
    sales_source:
      id && user
        ? user.sales_source !== null
          ? user.sales_source
          : null
        : null,
    subsidiary_id:
      id && user
        ? user.subsidiary_id !== null
          ? user.subsidiary_id
          : null
        : null,
    regional_division_id:
      id && user
        ? user.regional_division_id !== null
          ? user.regional_division_id
          : null
        : null,
    warehouse_id:
      id && user
        ? user.warehouse_id !== null
          ? user.warehouse_id
          : null
        : null,
    observations: id && user ? user.observations : "",
    shipping_control: id && user ? user.shipping_control : false,
    hidde_transfer_order: id && user ? user.hidde_transfer_order : false,
    reset_password: id && user ? user.reset_password : false,
  };

  useEffect(() => {
    setStaff(
      staffList.map((el) => {
        return { value: el.id, label: (el.username + (el.english_name && el.english_name !== '' ? ` (${el.english_name})` : '')) };
      })
    );
    setSubsidiaries(
      subsidiarieList.map((el) => {
        return { value: el.id, label: el.name };
      })
    );
    setRegionalDivisions(
      regionalDivisionList.map((el) => {
        return { value: el.id, label: el.name };
      })
    );
    setWarehouses(
      warehouseList.map((el) => {
        return { value: el.id, label: el.name };
      })
    );
    setPaymentMethods(
      paymentMethodList.map((el) => {
        return { value: el.id, label: el.name };
      })
    );
    setUserLevels(
      userLevelList.map((el) => {
        return { value: el.id, label: el.name };
      })
    );
  }, []);

  const getUserStatesFormatted = (userStatesAll: any[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    userStatesAll.forEach((userState) => {
      response.push({
        value: userState.value,
        label: getLabelByLanguage(userState),
      });
    });
    return response;
  };

  const getLabelByLanguage = (state: any) => {
    if (locale === 'es') {
      return state.es_name;
    } else if (locale === 'zh') {
      return state.zh_name;
    }
    return state.name;
  };

  const handleSubmit = async (values: UserForm) => {
    if (id) {
      await modify(id, values);
    } else {
      await create(values);
    }
  };

  const formatBody = (values: UserForm): UserForm => {
    return {
      ...values,
      payment_method_id: values.payment_method_id
        ? Number(values.payment_method_id)
        : null,
      state: values.state ? values.state : 'normal',
      user_level_id: values.user_level_id ? Number(values.user_level_id) : null,
      finantial_representative: values.finantial_representative
        ? Number(values.finantial_representative)
        : null,
      client_service_representative: values.client_service_representative
        ? Number(values.client_service_representative)
        : null,
      sales_representative: values.sales_representative
        ? Number(values.sales_representative)
        : null,
      sales_source: values.sales_source ? Number(values.sales_source) : null,
      subsidiary_id: values.subsidiary_id ? Number(values.subsidiary_id) : null,
      regional_division_id: values.regional_division_id
        ? Number(values.regional_division_id)
        : null,
      warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
    };
  };

  const create = async (values: UserForm) => {
    const response: Response = await createUser(formatBody(values));
    treatmentToResponse(response);
  };

  const modify = async (userId: number, values: UserForm) => {
    const response: Response = await updateUser(userId, formatBody(values));
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/users`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      if (response.status === 409) {
        message = intl.formatMessage({ id: "username_email_already_exists" });
        if (response.data && response.data.message && (response.data.message === "username already exists")) {
          message = intl.formatMessage({ id: "username_already_exists" });
        } else if (response.data && response.data.message && (response.data.message === "email already exists")) {
          message = intl.formatMessage({ id: "email_already_exists" });
        }
      }
      showMsg(message, { type: "error" });
    }
  };

  const cancelSend = () => {
    router.push(`/${locale}/wms/users`);
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/users/${id}/update_user`);
  };
  return (
    <div className="user-form-body shadow-small">
      <h1 className="text-xl font-semibold">
        {id
          ? isFromShowUser
            ? intl.formatMessage({ id: "vizualice" })
            : intl.formatMessage({ id: "modify" })
          : intl.formatMessage({ id: "insert" })}{" "}
        {intl.formatMessage({ id: "user" })}
      </h1>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          validationSchema={
            id
              ? generateValidationSchemaUserModify(intl)
              : generateValidationSchemaUser(intl)
          }
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="nickname"
                    placeholder={intl.formatMessage({ id: "nickname" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="username"
                    placeholder={intl.formatMessage({ id: "username" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="password"
                    name="password"
                    placeholder={intl.formatMessage({ id: "password" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                    required={!id}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="label_code"
                    placeholder={intl.formatMessage({ id: "label_code" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="payment_method_id"
                    selectLabel={intl.formatMessage({
                      id: "select_payment_method",
                    })}
                    options={paymentMethods}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="state"
                    selectLabel={intl.formatMessage({ id: "select_state" })}
                    options={getUserStatesFormatted(userStateList)}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="contact"
                    placeholder={intl.formatMessage({ id: "contact" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="company"
                    placeholder={intl.formatMessage({ id: "company" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="email"
                    placeholder={intl.formatMessage({ id: "email" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="phone_number"
                    placeholder={intl.formatMessage({ id: "mobile_phone" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="phone"
                    placeholder={intl.formatMessage({ id: "phone" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="qq"
                    placeholder={intl.formatMessage({ id: "qq" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="user_level_id"
                    selectLabel={intl.formatMessage({
                      id: "select_user_level",
                    })}
                    options={userLevels}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="credits"
                    placeholder={intl.formatMessage({ id: "credits" })}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="finantial_representative"
                    selectLabel={intl.formatMessage({
                      id: "select_financial_representative",
                    })}
                    options={staff}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="client_service_representative"
                    selectLabel={intl.formatMessage({
                      id: "select_customer_service_representative",
                    })}
                    options={staff}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="sales_representative"
                    selectLabel={intl.formatMessage({
                      id: "select_sales_representative",
                    })}
                    options={staff}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="sales_source"
                    selectLabel={intl.formatMessage({
                      id: "select_source_sales",
                    })}
                    options={staff}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="subsidiary_id"
                    selectLabel={intl.formatMessage({
                      id: "select_subsidiary",
                    })}
                    options={subsidiaries}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="regional_division_id"
                    selectLabel={intl.formatMessage({
                      id: "select_reception_area",
                    })}
                    options={regionalDivisions}
                    customClass="custom-input"
                    disabled={isFromShowUser}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="warehouse_id"
                    selectLabel={intl.formatMessage({ id: "select_site" })}
                    options={warehouses}
                    customClass="custom-input"
                    disabled={isFromShowUser}
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
                    disabled={isFromShowUser}
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <GenericInput
                  type="checkbox"
                  name="shipping_control"
                  placeholder={intl.formatMessage({ id: "shipping_control" })}
                  customClass="custom-input"
                  disabled={isFromShowUser}
                />
                <GenericInput
                  type="checkbox"
                  name="hidde_transfer_order"
                  placeholder={intl.formatMessage({
                    id: "hide_transfer_order",
                  })}
                  customClass="custom-input "
                  disabled={isFromShowUser}
                />
                <GenericInput
                  type="checkbox"
                  name="reset_password"
                  placeholder={intl.formatMessage({ id: "reset_password" })}
                  customClass="custom-input "
                  disabled={isFromShowUser}
                />
              </div>

              <div className="flex justify-end gap-3">
                <div>
                  {!isFromShowUser && (
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
                  {isFromShowUser && id && (
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

export default UserFormBody;
