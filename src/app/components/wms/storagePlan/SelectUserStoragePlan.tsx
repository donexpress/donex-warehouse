import React, { ChangeEvent } from 'react';
import GenericInput from '../../common/GenericInput';
import '../../../../styles/wms/user.form.scss';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Warehouse } from '../../../../types/warehouse';
import { ValueSelect } from '../../../../types';
import { User } from '../../../../types/user';

interface RowStoragePlanProps {
    warehouses: Warehouse[];
    users: User[];
    options: ValueSelect[];
    isFromDetails: boolean;
    changeWarehouse: (warehouseId: number) => any;
}

const SelectUserStoragePlan: React.FC<RowStoragePlanProps> = ({ isFromDetails = false, options, warehouses, users, changeWarehouse }) => {
    const intl = useIntl();
    const formik = useFormikContext();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      // @ts-ignore
      const { name, value, type, checked } = event.target;
      const fieldValue = type === "checkbox" ? checked : value;

      if (name === 'user_id') {console.log(fieldValue)
        const filterUser = users.filter((user: User) => user.id === Number(fieldValue));
        if (filterUser.length > 0) {
            if (filterUser[0].warehouse) {
                const filterWarehouse = warehouses.filter((warehouse: Warehouse) => warehouse.id === filterUser[0].warehouse?.id);
                if (filterWarehouse.length > 0) {
                    changeWarehouse(Number(filterWarehouse[0].id));
                    formik.setFieldValue('warehouse_id', Number(filterWarehouse[0].id));
                } else {
                    changeWarehouse(-1);
                }
            } else {
                changeWarehouse(-1);
            }
        } else {
            changeWarehouse(-1);
        }
      }
    }

  return (
        <GenericInput
            type="select"
            name="user_id"
            selectLabel={intl.formatMessage({ id: 'select_user' })}
            options={options}
            customClass="custom-input"
            disabled={ isFromDetails }
            onChangeFunction={handleInputChange}
        />
  );
};

export default SelectUserStoragePlan;