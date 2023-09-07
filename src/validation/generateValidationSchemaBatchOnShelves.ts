import * as Yup from 'yup';
import { IntlShape } from 'react-intl';

export const generateValidationSchemaBatchOnShelves = (intl: IntlShape) => {
    return Yup.object({
      partition_id: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      shelf_id: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
      location_id: Yup.string()
        .required(intl.formatMessage({ id: 'required' })),
    });
  };