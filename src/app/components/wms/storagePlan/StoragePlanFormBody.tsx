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
import { StoragePlanProps, StoragePlan, PackingList } from '../../../../types/storage_plan';
import { User } from '../../../../types/user';
import { Warehouse } from '../../../../types/warehouse';
import RowStoragePlan from '../../common/RowStoragePlan';
import RowStoragePlanHeader from '../../common/RowStoragePlanHeader';

const StoragePlanFormBody = ({ users, warehouses, id, storagePlan, isFromDetails }: StoragePlanProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [showPackingList, setShowPackingList] = useState<boolean>(false);
    const [rows, setRows] = useState<PackingList[]>([]);
    
    const initialValues: StoragePlan = {
        customer_order_number: (id && storagePlan) ? storagePlan.customer_order_number : '',
        user_id: (id && storagePlan) ? storagePlan.user_id : null,
        warehouse_id: (id && storagePlan) ? storagePlan.warehouse_id : null,
        box_amount: (id && storagePlan) ? storagePlan.box_amount : 0,
        delivered_time: (id && storagePlan) ? storagePlan.delivered_time : '',
        observations: (id && storagePlan) ? storagePlan.observations : '',
        show_packing_list: false,
        rows: [],
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
                user_id: values.user_id ? Number(values.user_id) : null,
                warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null,
                customer_order_number: values.customer_order_number,
                box_amount: values.box_amount,
                delivered_time: values.delivered_time,
                observations: values.observations
              };
      }
  
      const handleSubmit = async (values: StoragePlan) => {console.log(values);console.log(rows)
          /* if (isWMS()) {
            if (id) {
              await modify(id, values);
            } else {
              await create(values);
            }
          } */
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
      
      const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        const { name, value, type, checked } = event.target;
        const fieldValue = type === "checkbox" ? checked : value;
        
        if (name === 'show_packing_list') {
          setShowPackingList(fieldValue);
        } else if (name === 'box_amount') {
          const value = fieldValue < 0 ? 0 : fieldValue;
          setBoxesCount(value);
        }
      };

      const setBoxesCount = (value: number) => {
        if (rows.length > value) {
          setRows(rows.slice(0, value));
        } else if (rows.length < value) {
          const count = value - rows.length;
          let items: PackingList[] = [];

          for (let index = 0; index < count; index++) {
            items.push({
              id: rows.length + index, 
              box_number: '', 
              case_number: '',
              amount: 0,
              client_weight: 0,
              client_length: 0,
              client_width: 0,
              client_height: 0,
              product_name: '',
              english_product_name: '',
              price: 0,
              material: '',
              customs_code: '',
              fnscu: '',
            });
          }

          setRows(rows.concat(items));
        }
      }

      const handleUpdateRow = (id: number, updatedValues: PackingList) => {
        const updatedRows = rows.map((row) => (row.id === id ? updatedValues : row));
        setRows(updatedRows);
      };

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <h1 className="text-xl font-semibold">
              {id
                ? isFromDetails
                  ? intl.formatMessage({ id: "vizualice" })
                  : intl.formatMessage({ id: "modify" })
                : intl.formatMessage({ id: "insert" })}
              {" "}
              {intl.formatMessage({ id: 'storagePlan' })}
            </h1>
            <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaStoragePlan(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form className='flex flex-col gap-3'>
                      <div className='flex gap-3 flex-wrap justify-between' style={{ paddingRight: '16px' }}>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="customer_order_number"
                            placeholder={intl.formatMessage({ id: 'customer_order_number' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="select"
                            name="user_id"
                            selectLabel={intl.formatMessage({ id: 'select_user' })}
                            options={getUsersFormatted(users)}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="select"
                            name="warehouse_id"
                            selectLabel={intl.formatMessage({ id: 'select_warehouse' })}
                            options={getWarehousesFormatted(warehouses)}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="number"
                            name="box_amount"
                            placeholder={intl.formatMessage({ id: 'number_of_boxes' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            minValue={0}
                            onChangeFunction={handleInputChange}
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="date"
                            name="delivered_time"
                            placeholder={intl.formatMessage({ id: 'delivery_time' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap" style={{ paddingRight: '16px' }}>
                        <div className="w-full">
                          <GenericInput
                            type="textarea"
                            name="observations"
                            placeholder={intl.formatMessage({ id: 'observations' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                      </div>
                      {
                        !id && (
                        <div className="flex gap-2 flex-wrap">
                          <GenericInput onChangeFunction={handleInputChange} hideErrorContent={true} type='checkbox' name="show_packing_list" placeholder={intl.formatMessage({ id: 'packing_list' })} customClass='custom-input' />
                        </div>
                        )
                      }
                      {
                        showPackingList && (
                          <div className='boxes-container'>
                            <div>
                              <RowStoragePlanHeader />
                              {rows.map((row, index) => (
                                <RowStoragePlan key={index} initialValues={{ ...row, id: index }}
                                onUpdate={(updatedValues) => handleUpdateRow(index, updatedValues)} />
                              ))}
                            </div>
                          </div>
                        )
                      }
                      <div className='flex justify-end gap-3' style={{ paddingRight: '20px' }}>
                        <div>
                          {
                            !isFromDetails &&
                            (
                              <Button
                                color="primary"
                                type="submit"
                                className='px-4'
                                disabled={isSubmitting || !isValid}
                              >
                                {isSubmitting ? intl.formatMessage({ id: 'sending' }) : (id ? intl.formatMessage({ id: 'modify' }) : intl.formatMessage({ id: 'add' }))}
                              </Button>
                            )
                          }
                          {
                            isFromDetails && id && (
                              <Button
                                color="primary"
                                type="button"
                                className='px-4'
                                onClick={()=>goToEdit()}
                              >
                                {intl.formatMessage({ id: 'go_to_edit' })}
                              </Button>
                            )
                          }
                        </div>
                        <div>
                          <Button
                            type="button"
                            className='bg-secundary px-4'
                            onClick={()=>cancelSend()}
                          >
                            {intl.formatMessage({ id: 'cancel' })}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
            </div>
        </div>
    );
};
  
export default StoragePlanFormBody;