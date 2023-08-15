import React from 'react';
import '../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaWarehouse } from '../../../validation/generateValidationSchemaWarehouse';
import { Formik, Form } from 'formik';
import GenericInput from '../common/GenericInput';
import { useIntl } from 'react-intl';
import { CargoStationWarehouseForm, Country, StateWarehouse, CargoStationWarehouseProps, ValueSelect, CargoStationWarehouseResponse } from '../../../types';
import { createCargoTerminal } from '../../../services/api.warehouse';

const CargoStationWarehouseFormBody = ({ states, countries }: CargoStationWarehouseProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const receptionAreas = [
        {
            value: 'Almacen 1',
            label: 'Almacen 1',
        },
        {
            value: 'Almacen 2',
            label: 'Almacen 2',
        }
    ];
    
    const initialValues: CargoStationWarehouseForm = {
      name: '',
      english_name: '',
      receiving_area: '',
      principal: '',
      contact_phone: '',
      stateId: 0,
      address: '',
      city: '',
      province: '',
      country: '',
      cp: '',
      shared_warehouse_system_code: '',
      shared_warehouse_docking_code: '',
      customer_order_number_rules: '',
    };

    const getStatesFormatted = (statesAll: StateWarehouse[]): ValueSelect[] => {
      let response: ValueSelect[] = [];
      statesAll.forEach((state) => {
        response.push({
          value: state.id,
          label: state.name
        });
      })
      return response;
    };

    const getStatesFormattedCountries = (countries: Country[]): ValueSelect[] => {
      let response: ValueSelect[] = [];
      countries.forEach((country) => {
        response.push({
          value: country.name,
          label: country.name
        });
      })
      return response;
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/warehouse_cargo_station`);
          }
      };
  
      const handleSubmit = async (values: CargoStationWarehouseForm) => {
          if (isWMS()) {
              const response: CargoStationWarehouseResponse = await createCargoTerminal(values);
              const { locale } = router.query;
              if (response.status >= 200 && response.status <= 299) {
                showMsg("Terminal de carga creada de manera satisfactoria.", { type: "success" });
                
                router.push(`/${locale}/wms/warehouse_cargo_station`);
              } else {
                let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
                
                showMsg(message, { type: "error" });
              }
          }
      };
    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>Insertar terminal de carga</b></div>
                <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaWarehouse(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <div className='user-form-body__form'>
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder="Nombre del sitio"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="english_name"
                            placeholder="Nombre del sitio (inglés)"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="receiving_area"
                            selectLabel="Seleccione el área de recepción"
                            options={receptionAreas}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="principal"
                            placeholder="Principal"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="contact_phone"
                            placeholder="Teléfono de contacto"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="stateId"
                            selectLabel="Seleccione el estado"
                            options={getStatesFormatted(states)}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="address"
                            placeholder="Dirección 1"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="city"
                            placeholder="Ciudad"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="province"
                            placeholder="Provincia / Estado"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="country"
                            selectLabel="Seleccione la Nación"
                            options={getStatesFormattedCountries(countries)}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="cp"
                            placeholder="Código Postal"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="shared_warehouse_system_code"
                            placeholder="Código del sistema de almacén compartido"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="shared_warehouse_docking_code"
                            placeholder="Código de atraque de almacén compartido"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="customer_order_number_rules"
                            placeholder="Reglas de número de orden de cliente"
                            customClass="custom-input"
                          />
                      </div>
                      <div className='user-form-body__buttons'>
                        <div>
                          <button
                            type="submit"
                            className='user-form-body__accept_button'
                            disabled={isSubmitting || !isValid}
                          >
                            {isSubmitting ? intl.formatMessage({ id: 'sending' }) : 'Crear'}
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className='user-form-body__cancel'
                            onClick={()=>cancelSend()}
                          >
                            Cancelar
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
  
export default CargoStationWarehouseFormBody;