import React from 'react';
import '../../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaPaymentMethod } from '../../../../validation/generateValidationSchema';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { Response } from '../../../../types';
import { createPaymentMethod, updatePaymentMethodById } from '../../../../services/api.payment_method';
import { PaymentMethod, PaymentMethodProps } from '../../../../types/payment_methods';

const PaymentMethodFormBody = ({ id, paymentMethod, isFromDetails }: PaymentMethodProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    
    const initialValues: PaymentMethod = {
      code: (id && paymentMethod) ? paymentMethod.code : '',
      name: (id && paymentMethod) ? paymentMethod.name : '',
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/payment_methods`);
          }
      };
  
      const handleSubmit = async (values: PaymentMethod) => {
          if (isWMS()) {
            if (id) {
              await modify(id, values);
            } else {
              await create(values);
            }
          }
      };

      const create = async (values: PaymentMethod) => {
        const response: Response = await createPaymentMethod(values);
        treatmentToResponse(response);
      }
    
      const modify = async (paymentMethodId: number, values: PaymentMethod) => {
        const response: Response = await updatePaymentMethodById(paymentMethodId, values);
        treatmentToResponse(response);
      }

      const treatmentToResponse = (response: Response) => {
        if (response.status >= 200 && response.status <= 299) {
          const message = id ? intl.formatMessage({ id: 'changedsuccessfullyMsg' }) : intl.formatMessage({ id: 'successfullyMsg' });
          showMsg(message, { type: "success" });
          router.push(`/${locale}/wms/payment_methods`);
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      }

      const goToEdit = () => {
        router.push(`/${locale}/wms/payment_methods/${id}/update`)
      };

    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>{id ? (isFromDetails ? intl.formatMessage({ id: 'vizualice' }) : intl.formatMessage({ id: 'modify' })) : intl.formatMessage({ id: 'insert' })} {intl.formatMessage({ id: 'paymentMethod' })}</b></div>
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
                            placeholder={intl.formatMessage({ id: 'code' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder={intl.formatMessage({ id: 'payment_method_name' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                      </div>
                      
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
  
export default PaymentMethodFormBody;