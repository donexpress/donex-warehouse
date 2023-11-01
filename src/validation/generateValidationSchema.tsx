import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

const generateValidationSchema = (intl: IntlShape) => {

  return Yup.object({
    username: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    password: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
  });
};

export const generateValidationSchemaUser = (intl: IntlShape) => {
  return Yup.object({
    nickname: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    username: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    // label_code: Yup.string()
    //   .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
    //   .required(intl.formatMessage({ id: 'required' })),
    password: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    // contact: Yup.string()
    //   .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
    //   .required(intl.formatMessage({ id: 'required' })),
    // payment_method: Yup.string()
    //   .required(intl.formatMessage({ id: 'required' })),
    // state: Yup.string()
    //   .required(intl.formatMessage({ id: 'required' })),
    // email: Yup.string()
    //   .email('Ingresa un correo electrónico válido')
    //   .required(intl.formatMessage({ id: 'required' })),
    // phone_number_mobile: Yup.number()
    //   .typeError('Debe ser un valor numérico')
    //   .test('longitud', 'Debe tener 10 caracteres', val => Number(val).toString().length === 10)
    //   .required(intl.formatMessage({ id: 'required' })),
    // phone: Yup.number()
    //   .typeError('Debe ser un valor numérico')
    //   .test('longitud', 'Debe tener 10 caracteres', val => Number(val).toString().length === 10)
    //   .required(intl.formatMessage({ id: 'required' })),
  });
};

export const generateValidationSchemaUserModify = (intl: IntlShape) => {
  return Yup.object({
    nickname: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    username: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
  });
};

export const generateValidationSchemaPaymentMethod = (intl: IntlShape) => {
  return Yup.object({
    code: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    name: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
  });
};

export const generateValidationSchemaUserLevel = (intl: IntlShape) => {
  return Yup.object({
    name: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    /* designated_service: Yup.string()
      .required(intl.formatMessage({ id: 'required' })), */
  });
};

export const generateValidationSchemaExitPlan = (intl: IntlShape, destinationSelected: string) => {
  return destinationSelected !== "private_address" ? Yup.object({
    warehouse_id: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    user_id: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    delivered_time: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    address: Yup.string()
      .required(intl.formatMessage({ id: 'required' }))
  }) :  Yup.object({
    warehouse_id: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    user_id: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    address: Yup.string()
      .required(intl.formatMessage({ id: 'required' }))
  });
};

export const generateValidationSchemaOperationinstruction = (intl: IntlShape) => {
  return Yup.object({
    warehouse_id: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    user_id: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
  });
};

export default generateValidationSchema;