import * as Yup from "yup";
import { IntlShape } from "react-intl";

export const generateValidationStaff = (intl: IntlShape) => {
  return Yup.object({
    username: Yup.string()
      .min(
        2,
        intl.formatMessage({ id: "initialLength" }) +
          "2" +
          intl.formatMessage({ id: "finalLength" })
      )
      .required(intl.formatMessage({ id: "required" })),
    password: Yup.string()
      .required(intl.formatMessage({ id: "required" })),
  });
};

export const generateValidationStaffModify = (intl: IntlShape) => {
  return Yup.object({
    username: Yup.string()
      .min(
        2,
        intl.formatMessage({ id: "initialLength" }) +
          "2" +
          intl.formatMessage({ id: "finalLength" })
      )
      .required(intl.formatMessage({ id: "required" })),
  });
};
