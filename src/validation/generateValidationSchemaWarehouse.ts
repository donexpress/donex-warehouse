import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

export const generateValidationSchemaWarehouse = (intl: IntlShape) => {
    return Yup.object({
      name: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      english_name: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      receiving_area: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      principal: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      contact_phone: Yup.number()
        .typeError('Debe ser un valor numérico')
        .test('longitud', 'Debe tener 10 caracteres', val => Number(val).toString().length === 10)
        .required(intl.formatMessage({ id: 'required' })),
      stateId: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      address: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      city: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      province: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      country: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      cp: Yup.number()
        .typeError('Debe ser un valor numérico')
        .test('longitud', 'Debe tener 5 caracteres', val => Number(val).toString().length === 5)
        .required(intl.formatMessage({ id: 'required' })),
      shared_warehouse_system_code: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      shared_warehouse_docking_code: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      customer_order_number_rules: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
    });
  };