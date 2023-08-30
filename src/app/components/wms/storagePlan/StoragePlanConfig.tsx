import React, { useState, ChangeEvent } from 'react';
import { Button } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaStoragePlan } from '../../../../validation/generateValidationSchemaStoragePlan';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { Response, ValueSelect } from '../../../../types';
import { createStoragePlan, updateStoragePlanById } from '../../../../services/api.storage_plan';
import { createPackingList } from '../../../../services/api.packing_list';
import { StoragePlanProps, StoragePlan, PackingList, BoxNumberLabelFn } from '../../../../types/storage_plan';
import { User } from '../../../../types/user';
import { Warehouse } from '../../../../types/warehouse';
import RowStoragePlan from '../../common/RowStoragePlan';
import RowStoragePlanHeader from '../../common/RowStoragePlanHeader';

const StoragePlanConfig = ({ users, warehouses, id, storagePlan, isFromDetails }: StoragePlanProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [rows, setRows] = useState<PackingList[]>([]);
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/storage_plan`);
          }
      };

      const getUsersFormatted = (usersAll: User[]): ValueSelect[] => {
        let response: ValueSelect[] = [];
        usersAll.forEach((user) => {
          response.push({
            value: user.id,
            label: user.customer_number + ' - ' +  user.username
          });
        })
        return response;
      };

      const getWarehousesFormatted = (warehouseAll: Warehouse[]): ValueSelect[] => {
        let response: ValueSelect[] = [];
        warehouseAll.forEach((warehouse) => {
          response.push({
            value: Number(warehouse.id),
            label: warehouse.name + ` (${warehouse.code})`
          });
        })
        return response;
      };

      const goToEdit = () => {
        router.push(`/${locale}/wms/storage_plan/${id}/update`)
      };

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <h1 className="text-xl font-semibold">
              {intl.formatMessage({ id: "config" })}
              {" "}
              {intl.formatMessage({ id: 'storagePlan' })}
            </h1>
            <div className='user-form-body__container'>
                
            </div>
        </div>
    );
};
  
export default StoragePlanConfig;