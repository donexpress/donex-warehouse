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
    fullname: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    username: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    label_code: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    password: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    contact_person: Yup.string()
      .min(2, intl.formatMessage({ id: 'initialLength' }) + '2' + intl.formatMessage({ id: 'finalLength' }))
      .required(intl.formatMessage({ id: 'required' })),
    payment_method: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    state: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    email: Yup.string()
      .email('Ingresa un correo electrónico válido')
      .required(intl.formatMessage({ id: 'required' })),
    phone_number_mobile: Yup.number()
      .typeError('Debe ser un valor numérico')
      .test('longitud', 'Debe tener 10 caracteres', val => Number(val).toString().length === 10)
      .required(intl.formatMessage({ id: 'required' })),
    phone_number: Yup.number()
      .typeError('Debe ser un valor numérico')
      .test('longitud', 'Debe tener 10 caracteres', val => Number(val).toString().length === 10)
      .required(intl.formatMessage({ id: 'required' })),
  });
};

export default generateValidationSchema;