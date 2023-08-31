import React, { ChangeEvent } from 'react';
import GenericInput from '../../common/GenericInput';
import '../../../../styles/wms/user.form.scss';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';

interface RowStoragePlanProps {
  isFromDetails: boolean;
}

const CheckboxesStoragePlan: React.FC<RowStoragePlanProps> = ({ isFromDetails = false }) => {
    const intl = useIntl();
    const formik = useFormikContext();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      // @ts-ignore
      const { name, value, type, checked } = event.target;
      const fieldValue = type === "checkbox" ? checked : value;

      if (name === 'return') {
        if (fieldValue) {
          formik.setFieldValue('rejected_boxes', false);
        }
      } else if (name === 'rejected_boxes') {
        if (fieldValue) {
          formik.setFieldValue('return', false);
        }
      }
    }

  return (
    <div className="flex gap-3 flex-wrap">
        <GenericInput
          type="checkbox"
          name="return"
          placeholder={intl.formatMessage({ id: "return" })}
          customClass="custom-input"
          disabled={isFromDetails}
          onChangeFunction={handleInputChange}
        />
        <GenericInput
          type="checkbox"
          name="rejected_boxes"
          placeholder={intl.formatMessage({
            id: "rejected_boxes",
          })}
          customClass="custom-input "
          disabled={isFromDetails}
          onChangeFunction={handleInputChange}
        />
    </div>
  );
};

export default CheckboxesStoragePlan;