import React, { useState, ChangeEvent } from 'react';
import { Button } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaPackingList } from '../../../../validation/generateValidationSchemaStoragePlan';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { Response, ValueSelect } from '../../../../types';
import { createStoragePlan, updateStoragePlanById } from '../../../../services/api.storage_plan';
import { createPackingList, updatePackingListById } from '../../../../services/api.packing_list';
import { PackingListProps, StoragePlan, PackingList, BoxNumberLabelFn } from '../../../../types/storage_plan';
import RowStoragePlan from '../../common/RowStoragePlan';
import RowStoragePlanHeader from '../../common/RowStoragePlanHeader';

const getInitialLabel = (storagePlan: StoragePlan): string => {
    const packingList: PackingList[] | undefined = storagePlan.packing_list;
    let label = storagePlan.customer_order_number;
    if (packingList !== undefined && packingList.length !== 0) {
        const prefixes: string[] = [];
        
        packingList.forEach(item => {
          if (typeof item.box_number === 'string') {
            const match = item.box_number.match(/^(.*)(?=U\d+$)/)
            if (match) {
              prefixes.push(match[1]);
            }
          }
        });

        if (prefixes.length !== 0) {
            label = prefixes[0];
        }
    }
    return label;
};

const getInitialDigits = (packingList: PackingList[] | undefined): number => {
    let digits = 6;
    if (packingList !== undefined && packingList.length !== 0) {
        const digitCounts: number[] = [];
        
        packingList.forEach(item => {
          if (typeof item.box_number === 'string') {
            const match = item.box_number.match(/U(\d+)$/);
            if (match) {
              digitCounts.push(match[1].length);
            }
          }
        });

        if (digitCounts.length !== 0) {
            digits = (digitCounts[0] !== 3 && digitCounts[0] !== 6) ? 6 : digitCounts[0];
        }
    }
    return digits;
};

const getNumericPartWithoutLeadingZeros = (input: string): number | null => {
    const match = input.match(/\d+$/);
    if (match) {
      const numericPart = match[0];
      const parsedNumericPart = parseInt(numericPart, 10);
      return parsedNumericPart;
    }
    return null;
};

const getPackingListFromSP = (isModify: boolean, packingList: PackingList[] | undefined): PackingList[] => {
    let items: PackingList[] = [];
    if (isModify && (packingList !== undefined) && packingList.length > 0) {
        return packingList.map((pl: PackingList) => { return {...pl, box_number_aux: !isNaN(Number(pl.box_number)) ? Number(pl.box_number) : (getNumericPartWithoutLeadingZeros(pl.box_number) !== null ? Number(getNumericPartWithoutLeadingZeros(pl.box_number)) : (pl.id))} })
    }

    return items;
};

const getMajorNumber = (packingList: PackingList[] | undefined): number => {
  let result = 0;
  if ((packingList !== undefined) && packingList.length > 0) {
    let items: number[] = packingList.map((pl: PackingList) => { return !isNaN(Number(pl.box_number)) ? Number(pl.box_number) : Number(getNumericPartWithoutLeadingZeros(pl.box_number) !== null ? Number(getNumericPartWithoutLeadingZeros(pl.box_number)) : (pl.id)) })
    if (items.length > 0) {
      result = Math.max(...items);
    }
  }
  return result;
}

