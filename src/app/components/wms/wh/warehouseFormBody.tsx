import React from 'react';
import '../../../../styles/wms/user.form.scss';
import { Button } from "@nextui-org/react";
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaWH } from '../../../../validation/generateValidationSchemaWH';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { Country, ValueSelect, Response } from '../../../../types';
import { Warehouse, WarehouseProps } from '../../../../types/warehouse';
import { createWh, updateWhById } from '../../../../services/api.wh';

const WarehouseFormBody = ({ countries, id, warehouse, isFromDetails }: WarehouseProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    
    const initialValues: Warehouse = {
      code: (id && warehouse) ? warehouse.code : '',
      name: (id && warehouse) ? warehouse.name : '',
      contact: (id && warehouse) ? warehouse.contact : '',
      company: (id && warehouse) ? warehouse.company : '',
      country: (id && warehouse) ? warehouse.country : 'Mexico',
      address_1: (id && warehouse) ? warehouse.address_1 : '',
      address_2: (id && warehouse) ? warehouse.address_2 : '',
      city: (id && warehouse) ? warehouse.city : '',
      province: (id && warehouse) ? warehouse.province : '',
      cp: (id && warehouse) ? warehouse.cp : '',
      phone: (id && warehouse) ? warehouse.phone : '',
      email: (id && warehouse) ? warehouse.email : '',
      observations: (id && warehouse) ? warehouse.observations : '',
    };

    const getStatesFormattedCountries = (countriesAll: Country[]): ValueSelect[] => {
      let response: ValueSelect[] = [];
      countriesAll.forEach((country) => {
        response.push({
          value: country.name,
          label: country.emoji + ' ' + country.name
        });
      })
      return response;
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            const goBack = router.query.goBack;
            if (goBack && goBack === 'config' && !!id) {
              router.push(`/${locale}/wms/warehouses/${id}/config`);
            } else {
              router.push(`/${locale}/wms/warehouses`);
            }
          }
      };
  
      const handleSubmit = async (values: Warehouse) => {
          if (isWMS()) {
            if (id) {
              await modify(id, values);
            } else {
              await create(values);
            }
          }
      };

  const create = async (values: Warehouse) => {
    const response: Response = await createWh(values);
    treatmentToResponse(response);
  }

  const modify = async (warehouseId: number, values: Warehouse) => {
    const response: Response = await updateWhById(warehouseId, values);
    treatmentToResponse(response);
  }

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id ? intl.formatMessage({ id: 'changedsuccessfullyMsg' }) : intl.formatMessage({ id: 'successfullyMsg' });
      showMsg(message, { type: "success" });
      
      const goBack = router.query.goBack;
      if (goBack && goBack === 'config' && !!id) {
        router.push(`/${locale}/wms/warehouses/${id}/config`);
      } else {
        router.push(`/${locale}/wms/warehouses`);
      }
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      if (response.status === 409) {
        message = intl.formatMessage({ id: "warehouse_code_name_already_exists" });
        if (response.data && response.data.message && (response.data.message === "name already exists")) {
          message = intl.formatMessage({ id: "warehouse_name_already_exists" });
        } else if (response.data && response.data.message && (response.data.message === "code already exists")) {
          message = intl.formatMessage({ id: "warehouse_code_already_exists" });
        }
      }
      showMsg(message, { type: "error" });
    }
  }

  const goToEdit = () => {
    router.push(`/${locale}/wms/warehouses/${id}/update`)
  };

    return (
        <div className='user-form-body shadow-small'>
            <h1 className="text-xl font-semibold">
              {id ? (isFromDetails ? intl.formatMessage({ id: 'vizualice' }) : intl.formatMessage({ id: 'modify' })) : intl.formatMessage({ id: 'insert' })}
              {" "}
              {intl.formatMessage({ id: 'warehouse' })}
            </h1>
            <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaWH(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form className='flex flex-col gap-3'>
                      <div className='flex gap-3 flex-wrap justify-between'>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="code"
                            placeholder={intl.formatMessage({ id: 'warehouse_code' })}
                            customClass="custom-input"
                            disabled={ !!id }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder={intl.formatMessage({ id: 'warehouse_name' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="contact"
                            placeholder={intl.formatMessage({ id: 'contact' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="company"
                            placeholder={intl.formatMessage({ id: 'company' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="select-filter"
                            name="country"
                            placeholder={intl.formatMessage({ id: 'select_nation' })}
                            options={getStatesFormattedCountries(countries)}
                            customClass="select-filter"
                            disabled={ !!id }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="address_1"
                            placeholder={`${intl.formatMessage({ id: 'address' })} 1`}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="address_2"
                            placeholder={`${intl.formatMessage({ id: 'address' })} 2`}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="city"
                            placeholder={intl.formatMessage({ id: 'city' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="province"
                            placeholder={intl.formatMessage({ id: 'province' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="cp"
                            placeholder={intl.formatMessage({ id: 'postal_code' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="phone"
                            placeholder={intl.formatMessage({ id: 'phone' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                        <div className="w-full sm:w-[49%]">
                          <GenericInput
                            type="text"
                            name="email"
                            placeholder={intl.formatMessage({ id: 'email' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap">
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
                      <div className='flex justify-end gap-3'>
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
  
export default WarehouseFormBody;