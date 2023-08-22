import React from 'react';
import '../../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaWarehouse } from '../../../../validation/generateValidationSchemaWarehouse';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { CargoStationWarehouseForm, Country, StateWarehouse, CargoStationWarehouseProps, ValueSelect, Response } from '../../../../types';
import { createCargoTerminal, updateWarehouseById } from '../../../../services/api.warehouse';
import { Button, Chip } from '@nextui-org/react';


const CargoStationWarehouseFormBody = ({ states, countries, receptionAreas, id, warehouse, isFromDetails }: CargoStationWarehouseProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  const initialValues: CargoStationWarehouseForm = {
    name: (id && warehouse) ? warehouse.name : '',
    english_name: (id && warehouse) ? warehouse.english_name : '',
    receiving_area: (id && warehouse) ? warehouse.receiving_area : '',
    principal: (id && warehouse) ? warehouse.principal : '',
    contact_phone: (id && warehouse) ? warehouse.contact_phone : '',
    state_id: (id && warehouse) ? warehouse.state_id : null,
    address: (id && warehouse) ? warehouse.address : '',
    city: (id && warehouse) ? warehouse.city : '',
    province: (id && warehouse) ? warehouse.province : '',
    country: (id && warehouse) ? warehouse.country : '',
    cp: (id && warehouse) ? warehouse.cp : '',
    shared_warehouse_system_code: (id && warehouse) ? warehouse.shared_warehouse_system_code : '',
    shared_warehouse_docking_code: (id && warehouse) ? warehouse.shared_warehouse_docking_code : '',
    customer_order_number_rules: (id && warehouse) ? warehouse.customer_order_number_rules : '',
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

  const getRegionalDivisionFormatted = (receptionAreasAll: StateWarehouse[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    receptionAreasAll.forEach((ra) => {
      response.push({
        value: ra.name,
        label: ra.name
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
      if (id) {
        await modify(id, values);
      } else {
        await create(values);
      }
    }
  };

  const formatBody = (values: CargoStationWarehouseForm): CargoStationWarehouseForm => {
    return {
      ...values,
      state_id: values.state_id ? Number(values.state_id) : null
    };
  }

  const create = async (values: CargoStationWarehouseForm) => {
    const response: Response = await createCargoTerminal(formatBody(values));
    treatmentToResponse(response);
  }

  const modify = async (warehouseId: number, values: CargoStationWarehouseForm) => {
    const response: Response = await updateWarehouseById(warehouseId, formatBody(values));
    treatmentToResponse(response);
  }

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      showMsg("Terminal de carga " + (id ? "modificada" : "creada") + " de manera satisfactoria.", { type: "success" });
      router.push(`/${locale}/wms/warehouse_cargo_station`);
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
  }

  const goToEdit = () => {
    router.push(`/${locale}/wms/warehouse_cargo_station/${id}/update`)
  };

  return (
    <div className='user-form-body'>
      <h1 className='text-xl font-semibold'>{id ? (isFromDetails ? "Visualizar" : "Modificar") : "Insertar"} terminal de carga</h1>
      <div className='user-form-body__container'>
        <Formik
          initialValues={initialValues}
          validationSchema={generateValidationSchemaWarehouse(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className='flex flex-col gap-3'>
              <div className='flex gap-3 flex-wrap justify-between'>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="name"
                    placeholder="Nombre del sitio"
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="english_name"
                    placeholder="Nombre del sitio (inglés)"
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="select"
                    name="receiving_area"
                    selectLabel="Seleccione el área de recepción"
                    options={getRegionalDivisionFormatted(receptionAreas)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="principal"
                    placeholder="Principal"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="contact_phone"
                    placeholder="Teléfono de contacto"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'><GenericInput
                  type="select"
                  name="state_id"
                  selectLabel="Seleccione el estado"
                  options={getStatesFormatted(states)}
                  customClass="custom-input"
                  disabled={isFromDetails}
                /></div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="address"
                    placeholder="Dirección 1"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="province"
                    placeholder="Provincia / Estado"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="select"
                    name="country"
                    selectLabel="Seleccione la Nación"
                    options={getStatesFormattedCountries(countries)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="cp"
                    placeholder="Código Postal"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="shared_warehouse_system_code"
                    placeholder="Código del sistema de almacén compartido"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="shared_warehouse_docking_code"
                    placeholder="Código de atraque de almacén compartido"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className='w-full sm:w-[49%]'>
                  <GenericInput
                    type="text"
                    name="customer_order_number_rules"
                    placeholder="Reglas de número de orden de cliente"
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
              </div>
              <div className='flex justify-end gap-3'>
                <div>
                  {
                    !isFromDetails &&
                    (
                      <Button color="primary" type="submit" className='px-4' disabled={isSubmitting || !isValid}>
                        {isSubmitting ? intl.formatMessage({ id: 'sending' }) : (id ? "Modificar" : 'Adicionar')}
                      </Button>
                    )
                  }
                  {
                    isFromDetails && id && (
                      <Button color="primary" onClick={() => goToEdit()} className='px-4' type="button">
                        Ir a edición
                      </Button>
                    )
                  }
                </div>
                <div>
                  <Button onClick={() => cancelSend()} type="button" className='bg-secundary px-4'>
                    {intl.formatMessage({ id: 'cancel' })}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {
          !isFromDetails && (
            <div className='pt-4 flex flex-col gap-3'>
               <div className='font-semibold text-sm'>Formato de número único</div>
              <div className='flex flex-col gap-3'>
                <div><Chip>{"{shipment_id}"}:</Chip> Número de seguimiento del sistema </div>
                <div><Chip>{"{client_reference}"}:</Chip> Número de pedido del cliente </div>
                <div><Chip>{"{ext_numbers}"}:</Chip> Números impares extendidos </div>
                <div><Chip>{"{self_reference}"}:</Chip> Número de seguimiento asociado </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CargoStationWarehouseFormBody;