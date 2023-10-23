import React from "react";
import { Button } from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import { showMsg, isOMS, isWMS } from "../../../../helpers";
import { useRouter } from "next/router";
import { generateValidationSchemaUserLevel } from "../../../../validation/generateValidationSchema";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { Response, ValueSelect } from "../../../../types";
import {
  createUserLevel,
  updateUserLevelById,
} from "../../../../services/api.user_level";
import { UserLevelProps, UserLevel } from "../../../../types/user_levels";
import { Service } from "../../../../types/service";

const UserLevelFormBody = ({
  services,
  id,
  userLevel,
  isFromDetails,
}: UserLevelProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  const initialValues: UserLevel = {
    name: id && userLevel ? userLevel.name : "",
    service_id: id && userLevel ? userLevel.service_id : null,
    observations: id && userLevel ? userLevel.observations : "",
  };

  const cancelSend = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms/user_levels`);
    }
  };

  const getServicesFormatted = (servicesAll: Service[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    servicesAll.forEach((service) => {
      response.push({
        value: service.id,
        label: service.name,
      });
    });
    return response;
  };

  const formatBody = (values: UserLevel): UserLevel => {
    return {
      ...values,
      service_id: values.service_id ? Number(values.service_id) : null,
    };
  };

  const handleSubmit = async (values: UserLevel) => {
    if (isWMS()) {
      if (id) {
        await modify(id, values);
      } else {
        await create(values);
      }
    }
  };

  const create = async (values: UserLevel) => {
    const response: Response = await createUserLevel(formatBody(values));
    treatmentToResponse(response);
  };

  const modify = async (userLevelId: number, values: UserLevel) => {
    const response: Response = await updateUserLevelById(
      userLevelId,
      formatBody(values)
    );
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/user_levels`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/user_levels/${id}/update`);
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
          {intl.formatMessage({ id: "userLevel" })}
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
          validationSchema={generateValidationSchemaUserLevel(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="name"
                    placeholder={intl.formatMessage({ id: "name" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="service_id"
                    selectLabel={intl.formatMessage({
                      id: "select_designated_service",
                    })}
                    options={getServicesFormatted(services)}
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

export default UserLevelFormBody;
