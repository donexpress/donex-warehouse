import React from 'react';
import '../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaPaymentMethod } from '../../../validation/generateValidationSchema';
import { Formik, Form } from 'formik';
import GenericInput from '../common/GenericInput';
import { useIntl } from 'react-intl';
import { PaymentMethodForm, Response } from '../../../types';
import { createPaymentMethod } from '../../../services/api.users';

const PaymentMethodFormBody = () => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    
    const initialValues: PaymentMethodForm = {
      code: '',
      name: '',
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/payment_methods`);
          }
      };
  
      const handleSubmit = async (values: PaymentMethodForm) => {
          if (isWMS()) {
              const response: Response = await createPaymentMethod(values);
              const { locale } = router.query;
              if (response.status >= 200 && response.status <= 299) {
                showMsg("Método de pago creado de manera satisfactoria.", { type: "success" });
                
                router.push(`/${locale}/wms/payment_methods`);
              } else {
                let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
                
                showMsg(message, { type: "error" });
              }
          }
      };
    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>Insertar método de pago</b></div>
                <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaPaymentMethod(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <div className='user-form-body__form'>
                          <GenericInput
                            type="text"
                            name="code"
                            placeholder="Código"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder="Nombre del método de pago"
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
  
export default PaymentMethodFormBody;