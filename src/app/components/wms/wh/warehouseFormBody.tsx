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
      contact_person: (id && warehouse) ? warehouse.contact_person : '',
      company: (id && warehouse) ? warehouse.company : '',
      country: (id && warehouse) ? warehouse.country : '',
      address: (id && warehouse) ? warehouse.address : '',
      address2: (id && warehouse) ? warehouse.address2 : '',
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
          label: country.name
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
      showMsg("Almacén " + (id ? "modificado" : "creado") + " de manera satisfactoria.", { type: "success" });
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
                <div className='user-form-body__title black-label'><b>{id ? (isFromDetails ? "Visualizar" : "Modificar") : "Insertar"} almacén</b></div>
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
                            placeholder="Código de almacén"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="contact_person"
                            placeholder="Persona de contacto"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="company"
                            placeholder="Compañía"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="select"
                            name="country"
                            selectLabel="Seleccione la Nación"
                            options={getStatesFormattedCountries(countries)}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="address"
                            placeholder="Dirección 1"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="address2"
                            placeholder="Dirección 2"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="city"
                            placeholder="Ciudad"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="province"
                            placeholder="Provincia / Estado"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="cp"
                            placeholder="Código Postal"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="phone"
                            placeholder="Teléfono"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                          <GenericInput
                            type="text"
                            name="email"
                            placeholder="Correo"
                            customClass="custom-input"
                            disabled={ isFromDetails }
                          />
                      </div>
                      <GenericInput
                        type="textarea"
                        name="observations"
                        placeholder="Observaciones"
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
                                {isSubmitting ? intl.formatMessage({ id: 'sending' }) : 'Crear'}
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
                                Ir a edición
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
  
export default WarehouseFormBody;