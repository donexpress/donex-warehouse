import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

export const generateValidationSchemaStoragePlan = (intl: IntlShape) => {
    return Yup.object({
      customer_order_number: Yup.string()
        .matches(/^[a-zA-Z0-9 _-]*$/, intl.formatMessage({ id: 'customer_order_number_validation' }))
        .required(intl.formatMessage({ id: 'required' })),
      user_id: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      warehouse_id: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      rows: Yup.array().of(
        Yup.object().shape({
          box_number: Yup.string().when(['id'], (id, schema) => {
            return id !== undefined
              ? schema.required('El número de caja es obligatorio')
              : schema;
          }),
          // Agregar otras validaciones para los otros campos de la fila aquí si es necesario
        })
      ),
    });
  };