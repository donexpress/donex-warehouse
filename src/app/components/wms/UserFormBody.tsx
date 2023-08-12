import React from 'react';
import '../../../styles/wms/user.form.scss';
import { showMsg } from '../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaUser } from '../../../validation/generateValidationSchema';
import { Formik, Form } from 'formik';
import GenericInput from '../common/GenericInput';
import { useIntl } from 'react-intl';
import { UserForm } from '../../../types';

const UserFormBody = () => {
    const router = useRouter();
    const intl = useIntl();
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
    
    const initialValues: UserForm = {
        fullname: '',
        username: '',
        label_code: '',
        password: '',
        payment_method: 0,
        state: 0,
        contact_person: '',
        company: '',
        email: '',
        phone_number_mobile: '',
        phone_number: '',
        qq: '',
        user_level: 0,
        credits: '',
        financial: 0,
        service_client: 0,
        sales: 0,
        source_sales: 0,
        subsidiary: 0,
        reception_area: 0,
        site: 0,
        instructions: '',
        actions: []
      };
  
      const handleSubmit = async (values: UserForm) => {
          
      };
    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>Insertar usuario</b></div>
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
                            name="fullname"
                            placeholder="Nombre completo"
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
                            name="payment_method"
                            selectLabel="Seleccione método de pago"
                            options={paymentMethods}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="state"
                            selectLabel="Seleccione el estado"
                            options={states}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="contact_person"
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
                            name="phone_number"
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
                            name="user_level"
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
                            name="financial"
                            selectLabel="Seleccione representante financiero"
                            options={[]}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="service_client"
                            selectLabel="Seleccione representante de servicio al cliente"
                            options={[]}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="sales"
                            selectLabel="Seleccione representante de ventas"
                            options={[]}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="source_sales"
                            selectLabel="Seleccione la fuente de ventas"
                            options={[]}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="subsidiary"
                            selectLabel="Seleccione el subsidiario"
                            options={[]}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="reception_area"
                            selectLabel="Seleccione el área de recepción"
                            options={[]}
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="site"
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