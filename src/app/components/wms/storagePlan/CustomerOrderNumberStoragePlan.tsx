import React, { ChangeEvent } from 'react';
import GenericInput from '../../common/GenericInput';
import '../../../../styles/wms/user.form.scss';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';

interface RowStoragePlanProps {
    isFromDetails: boolean;
    changeCustomerOrderNumber: (cON: string) => any;
}

const CustomerOrderNumberStoragePlan: React.FC<RowStoragePlanProps> = ({ isFromDetails = false, changeCustomerOrderNumber }) => {
    const intl = useIntl();
    const formik = useFormikContext();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      // @ts-ignore
      const { name, value, type, checked } = event.target;
      const fieldValue = type === "checkbox" ? checked : value;

      if (name === 'customer_order_number') {
        changeCustomerOrderNumber(fieldValue);
        formik.setFieldValue('prefix_expansion_box_number', fieldValue);
      }
    }

  return (
        <GenericInput
          type="text"
          name="customer_order_number"
          placeholder={intl.formatMessage({ id: 'customer_order_number' })}
          customClass="custom-input"
          disabled={ isFromDetails }
          onChangeFunction={handleInputChange}
          required
        />
  );
};

export default CustomerOrderNumberStoragePlan;