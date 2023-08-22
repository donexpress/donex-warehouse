import React from 'react';
import '../../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaStoragePlan } from '../../../../validation/generateValidationSchemaStoragePlan';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { Response, ValueSelect } from '../../../../types';
import { createStoragePlan, updateStoragePlanById } from '../../../../services/api.storage_plan';
import { StoragePlanProps, StoragePlan } from '../../../../types/storage_plan';
import { User } from '../../../../types/user';
import { Warehouse } from '../../../../types/warehouse';

const StoragePlanFormBody = ({ users, warehouses, id, storagePlan, isFromDetails }: StoragePlanProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    
    const initialValues: StoragePlan = {
        customer_order_number: (id && storagePlan) ? storagePlan.customer_order_number : '',
        user_id: (id && storagePlan) ? storagePlan.user_id : null,
        warehouse_id: (id && storagePlan) ? storagePlan.warehouse_id : null,
        boxes_count: (id && storagePlan) ? storagePlan.boxes_count : 0,
        delivery_time: (id && storagePlan) ? storagePlan.delivery_time : '',
        observations: (id && storagePlan) ? storagePlan.observations : ''
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/storagePlan`);
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
  
      const formatBody = (values: StoragePlan): StoragePlan => {
        return {
                ...values, 
                user_id: values.user_id ? Number(values.user_id) : null,
                warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
              };
      }
  
      const handleSubmit = async (values: StoragePlan) => {
          if (isWMS()) {
            if (id) {
              await modify(id, values);
            } else {
              await create(values);
            }
          }
      };

      const create = async (values: StoragePlan) => {
        const response: Response = await createStoragePlan(formatBody(values));
        treatmentToResponse(response);
      }
    
      const modify = async (storagePlanId: number, values: StoragePlan) => {
        const response: Response = await updateStoragePlanById(storagePlanId, formatBody(values));
        treatmentToResponse(response);
      }

      const treatmentToResponse = (response: Response) => {
        if (response.status >= 200 && response.status <= 299) {
          const message = id ? intl.formatMessage({ id: 'changedsuccessfullyMsg' }) : intl.formatMessage({ id: 'successfullyMsg' });
          showMsg(message, { type: "success" });
          router.push(`/${locale}/wms/storagePlan`);
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      }

      const goToEdit = () => {
        router.push(`/${locale}/wms/storagePlan/${id}/update`)
      };

    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>{id ? (isFromDetails ? intl.formatMessage({ id: 'vizualice' }) : intl.formatMessage({ id: 'modify' })) : intl.formatMessage({ id: 'insert' })} {intl.formatMessage({ id: 'storagePlan' })}</b></div>
                <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaStoragePlan(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <div className='user-form-body__form'>
                          <GenericInput
                            type="text"
                            name="customer_order_number"
                            placeholder={intl.formatMessage({ id: 'customer_order_number' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="select"
                            name="user_id"
                            selectLabel={intl.formatMessage({ id: 'select_user' })}
                            options={getUsersFormatted(users)}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="select"
                            name="warehouse_id"
                            selectLabel={intl.formatMessage({ id: 'select_warehouse' })}
                            options={getWarehousesFormatted(warehouses)}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="number"
                            name="boxes_count"
                            placeholder={intl.formatMessage({ id: 'number_of_boxes' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="date"
                            name="delivery_time"
                            placeholder={intl.formatMessage({ id: 'delivery_time' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                      </div>
                      <GenericInput
                        type="textarea"
                        name="observations"
                        placeholder={intl.formatMessage({ id: 'observations' })}
                        customClass="custom-input"
                        disabled={ isFromDetails }
                      />
                      <div className='user-form-body__buttons'>
                        <div>
                          {
                            !isFromDetails &&
                            (
                              <button
                                type="submit"
                                className='user-form-body__accept_button'
                                disabled={isSubmitting || !isValid}
                              >
                                {isSubmitting ? intl.formatMessage({ id: 'sending' }) : (id ? intl.formatMessage({ id: 'modify' }) : intl.formatMessage({ id: 'add' }))}
                              </button>
                            )
                          }
                          {
                            isFromDetails && id && (
                              <button
                                type="button"
                                className='user-form-body__accept_button'
                                onClick={()=>goToEdit()}
                              >
                                {intl.formatMessage({ id: 'go_to_edit' })}
                              </button>
                            )
                          }
                        </div>
                        <div>
                          <button
                            type="button"
                            className='user-form-body__cancel'
                            onClick={()=>cancelSend()}
                          >
                            {intl.formatMessage({ id: 'cancel' })}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
                </div>
            </div>
        </div>
    );
};
  
export default StoragePlanFormBody;