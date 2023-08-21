import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

export const generateValidationSchemaWH = (intl: IntlShape) => {
    return Yup.object({
      code: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      name: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      contact: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      country: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      address_1: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
    });
  };