import React from "react";
import "../../../styles/login.scss";
import Image from "next/image";
import logoDE from "../../../assets/icons/logo_desktop.svg";
import logoA2A56 from "../../../assets/icons/logo_a2a56.png";
import { Formik, Form } from "formik";
import GenericInput from "./GenericInput";
import { useIntl } from "react-intl";
import { AppProps, LoginBody, LoginResponse } from "../../../types";
import { Profile, ProfileAdmin } from '../../../types/profile';
import "../../../styles/common.scss";
import SelectLanguage from "./SelectLanguage";
import generateValidationSchema from "../../../validation/generateValidationSchema";
import { login, indexProfile } from "../../../services/api.users";
import { setCookie } from "../../../helpers/cookieUtils";
import { showMsg } from "../../../helpers";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";

const LoginBody = ({ inWMS, inOMS }: AppProps) => {
  const router = useRouter();
  const intl = useIntl();

  const initialValues: LoginBody = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values: LoginBody) => {
    const response: LoginResponse = await login(values);
    const { locale } = router.query;
    if (
      response.status >= 200 &&
      response.status <= 299 &&
      response.token !== undefined
    ) {
      if (inWMS) {
        setCookie("tokenWMS", response.token);
      } else {
        setCookie("tokenOMS", response.token);
      }

      const profile: Profile | null = await indexProfile();
      if (profile !== null) {
        showMsg(intl.formatMessage({ id: "successLoginMsg" }), {
          type: "success",
        });
  
        if (inWMS) {
          const role = (profile as ProfileAdmin).role.type;
          setCookie("profileWMS", profile);
          if (role === 'FINANCE') {
            router.push(`/${locale}/wms/manifest`);
          } else {
            router.push(`/${locale}/wms`);
          }
        } else {
          setCookie("profileOMS", profile);
          router.push(`/${locale}/oms`);
        }
      } else {
        let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
        showMsg(message, { type: "error" });
      }
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      if (response.status === 401) {
        message = intl.formatMessage({ id: "dontExistUserPasswordMsg" });
        if (response.message === "We have a problem with this user. Please contact an administrator for a solution.") {
          message = intl.formatMessage({ id: "user_with_problem" });
        }
      }
      showMsg(message, { type: "error" });
    }
  };

  return (
    <div className="login-body scrollable-hidden elements-center">
      <div className="login-body__background">
        <div className="login-body__stuffed">
          <div className="login-body__low-background"></div>
        </div>
      </div>
      <div className="login-body__container-language">
        <SelectLanguage isFromLogin={true} />
      </div>
      <div className="login-body__container">
        <div className="elements-center">
          <Image src={logoDE} alt="" className="login-body__logo" />
          <div className="black-label login-body__enterprise-name">
            Don Express Warehouse {inWMS && "WMS"}
            {inOMS && "OMS"}
          </div>
        </div>
        {inWMS && (
          <div className="note-wms">
            <b>{intl.formatMessage({ id: "wmsLoginNoteMain" })}</b>{" "}
            {intl.formatMessage({ id: "wmsLoginNoteSecondary" })}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={generateValidationSchema(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <GenericInput
                type="text"
                name="username"
                placeholder={intl.formatMessage({ id: "username" })}
                customClass="custom-input"
                hasRepresentativeIcon={true}
                isUserField={true}
                required
              />
              <GenericInput
                type="password"
                name="password"
                placeholder={intl.formatMessage({ id: "password" })}
                customClass="custom-input"
                hasRepresentativeIcon={true}
                isPasswordField={true}
                required
              />
              <Button
                color="primary"
                className="px-4 w-full"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting
                  ? intl.formatMessage({ id: "sending" })
                  : intl.formatMessage({ id: "login" })}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginBody;
