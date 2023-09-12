import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

export const generateValidationSchemaStoragePlan = (intl: IntlShape) => {
    return Yup.object({
      customer_order_number: Yup.string()
        .matches(/^[a-zA-Z0-9 _-]*$/, intl.formatMessage({ id: 'customer_order_number_validation' }))
        .required(intl.formatMessage({ id: 'required' })),
      //user_id: Yup.string()
      //  .required(intl.formatMessage({ id: 'required' })),
      warehouse_id: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      box_amount: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .positive(intl.formatMessage({ id: 'must_be_greater_than_0' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
    });
  };

export const generateValidationSchemaPackingList = (intl: IntlShape) => {
    return Yup.object({
      box_amount: Yup.number()
      .required(intl.formatMessage({ id: 'required' }))
      .positive(intl.formatMessage({ id: 'must_be_greater_than_0' }))
      .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
    });
  };