const PackingListFormBody = ({ id, storagePlan, isFromAddPackingList, isFromModifyPackingList, inWMS }: PackingListProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [showExpansionBoxNumber, setShowExpansionBoxNumber] = useState<boolean>(isFromModifyPackingList ? true : false);
    const [rows, setRows] = useState<PackingList[]>(isFromAddPackingList ? 
        ([
            {
                id: (storagePlan.packing_list && (storagePlan.packing_list.length > 0)) ? (Number(storagePlan.packing_list[storagePlan.packing_list.length - 1].id) + 1) : storagePlan.box_amount, 
                box_number: String(getMajorNumber(storagePlan.packing_list) + 1),
                box_number_aux: getMajorNumber(storagePlan.packing_list) + 1,  
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
            }
        ])
        :
        getPackingListFromSP(!!isFromModifyPackingList, storagePlan.packing_list));
    const [prefixExpansionBoxNumber, setPrefixExpansionBoxNumber] = useState<string>(getInitialLabel(storagePlan));
    const [digitsBoxNumber, setDigitsBoxNumber] = useState<number>(getInitialDigits(storagePlan.packing_list));
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
    
    const initialValues: any = {
        box_amount: 1,
        show_expansion_box_number: false,
        prefix_expansion_box_number: prefixExpansionBoxNumber,
        digits_box_number: digitsBoxNumber,
        rows: [],
    };
  
      const cancelSend = () => {
          router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
      };
  
      const formatBody = (value: number): StoragePlan => {
        return {
                user_id: storagePlan ? Number(storagePlan.user_id) : null,
                warehouse_id: storagePlan.warehouse_id ? Number(storagePlan.warehouse_id) : null,
                customer_order_number: storagePlan.customer_order_number,
                box_amount: storagePlan.box_amount + value,
                delivered_time: (storagePlan.delivered_time ? storagePlan.delivered_time.substring(0,10) : null),
                observations: storagePlan.observations,
                rejected_boxes: storagePlan.rejected_boxes,
                return: storagePlan.return
              };
      }

      const tableIsValid = () => {
        if (rows.length > 0) {
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
        if (isFromAddPackingList) {
            await create(Number(id), values.box_amount);
        } else if (isFromModifyPackingList) {
            await modify(Number(id));
        }
      };

      const formatBodyPackingList = (pl: PackingList, storagePlanId: number): PackingList => {
        let item: PackingList = {
          storage_plan_id: storagePlanId,
          box_number: pl.box_number,
          case_number: pl.case_number ? pl.case_number : '',
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
        };

        if (isFromModifyPackingList) {
            item = {
                ...item,
                id: pl.id
            }
        }

        return item;
      }

      const create = async (storagePlanId: number, value: number) => {
        const response: Response = await updateStoragePlanById(storagePlanId, formatBody(value));
        if (response.status >= 200 && response.status <= 299) {
          const responseSP: StoragePlan = response.data;
          if (responseSP) {
            for (let index = 0; index < rows.length; index++) {
              const element: PackingList = rows[index];
              await createPackingList(formatBodyPackingList(element, storagePlanId));
            }
          }
          showMsg(intl.formatMessage({ id: 'successfullyMsg' }), { type: "success" });
          router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      }
    
      const modify = async (storagePlanId: number) => {
        for (let index = 0; index < rows.length; index++) {
          const element: PackingList = rows[index];
          const response: Response = await updatePackingListById(Number(element.id), formatBodyPackingList(element, storagePlanId));
          if ((index === (rows.length-1)) && (response.status >= 200 && response.status <= 299)) {
            showMsg(intl.formatMessage({ id: 'changedsuccessfullyMsg' }), { type: "success" });
            router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
          } else if (index === (rows.length-1)) {
            let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
            showMsg(message, { type: "error" });
          }
        }
      }
      
      const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        const { name, value, type, checked } = event.target;
        const fieldValue = type === "checkbox" ? checked : value;
        
        if (name === 'show_expansion_box_number') {
          setShowExpansionBoxNumber(fieldValue);
          setBoxNumberLabel({ showEBN: fieldValue, prefixEBN: prefixExpansionBoxNumber, dBN: digitsBoxNumber });
        } else if (name === 'prefix_expansion_box_number') {
          const valueElement: string = fieldValue ? fieldValue : '';
          setPrefixExpansionBoxNumber(valueElement);
          setBoxNumberLabel({ showEBN: showExpansionBoxNumber, prefixEBN: valueElement, dBN: digitsBoxNumber });
        } else if (name === 'digits_box_number') {
          const valueElement: number = fieldValue ? Number (fieldValue) : 6;
          setDigitsBoxNumber(valueElement);
          setBoxNumberLabel({ showEBN: showExpansionBoxNumber, prefixEBN: prefixExpansionBoxNumber, dBN: valueElement });
        } else if (name === 'box_amount') {
          const valueElement = fieldValue < 0 ? 0 : fieldValue;
          setBoxesCount(valueElement);
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
              id: ((storagePlan.packing_list && (storagePlan.packing_list.length > 0)) ? (Number(storagePlan.packing_list[storagePlan.packing_list.length - 1].id) + 1) : storagePlan.box_amount) + rows.length + index, 
              box_number: getInitialBoxNumberLabel(getMajorNumber(storagePlan.packing_list) + rows.length + index + 1), 
              box_number_aux: getMajorNumber(storagePlan.packing_list) + rows.length + index + 1, 
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

      const setBoxNumberLabel = (params: BoxNumberLabelFn) => {
        const allRows = rows.map((row: PackingList) => ({...row, box_number: getInitialBoxNumberLabel(Number(row.box_number_aux), params)}));
        setRows(allRows);
      }

      const getInitialBoxNumberLabel = (value: number, params: BoxNumberLabelFn | null = null) => {
        let showEBN: boolean = params !== null ? params.showEBN : showExpansionBoxNumber;
        let prefixEBN: string = params !== null ? params.prefixEBN : prefixExpansionBoxNumber;
        let dBN: number = params !== null ? params.dBN : digitsBoxNumber;
        if (showEBN){
          let numberPart = 'U' + ((value.toString.length >= dBN) ? value : (String(value).padStart(dBN, '0')));
          
          return prefixEBN + numberPart;
        }
        return value.toString();
      }

      const handleUpdateRow = (id: number, updatedValues: PackingList) => {
        const updatedRows = rows.map((row) => (row.id === id ? updatedValues : row));
        setRows(updatedRows);
      };

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <h1 className="text-xl font-semibold">
              {isFromAddPackingList
                ? 
                  intl.formatMessage({ id: "add_box" })
                : intl.formatMessage({ id: "modify_packing_list" })}
            </h1>
            <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={isFromAddPackingList ? generateValidationSchemaPackingList(intl) : null}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form className='flex flex-col gap-3'>
                        {
                            isFromAddPackingList && (
                                <div className='flex gap-3 flex-wrap justify-between' style={{ paddingRight: '16px' }}>
                                  <div className="w-full sm:w-[49%]">
                                    <GenericInput
                                      type="number"
                                      name="box_amount"
                                      placeholder={intl.formatMessage({ id: 'number_of_boxes' })}
                                      customClass="custom-input"
                                      minValue={0}
                                      onChangeFunction={handleInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                            )
                        }
                      
                      <div>
                        <div>
                          {
                              isFromAddPackingList &&
                              <div className="flex gap-2 flex-wrap" style={{ paddingBottom: '10px' }}>
                                <GenericInput onChangeFunction={handleInputChange} hideErrorContent={true} type='checkbox' name="show_expansion_box_number" placeholder={intl.formatMessage({ id: 'expansion_box_number' })} customClass='custom-input' />
                              </div>
                          }
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
                                <RowStoragePlan key={index} initialValues={{ ...row }} inWMS={inWMS}
                                onUpdate={(updatedValues) => handleUpdateRow(Number(row.id), updatedValues)} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end gap-3' style={{ paddingRight: '20px' }}>
                        <div>
                              <Button
                                color="primary"
                                type="submit"
                                className='px-4'
                                disabled={isSubmitting || !isValid || !tableIsValid()}
                              >
                                {isSubmitting ? intl.formatMessage({ id: 'sending' }) : (isFromModifyPackingList ? intl.formatMessage({ id: 'modify' }) : intl.formatMessage({ id: 'add' }))}
                              </Button>
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
  
export default PackingListFormBody;