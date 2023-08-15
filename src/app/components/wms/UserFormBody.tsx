import React, { useEffect, useState } from 'react';
import '../../../styles/wms/user.form.scss';
import { showMsg } from '../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaUser } from '../../../validation/generateValidationSchema';
import { Formik, Form, Field } from 'formik';
import GenericInput from '../common/GenericInput';
import { useIntl } from 'react-intl';
import { UserForm } from '../../../types';
import { createUser, getUserById } from '@/services/api.userserege1992';
import { Staff } from '@/types/stafferege1992';
import { getStaff } from '@/services/api.stafferege1992';
import { getSubsidiary } from '@/services/api.subsidiaryerege1992';
import { getRegionalDivision } from '@/services/api.regional_divisionerege1992';
import { getWarehouses } from '@/services/api.warehouseerege1992';

interface Props {
  id?: number
}

const UserFormBody = ({id}:Props) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  const [staff, setStaff] = useState<{value: number, label: string}[]>([])
  const [subsidiaries, setSubsidiaries] = useState<{value: number, label: string}[]>([])
  const [regionalDivisions, setRegionalDivisions] = useState<{value: number, label: string}[]>([])
  const [warehouses, setWarehouses] = useState<{value: number, label: string}[]>([])
  const paymentMethods = [
    {
      value: 1,
      label: 'Mastercard',
    },
    {
      value: 2,
      label: 'Visa',
    }
  ];

  const states = [
    {
      value: 1,
      label: 'Pendiente de revisión',
    },
    {
      value: 2,
      label: 'Certificado',
    },
    {
      value: 3,
      label: 'Sin certificación',
    },
    {
      value: 4,
      label: 'Para ser presentado para la certificación',
    },
    {
      value: 5,
      label: 'Rechazado',
    }
  ];

  let initialValues: UserForm = {
    nickname: '',
    username: '',
    label_code: '',
    password: '',
    payment_method_id: 0,
    state_id: 0,
    contact: '',
    company: '',
    email: '',
    phone_number_mobile: '',
    phone: '',
    qq: '',
    user_level_id: 0,
    credits: '',
    finantial_representative: 0,
    client_service_representative: 0,
    sales_representative: 0,
    sales_source: 0,
    subsidiary_id: 0,
    regional_division_id: 0,
    warehouse_id: 0,
    instructions: '',
    shipping_control: false,
    hidde_transfer_order: false,
    reset_password: false
  };

  useEffect(()=> {
    setup()
  }, [])

  const setup = async() => {
    if(id) {
      const user = await getUserById(id)
      initialValues.nickname = user.nickname
      initialValues.username = user.username
      initialValues.label_code = user.label_code
      initialValues.state_id = user.state_id
      initialValues.contact = user.contact
      initialValues.company = user.company
      initialValues.email = user.email
      initialValues.phone = user.phone
      initialValues.qq = user.qq
      initialValues.credits = user.credits
      initialValues.finantial_representative = user.finantial_representative
      initialValues.client_service_representative = user.client_service_representative
      initialValues.sales_representative = user.sales_representative
      initialValues.sales_source = user.sales_source
      initialValues.subsidiary_id = user.subsidiary_id
      initialValues.regional_division_id = user.regional_division_id
      initialValues.warehouse_id = user.warehouse_id
      initialValues.shipping_control = user.shipping_control
      initialValues.hidde_transfer_order = user.hidde_transfer_order
      initialValues.reset_password = user.reset_password
      // initialValues = {initialValues, ...user}
      console.log(initialValues)
    }
    const staff = await getStaff();
    setStaff(staff.map(el => {return {value: el.id, label: el.chinesse_name}}));

    const subsidiaries = await getSubsidiary();
    setSubsidiaries(subsidiaries.map(el => {return {value: el.id, label: el.name}}));

    const regional_divisions = await getRegionalDivision();
    setRegionalDivisions(regional_divisions.map(el => {return {value: el.id, label: el.name}}))

    // const warehouses = await getWarehouses();
    // setWarehouses(warehouses.map(el => {return {value: el.id, label: el.name}}))

  }

  const handleSubmit = async (values: UserForm) => {
    const response = await createUser(values)
    router.push(`/${locale}/wms/users`)
  };
  return (
    <div className='elements-start-center user-form scrollable-hidden'>
      <div className='user-form-body'>
        <div className='user-form-body__title black-label'><b>{id ? "Modificar" : "Insertar"} usuario</b></div>
        <div className='user-form-body__container'>
          <Formik
            initialValues={initialValues}
            validationSchema={generateValidationSchemaUser(intl)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className='user-form-body__form'>
                  <GenericInput
                    type="text"
                    name="nickname"
                    placeholder="Apodo"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="username"
                    placeholder={intl.formatMessage({ id: 'username' })}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="password"
                    name="password"
                    placeholder={intl.formatMessage({ id: 'password' })}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="label_code"
                    placeholder="Código de etiqueta"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="payment_method_id"
                    selectLabel="Seleccione método de pago"
                    options={paymentMethods}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="state_id"
                    selectLabel="Seleccione el estado"
                    options={states}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="contact"
                    placeholder="Persona de contacto"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="company"
                    placeholder="Compañía"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="email"
                    placeholder="Correo electrónico"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="phone_number_mobile"
                    placeholder="Teléfono móvil"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="qq"
                    placeholder="QQ"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="user_level_id"
                    selectLabel="Seleccione el nivel de usuario"
                    options={[]}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="text"
                    name="credits"
                    placeholder="Créditos"
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="finantial_representative"
                    selectLabel="Seleccione representante financiero"
                    options={staff}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="client_service_representative"
                    selectLabel="Seleccione representante de servicio al cliente"
                    options={staff}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="sales_representative"
                    selectLabel="Seleccione representante de ventas"
                    options={staff}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="sales_source"
                    selectLabel="Seleccione la fuente de ventas"
                    options={staff}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="subsidiary_id"
                    selectLabel="Seleccione el subsidiario"
                    options={subsidiaries}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="regional_division_id"
                    selectLabel="Seleccione el área de recepción"
                    options={regionalDivisions}
                    customClass="custom-input"
                  />
                  <GenericInput
                    type="select"
                    name="warehouse_id"
                    selectLabel="Seleccione el sitio"
                    options={[]}
                    customClass="custom-input"
                  />
                </div>
                <GenericInput
                  type="textarea"
                  name="instructions"
                  placeholder="Observaciones"
                  customClass="custom-input"
                />
                <GenericInput type='checkbox' name="shipping_control" placeholder='Control de Envío' customClass='custom-input'/>
                <GenericInput type='checkbox' name="hidde_transfer_order" placeholder='Ocultar Orden de Transferencia' customClass='custom-input '/>
                <GenericInput type='checkbox' name="reset_password" placeholder='Reinciar Contraseña' customClass='custom-input '/>
                <div className='user-form-body__buttons'>
                  <div>
                    <button
                      type="submit"
                      className='user-form-body__accept_button'
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? intl.formatMessage({ id: 'sending' }) : id ? "Modificar" :'Crear'}
                    </button>
                  </div>
                  <div>

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

export default UserFormBody;