import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

export const generateValidationSchemaShelf = (intl: IntlShape) => {
    return Yup.object({
      column_ammount: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .positive(intl.formatMessage({ id: 'must_be_greater_than_0' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
      layers: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .positive(intl.formatMessage({ id: 'must_be_greater_than_0' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
      number_of_shelves: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .positive(intl.formatMessage({ id: 'must_be_greater_than_0' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
      high_inventory: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
      location_length: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
      location_width: Yup.number()
        .required(intl.formatMessage({ id: 'required' }))
        .integer(intl.formatMessage({ id: 'must_be_an_integer' })),
    });
  };