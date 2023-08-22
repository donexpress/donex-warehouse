import React from 'react';
import '../../../../styles/wms/user.form.scss';
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
      country: (id && warehouse) ? warehouse.country : '',
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
            router.push(`/${locale}/wms/warehouses`);
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
      router.push(`/${locale}/wms/warehouses`);
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
  }

  const goToEdit = () => {
    router.push(`/${locale}/wms/warehouses/${id}/update`)
  };

    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>{id ? (isFromDetails ? intl.formatMessage({ id: 'vizualice' }) : intl.formatMessage({ id: 'modify' })) : intl.formatMessage({ id: 'insert' })} {intl.formatMessage({ id: 'warehouse' })}</b></div>
                <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaWH(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <div className='user-form-body__form'>
                          <GenericInput
                            type="text"
                            name="code"
                            placeholder={intl.formatMessage({ id: 'warehouse_code' })}
                            customClass="custom-input"
                            disabled={ !!id }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder={intl.formatMessage({ id: 'warehouse_name' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="contact"
                            placeholder={intl.formatMessage({ id: 'contact' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="company"
                            placeholder={intl.formatMessage({ id: 'company' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="select-filter"
                            name="country"
                            placeholder={intl.formatMessage({ id: 'select_nation' })}
                            options={getStatesFormattedCountries(countries)}
                            customClass="select-filter"
                            disabled={ !!id }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="address_1"
                            placeholder={`${intl.formatMessage({ id: 'address' })} 1`}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="address_2"
                            placeholder={`${intl.formatMessage({ id: 'address' })} 2`}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="city"
                            placeholder={intl.formatMessage({ id: 'city' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="province"
                            placeholder={intl.formatMessage({ id: 'province' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="cp"
                            placeholder={intl.formatMessage({ id: 'postal_code' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="phone"
                            placeholder={intl.formatMessage({ id: 'phone' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="email"
                            placeholder={intl.formatMessage({ id: 'email' })}
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
  
export default WarehouseFormBody;