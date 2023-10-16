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
import CheckboxesStoragePlan from './CheckboxesStoragePlan';
import SelectUserStoragePlan from './SelectUserStoragePlan';
import CustomerOrderNumberStoragePlan from './CustomerOrderNumberStoragePlan';

const getWarehouseIdOfUser = (userId: number | null, users: User[], warehouses: Warehouse[]) => {
  if (userId) {
    const filterUser = users.filter((user: User) => user.id === Number(userId))
    if (filterUser.length > 0) {
        if (filterUser[0].warehouse) {
            const filterWarehouse = warehouses.filter((warehouse: Warehouse) => warehouse.id === filterUser[0].warehouse?.id);
            if (filterWarehouse.length > 0) {
              return Number(filterWarehouse[0].id);
            }
        }
    }
  }
  return -1;
}

const StoragePlanFormBody = ({ users, warehouses, id, storagePlan, isFromDetails, inWMS }: StoragePlanProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [showPackingList, setShowPackingList] = useState<boolean>(false);
    const [showExpansionBoxNumber, setShowExpansionBoxNumber] = useState<boolean>(true);
    const [rows, setRows] = useState<PackingList[]>([]);
    const [prefixExpansionBoxNumber, setPrefixExpansionBoxNumber] = useState<string>('FBA');
    const [digitsBoxNumber, setDigitsBoxNumber] = useState<number>(6);
    const digitsBoxNumberOptions: ValueSelect[] = [
      {
        value: 3,
        label: "3"
      },
      {
        value: 6,
        label: "6"
      }
    ];
    const [rejectedBoxesCheckValue, setRejectedBoxesCheckValue] = useState<boolean>((!!id && storagePlan) ? storagePlan.rejected_boxes : false);
    const [warehouseOfUser, setWarehouseOfUser] = useState<number>(!!id && storagePlan && storagePlan.user_id ? getWarehouseIdOfUser(storagePlan.user_id, users, warehouses) : -1);
    
    const initialValues: StoragePlan = {
        customer_order_number: (id && storagePlan) ? storagePlan.customer_order_number : '',
        user_id: (id && storagePlan) ? storagePlan.user_id : null,
        warehouse_id: (id && storagePlan) ? storagePlan.warehouse_id : null,
        box_amount: (id && storagePlan) ? storagePlan.box_amount : 0,
        delivered_time: (id && storagePlan) ? (storagePlan.delivered_time ? storagePlan.delivered_time.substring(0,16) : null) : null,
        observations: (id && storagePlan) ? storagePlan.observations : '',
        rejected_boxes: (id && storagePlan) ? storagePlan.rejected_boxes : false,
        return: (id && storagePlan) ? storagePlan.return : false,
        show_packing_list: false,
        show_expansion_box_number: true,
        prefix_expansion_box_number: 'FBA',
        digits_box_number: 6,
        reference_number: (id && storagePlan) ? storagePlan.reference_number : null,
        pr_number: (id && storagePlan) ? storagePlan.pr_number : null,
        rows: [],
    };
  
      const cancelSend = () => {
          const goBack = router.query.goBack;
            if (goBack && goBack === 'config' && !!id) {
              router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
            } else {
              router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan`);
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

      const getWarehousesFormatted = (warehouseAll: Warehouse[], warehouseOfU: number = -1): ValueSelect[] => {
        let response: ValueSelect[] = [];
        if (warehouseOfU !== -1) {
          const warehouseOfUserList = warehouseAll.filter((wh: Warehouse) => wh.id === warehouseOfU);
          if (warehouseOfUserList.length > 0) {
            return warehouseOfUserList.map((wh: Warehouse) => {
              return {
                value: Number(wh.id),
                label: wh.name + ` (${wh.code})`
              }
            })
          }
        }
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
                observations: values.observations,
                rejected_boxes: values.rejected_boxes,
                return: values.return,
                state: getState(storagePlan ? storagePlan.state : values.state),
                reference_number: values.reference_number,
                pr_number: values.pr_number
              };
      }

      const getState = (state: string | undefined) => {
        console.log(state)
        if (state) {
          return state;
        }
        return 'to be storage';
      }

      const tableIsValid = () => {
        if (showPackingList && rows.length > 0) {
          return rows.every(item => {
            return item.box_number !== '' &&
              item.box_number !== null &&
              item.box_number !== undefined &&
              !isNaN(item.amount);
          });
        }
        return true;
      }
  
      const handleSubmit = async (values: StoragePlan) => {
            if (id) {
              await modify(id, values);
            } else {
              await create(values);
            }
      };

      const formatBodyPackingList = (pl: PackingList, storagePlanId: number): PackingList => {
        return {
          storage_plan_id: storagePlanId,
          box_number: pl.box_number,
          case_number: pl.case_number,
          client_height: pl.client_height,
          client_length: pl.client_length,
          client_weight: pl.client_weight,
          client_width: pl.client_width,
          amount: pl.amount,
          product_name: pl.product_name,
          english_product_name: pl.english_product_name,
          price: pl.price,
          material: pl.material,
          customs_code: pl.customs_code,
          fnscu: pl.fnscu,
          order_transfer_number: pl.order_transfer_number,
          custome_picture: pl.custome_picture,
          operator_picture: pl.operator_picture,
        }
      }

      const create = async (values: StoragePlan) => {
        const response: Response = await createStoragePlan(formatBody(values));
        if (response.status >= 200 && response.status <= 299) {
          const responseSP: StoragePlan = response.data;
          if (responseSP) {
            for (let index = 0; index < rows.length; index++) {
              const element: PackingList = rows[index];
              await createPackingList(formatBodyPackingList(element, Number(responseSP.id)));
            }
          }
          showMsg(intl.formatMessage({ id: 'successfullyMsg' }), { type: "success" });
          router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan`);
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      }
    
      const modify = async (storagePlanId: number, values: StoragePlan) => {
        const response: Response = await updateStoragePlanById(storagePlanId, formatBody(values));
        if (response.status >= 200 && response.status <= 299) {
          showMsg(intl.formatMessage({ id: 'changedsuccessfullyMsg' }), { type: "success" });
          const goBack = router.query.goBack;
          if (goBack && goBack === 'config' && !!id) {
            router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
          } else {
            router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan`);
          }
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      }

      const goToEdit = () => {
        router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/update`)
      };
      
      const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        const { name, value, type, checked } = event.target;
        const fieldValue = type === "checkbox" ? checked : value;
        
        if (name === 'show_packing_list') {
          setShowPackingList(fieldValue);
        } else if (name === 'show_expansion_box_number') {
          setShowExpansionBoxNumber(fieldValue);
          setBoxNumberLabel({ showEBN: fieldValue, prefixEBN: prefixExpansionBoxNumber, dBN: digitsBoxNumber }, rejectedBoxesCheckValue);
        } else if (name === 'prefix_expansion_box_number') {
          const valueElement: string = fieldValue ? fieldValue : '';
          setPrefixExpansionBoxNumber(valueElement);
          setBoxNumberLabel({ showEBN: showExpansionBoxNumber, prefixEBN: valueElement, dBN: digitsBoxNumber }, rejectedBoxesCheckValue);
        } else if (name === 'digits_box_number') {
          const valueElement: number = fieldValue ? Number (fieldValue) : 6;
          setDigitsBoxNumber(valueElement);
          setBoxNumberLabel({ showEBN: showExpansionBoxNumber, prefixEBN: prefixExpansionBoxNumber, dBN: valueElement }, rejectedBoxesCheckValue);
        } else if (name === 'box_amount') {
          const valueElement = fieldValue < 0 ? 0 : fieldValue;
          setBoxesCount(valueElement);
        } else if (name === 'return') {
          if (checked) {

          }
        } else if (name === 'rejected_boxes') {
          if (checked) {
            
          }
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
              box_number: getInitialBoxNumberLabel(rows.length + index + 1, null, rejectedBoxesCheckValue), 
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
              order_transfer_number: '',
              custome_picture: '',
              operator_picture: '',
            });
          }

          setRows(rows.concat(items));
        }
      }

      const setBoxNumberLabel = (params: BoxNumberLabelFn, rBoxes = false) => {
        const allRows = rows.map((row: PackingList) => ({...row, box_number: getInitialBoxNumberLabel(Number(row.id) + 1, params, rBoxes)}));
        setRows(allRows);
      }

      const getInitialBoxNumberLabel = (value: number, params: BoxNumberLabelFn | null = null, rBoxes = false) => {
        let showEBN: boolean = params !== null ? params.showEBN : showExpansionBoxNumber;
        let prefixEBN: string = params !== null ? params.prefixEBN : prefixExpansionBoxNumber;
        let dBN: number = params !== null ? params.dBN : digitsBoxNumber;
        if (showEBN){
          let numberPart = (rBoxes ? 'UR' : 'U') + ((value.toString.length >= dBN) ? value : (String(value).padStart(dBN, '0')));
          
          return prefixEBN + numberPart;
        }
        return value.toString();
      }

      const handleUpdateRow = (id: number, updatedValues: PackingList) => {
        const updatedRows = rows.map((row) => (row.id === id ? updatedValues : row));
        setRows(updatedRows);
      };

      const changeWarehouse = (id: number) => {
        setWarehouseOfUser(id);
      };

      const changeCustomerOrderNumber = (value: string) => {
        if (value && value !== ''){
          setPrefixExpansionBoxNumber(value);
          setBoxNumberLabel({ showEBN: showExpansionBoxNumber, prefixEBN: value, dBN: digitsBoxNumber }, rejectedBoxesCheckValue);
        }
      };

      const changeRejectedValue = (value: boolean) => {
        setRejectedBoxesCheckValue(value);
        
        setBoxNumberLabel({ showEBN: showExpansionBoxNumber, prefixEBN: prefixExpansionBoxNumber, dBN: digitsBoxNumber }, value);
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
                          <CustomerOrderNumberStoragePlan isFromDetails={!!isFromDetails} changeCustomerOrderNumber={changeCustomerOrderNumber}></CustomerOrderNumberStoragePlan>
                        </div>
                        {
                          inWMS && (
                            <div className="w-full sm:w-[49%]">
                              <SelectUserStoragePlan options={getUsersFormatted(users)} users={users} warehouses={warehouses} changeWarehouse={changeWarehouse} isFromDetails={!!isFromDetails}></SelectUserStoragePlan>
                            </div>
                          )
                        }
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="select"
                            name="warehouse_id"
                            selectLabel={intl.formatMessage({ id: 'select_warehouse' })}
                            options={getWarehousesFormatted(warehouses, warehouseOfUser)}
                            customClass="custom-input"
                            disabled={ isFromDetails || (!!id && storagePlan && storagePlan.state !== 'to be storage') || (warehouseOfUser !== -1) }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="reference_number"
                            placeholder={intl.formatMessage({ id: 'reference_number' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="pr_number"
                            placeholder={intl.formatMessage({ id: 'pr_number' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="number"
                            name="box_amount"
                            placeholder={intl.formatMessage({ id: 'number_of_boxes' })}
                            customClass="custom-input"
                            disabled={ !!id }
                            minValue={0}
                            onChangeFunction={handleInputChange}
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="datetime-local"
                            name="delivered_time"
                            placeholder={intl.formatMessage({ id: 'delivery_time' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            selectDateMinToday={true}
                          />
                        </div>
                      </div>
                      <CheckboxesStoragePlan  isFromDetails={!!isFromDetails} changeRejectedValue={changeRejectedValue}/>
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
                          <div>
                            <div style={{ paddingLeft: '10px' }}>
                              <div className="flex gap-2 flex-wrap" style={{ paddingBottom: '10px' }}>
                                <span>{intl.formatMessage({ id: 'expansion_box_number' })}</span>
                                {/* <GenericInput onChangeFunction={handleInputChange} hideErrorContent={true} type='checkbox' name="show_expansion_box_number" placeholder={intl.formatMessage({ id: 'expansion_box_number' })} customClass='custom-input' /> */}
                              </div>
                              {
                                showExpansionBoxNumber && 
                                <div className='flex gap-3 flex-wrap justify-between' style={{ paddingRight: '16px' }}>
                                  <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                      type="text"
                                      name="prefix_expansion_box_number"
                                      placeholder={intl.formatMessage({ id: 'expansion_box_number' })}
                                      customClass="custom-input"
                                      onChangeFunction={handleInputChange}
                                      disabled={ true }
                                    />
                                  </div>
                                  <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                      type="select"
                                      name="digits_box_number"
                                      selectLabel={intl.formatMessage({ id: 'digits_box_number' })}
                                      options={digitsBoxNumberOptions}
                                      customClass="custom-input"
                                      onChangeFunction={handleInputChange}
                                      disabled={ isFromDetails }
                                    />
                                  </div>
                                </div>
                              }
                            </div>
                            <div className='boxes-container'>
                              <div>
                                <RowStoragePlanHeader inWMS={inWMS} />
                                <div className='boxes-container-values'>
                                  {rows.map((row, index) => (
                                    <RowStoragePlan key={index} initialValues={{ ...row, id: index }} inWMS={inWMS}
                                    onUpdate={(updatedValues) => handleUpdateRow(index, updatedValues)} prefixBoxNumber={prefixExpansionBoxNumber} rejectedBoxes={rejectedBoxesCheckValue} />
                                  ))}
                                </div>
                              </div>
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
                                disabled={isSubmitting || !isValid || !tableIsValid()}
                              >
                                {isSubmitting ? intl.formatMessage({ id: 'sending' }) : (id ? intl.formatMessage({ id: 'modify' }) : intl.formatMessage({ id: 'add' }))}
                              </Button>
                            )
                          }
                          {
                            isFromDetails && id && (inWMS || (!inWMS && storagePlan && storagePlan.state === 'to be storage')) && (
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