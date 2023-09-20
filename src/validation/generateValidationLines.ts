import * as Yup from "yup";
import { IntlShape } from "react-intl";

export const generateValidationLines = (intl: IntlShape) => {
  return Yup.object({
    name: Yup.string()
      .min(
        2,
        intl.formatMessage({ id: "initialLength" }) +
          "2" +
          intl.formatMessage({ id: "finalLength" })
      )
      .required(intl.formatMessage({ id: "required" })),
  });
};

export const generateValidationLinesModify = (intl: IntlShape) => {
  return Yup.object({
    name: Yup.string()
      .min(
        2,
        intl.formatMessage({ id: "initialLength" }) +
          "2" +
          intl.formatMessage({ id: "finalLength" })
      )
      .required(intl.formatMessage({ id: "required" })),
  });
};
