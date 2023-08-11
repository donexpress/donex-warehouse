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

export default generateValidationSchema;