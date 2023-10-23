import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import { showMsg } from "../../../../helpers";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { StaffForm, Response } from "../../../../types";
import { StaffFormProps, CargoStationWarehouseForm, ValueSelect } from "../../../../types";
import { StaffState } from '../../../../types/staff';
import { Role } from '../../../../types/role';
import { Organization } from '../../../../types/organization';
import { generateValidationStaff, generateValidationStaffModify } from "../../../../validation/generateValidationStaff";
import { createStaff, getStaffStates, updateStaff } from "@/services/api.stafferege1992";

const getAffiliationsFormatted = (affiliationsAll: CargoStationWarehouseForm[]): ValueSelect[] => {
  let response: ValueSelect[] = [];
  affiliationsAll.forEach((affiliation) => {
    response.push({
      value: Number(affiliation.id),
      label: affiliation.name,
    });
  });
  return response;
};

const StaffFormBody = ({ id, staff, isFromDetails, staffStates, roles, organizations, affiliations }: StaffFormProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  const [filterAffiliations, setFilterAffiliations] = useState<ValueSelect[]>(id && staff ? ((staff.warehouses !== null && staff.warehouses !== undefined) ? getAffiliationsFormatted(staff.warehouses) : []) : []);

  let initialValues: StaffForm = {
    username: id && staff ? staff.username : "",
    password: "",
    chinesse_name: id && staff ? staff.chinesse_name : "",
    english_name: id && staff ? staff.english_name : "",
    email: id && staff ? staff.email : "",
    phone: id && staff ? staff.phone : "",
    observations: id && staff ? staff.observations : "",
    // @ts-ignore
    state: id && staff && staff.state ? staff.state.value : 'normal',
    organization_id:
      id && staff
        ? staff.organization_id !== null
          ? staff.organization_id
          : null
        : null,
    role_id:
      id && staff ? (staff.role_id !== null ? staff.role_id : null) : null,
    affiliations: id && staff ? ((staff.warehouses !== null && staff.warehouses !== undefined) ? staff.warehouses.map((wh: CargoStationWarehouseForm) => Number(wh.id)) : null) : null,
    default_cargo_station_id: id && staff ? (staff.default_cargo_station_id !== null ? staff.default_cargo_station_id : null) : null,
    change_password_on_login: id && staff ? staff.change_password_on_login : true,
    allow_search: id && staff ? staff.allow_search : true,
  };

  const getStaffStatesFormatted = (staffStatesAll: StaffState[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    staffStatesAll.forEach((staffState) => {
      response.push({
        value: staffState.value,
        label: getLabelByLanguage(staffState),
      });
    });
    return response;
  };

  const getLabelByLanguage = (state: StaffState) => {
    if (locale === 'es') {
      return state.es_name;
    } else if (locale === 'zh') {
      return state.zh_name;
    }
    return state.name;
  };

  const getRolesFormatted = (rolesAll: Role[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    rolesAll.forEach((role) => {
      response.push({
        value: role.id,
        label: role.name,
      });
    });
    return response;
  };

  const getOrganizationsFormatted = (organizationsAll: Organization[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    organizationsAll.forEach((organization) => {
      response.push({
        value: organization.id,
        label: organization.name,
      });
    });
    return response;
  };

  const getValueChange = (value: any) => {
    if (value !== filterAffiliations) {
      setFilterAffiliations(value)
    }
  }

  const handleSubmit = async (values: StaffForm) => {
    if (id) {
      await modify(id, values);
    } else {
      await create(values);
    }
  };

  const formatBody = (values: StaffForm): StaffForm => {
    return {
      state: values.state ? values.state : 'normal',
      organization_id: values.organization_id ? Number(values.organization_id) : null,
      role_id: values.role_id ? Number(values.role_id) : null,
      username: values.username,
      password: values.password,
      chinesse_name: values.chinesse_name,
      english_name: values.english_name,
      email: values.email,
      phone: values.phone,
      observations: values.observations,
      affiliations: values.affiliations,
      default_cargo_station_id: values.default_cargo_station_id,
      change_password_on_login: values.change_password_on_login,
      allow_search: values.allow_search
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
    router.push(`/${locale}/wms/staff`);
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/staff/${id}/update_staff`);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="user-form-body shadow-small">
      <div className="flex gap-3 flex-wrap justify-between">
        <h1 className="text-xl font-semibold">
          {id
            ? isFromDetails
              ? intl.formatMessage({ id: "vizualice" })
              : intl.formatMessage({ id: "modify" })
            : intl.formatMessage({ id: "insert" })}{" "}
          {intl.formatMessage({ id: "staff" })}
        </h1>
        <div className="flex justify-end gap-3">
          <div>
            <Button
              onClick={() => goBack()}
              color="primary"
              type="button"
              className="bg-primary px-4"
            >
              {intl.formatMessage({ id: "back" })}
            </Button>
          </div>
        </div>
      </div>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          validationSchema={id ? generateValidationStaffModify(intl) : generateValidationStaff(intl)}
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
                    disabled={!!id}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="password"
                    name="password"
                    placeholder={intl.formatMessage({ id: "password" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required={!id}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="chinesse_name"
                    placeholder={intl.formatMessage({ id: "chinese_name" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="english_name"
                    placeholder={intl.formatMessage({ id: "fullname" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="email"
                    placeholder={intl.formatMessage({ id: "email" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="phone"
                    placeholder={intl.formatMessage({ id: "phone" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="state"
                    selectLabel={intl.formatMessage({
                      id: "select_state",
                    })}
                    options={getStaffStatesFormatted(staffStates)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="organization_id"
                    selectLabel={intl.formatMessage({ id: "select_department" })}
                    options={getOrganizationsFormatted(organizations)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="role_id"
                    selectLabel={intl.formatMessage({ id: "select_role" })}
                    options={getRolesFormatted(roles)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="affiliations"
                    placeholder={intl.formatMessage({ id: "select_affiliation" })}
                    options={getAffiliationsFormatted(affiliations)}
                    customClass="select-filter"
                    isMulti={true}
                    getValueChangeFn={getValueChange}
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="default_cargo_station_id"
                    selectLabel={intl.formatMessage({
                      id: "select_default_chargo_station",
                    })}
                    options={filterAffiliations}
                    customClass="custom-input"
                    disabled={isFromDetails}
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
                    disabled={isFromDetails}
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <GenericInput
                  type="checkbox"
                  name="change_password_on_login"
                  placeholder={intl.formatMessage({ id: "login_to_force_password_update" })}
                  customClass="custom-input"
                  disabled={isFromDetails}
                />
                <GenericInput
                  type="checkbox"
                  name="allow_search"
                  placeholder={intl.formatMessage({
                    id: "allow_search",
                  })}
                  customClass="custom-input "
                  disabled={isFromDetails}
                />
              </div>

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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StaffFormBody;
