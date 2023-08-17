import React, { useEffect, useState } from 'react';
import '../../../styles/wms/user.form.scss';
import { showMsg } from '../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaUser, generateValidationSchemaUserModify } from '../../../validation/generateValidationSchema';
import { Formik, Form } from 'formik';
import GenericInput from '../common/GenericInput';
import { useIntl } from 'react-intl';
import { UserForm, Response } from '../../../types';
import { createUser, updateUser } from '@/services/api.userserege1992';
import { UserFormProps } from '../../../types';

const UserFormBody = ({ id, user, isFromShowUser, staffList, regionalDivisionList, subsidiarieList, warehouseList, userLevelList, paymentMethodList, userStateList }: UserFormProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  const [staff, setStaff] = useState<{value: number, label: string}[]>([])
  const [subsidiaries, setSubsidiaries] = useState<{value: number, label: string}[]>([])
  const [regionalDivisions, setRegionalDivisions] = useState<{value: number, label: string}[]>([])
  const [warehouses, setWarehouses] = useState<{value: number, label: string}[]>([])
  const [userLevels, setUserLevels] = useState<{value: number, label: string}[]>([])
  const [paymentMethods, setPaymentMethods] = useState<{value: number, label: string}[]>([])
  const [userStates, setUserStates] = useState<{value: number, label: string}[]>([])

  let initialValues: UserForm = {
    nickname: (id && user) ? user.nickname : '',
    username: (id && user) ? user.username : '',
    label_code: (id && user) ? user.label_code : '',
    password: '',
    payment_method_id: (id && user) ? (user.payment_method_id !== null ? user.payment_method_id : null) : null,
    state_id: (id && user) ? (user.state_id !== null ? user.state_id : null) : null,
    contact: (id && user) ? user.contact : '',
    company: (id && user) ? user.company : '',
    email: (id && user) ? user.email : '',
    phone_number_mobile: (id && user) ? user.phone : '',
    phone: (id && user) ? user.phone : '',
    qq: (id && user) ? user.qq : '',
    user_level_id: (id && user) ? (user.user_level_id !== null ? user.user_level_id : null) : null,
    credits: '',
    finantial_representative: (id && user) ? (user.finantial_representative !== null ? user.finantial_representative : null) : null,
    client_service_representative: (id && user) ? (user.client_service_representative !== null ? user.client_service_representative : null) : null,
    sales_representative: (id && user) ? (user.sales_representative !== null ? user.sales_representative : null) : null,
    sales_source: (id && user) ? (user.sales_source !== null ? user.sales_source : null) : null,
    subsidiary_id: (id && user) ? (user.subsidiary_id !== null ? user.subsidiary_id : null) : null,
    regional_division_id: (id && user) ? (user.regional_division_id !== null ? user.regional_division_id : null) : null,
    warehouse_id: (id && user) ? (user.warehouse_id !== null ? user.warehouse_id : null) : null,
    observations: (id && user) ? user.observations : '',
    shipping_control: (id && user) ? user.shipping_control : false,
    hidde_transfer_order: (id && user) ? user.hidde_transfer_order : false,
    reset_password: (id && user) ? user.reset_password : false
  };

  useEffect(()=> {
    setStaff(staffList.map(el => {return {value: el.id, label: el.chinesse_name}}));
    setSubsidiaries(subsidiarieList.map(el => {return {value: el.id, label: el.name}}));
    setRegionalDivisions(regionalDivisionList.map(el => {return {value: el.id, label: el.name}}))
    setWarehouses(warehouseList.map(el => {return {value: el.id, label: el.name}}))
    setPaymentMethods(paymentMethodList.map(el => {return {value: el.id, label: el.name}}))
    setUserLevels(userLevelList.map(el => {return {value: el.id, label: el.name}}))
    setUserStates(userStateList.map(el => {return {value: el.id, label: el.name}}))
  }, []);

  const handleSubmit = async (values: UserForm) => {
    if (id) {
      await modify(id, values);
    } else {
      await create(values);
    }
  };
  
  const formatBody = (values: UserForm): UserForm => {
    return {
            ...values, 
            payment_method_id: values.payment_method_id ? Number(values.payment_method_id) : null, 
            state_id: values.state_id ? Number(values.state_id) : null, 
            user_level_id: values.user_level_id ? Number(values.user_level_id) : null, 
            finantial_representative: values.finantial_representative ? Number(values.finantial_representative) : null, 
            client_service_representative: values.client_service_representative ? Number(values.client_service_representative) : null, 
            sales_representative: values.sales_representative ? Number(values.sales_representative) : null, 
            sales_source: values.sales_source ? Number(values.sales_source) : null, 
            subsidiary_id: values.subsidiary_id ? Number(values.subsidiary_id) : null, 
            regional_division_id: values.regional_division_id ? Number(values.regional_division_id) : null, 
            warehouse_id: values.warehouse_id ? Number(values.warehouse_id) : null
          };
  }

  const create = async (values: UserForm) => {
    const response: Response = await createUser(formatBody(values))
    treatmentToResponse(response);
  }

  const modify = async (userId: number, values: UserForm) => {
    const response: Response = await updateUser(userId, formatBody(values))
    treatmentToResponse(response);
  }

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      showMsg("Usuario " + (id ? "modificado" : "creado") + " de manera satisfactoria.", { type: "success" });
      router.push(`/${locale}/wms/users`);
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
    }
  }

  const cancelSend = () => {
    router.push(`/${locale}/wms/users`)
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/users/${id}/update_user`)
  };
  return (
    <div className='elements-start-center user-form scrollable-hidden'>
      <div className='user-form-body'>
        <div className='user-form-body__title black-label'><b>{id ? (isFromShowUser ? "Visualizar" : "Modificar") : "Insertar"} usuario</b></div>
        <div className='user-form-body__container'>
          <Formik
            initialValues={initialValues}
            validationSchema={id ? generateValidationSchemaUserModify(intl) : generateValidationSchemaUser(intl)}
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
                    disabled={ isFromShowUser }
                    required
                  />
                  <GenericInput
                    type="text"
                    name="username"
                    placeholder={intl.formatMessage({ id: 'username' })}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                    required
                  />
                  <GenericInput
                    type="password"
                    name="password"
                    placeholder={intl.formatMessage({ id: 'password' })}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                    required={ !id }
                  />
                  <GenericInput
                    type="text"
                    name="label_code"
                    placeholder="Código de etiqueta"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="payment_method_id"
                    selectLabel="Seleccione método de pago"
                    options={paymentMethods}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="state_id"
                    selectLabel="Seleccione el estado"
                    options={userStates}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="contact"
                    placeholder="Persona de contacto"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="company"
                    placeholder="Compañía"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="email"
                    placeholder="Correo electrónico"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="phone_number_mobile"
                    placeholder="Teléfono móvil"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="qq"
                    placeholder="QQ"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="user_level_id"
                    selectLabel="Seleccione el nivel de usuario"
                    options={userLevels}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="text"
                    name="credits"
                    placeholder="Créditos"
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="finantial_representative"
                    selectLabel="Seleccione representante financiero"
                    options={staff}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="client_service_representative"
                    selectLabel="Seleccione representante de servicio al cliente"
                    options={staff}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="sales_representative"
                    selectLabel="Seleccione representante de ventas"
                    options={staff}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="sales_source"
                    selectLabel="Seleccione la fuente de ventas"
                    options={staff}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="subsidiary_id"
                    selectLabel="Seleccione el subsidiario"
                    options={subsidiaries}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="regional_division_id"
                    selectLabel="Seleccione el área de recepción"
                    options={regionalDivisions}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                  <GenericInput
                    type="select"
                    name="warehouse_id"
                    selectLabel="Seleccione el sitio"
                    options={warehouses}
                    customClass="custom-input"
                    disabled={ isFromShowUser }
                  />
                </div>
                <GenericInput
                  type="textarea"
                  name="observations"
                  placeholder="Observaciones"
                  customClass="custom-input"
                  disabled={ isFromShowUser }
                />
                <GenericInput type='checkbox' name="shipping_control" placeholder='Control de Envío' customClass='custom-input' disabled={ isFromShowUser }/>
                <GenericInput type='checkbox' name="hidde_transfer_order" placeholder='Ocultar Orden de Transferencia' customClass='custom-input ' disabled={ isFromShowUser }/>
                <GenericInput type='checkbox' name="reset_password" placeholder='Reinciar Contraseña' customClass='custom-input ' disabled={ isFromShowUser }/>
                <div className='user-form-body__buttons'>
                  <div>
                    {
                      !isFromShowUser &&
                      (
                        <button
                          type="submit"
                          className='user-form-body__accept_button'
                          disabled={isSubmitting || !isValid}
                        >
                          {isSubmitting ? intl.formatMessage({ id: 'sending' }) : id ? "Modificar" :'Crear'}
                        </button>
                      )
                    }
                    {
                      isFromShowUser && id &&
                      (
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

export default UserFormBody;