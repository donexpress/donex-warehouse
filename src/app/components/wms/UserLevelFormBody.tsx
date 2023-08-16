import React from 'react';
import '../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaUserLevel } from '../../../validation/generateValidationSchema';
import { Formik, Form } from 'formik';
import GenericInput from '../common/GenericInput';
import { useIntl } from 'react-intl';
import { UserLevelForm, Response } from '../../../types';
import { createUserLevel } from '../../../services/api.users';
import { UserLevelProps, ValueSelect } from '../../../types';
import { Service } from '../../../types/service';

const UserLevelFormBody = ({ services }: UserLevelProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    
    const initialValues: UserLevelForm = {
      name: '',
      designated_service: 0,
      instructions: ''
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/user_levels`);
          }
      };

      const getServicesFormatted = (servicesAll: Service[]): ValueSelect[] => {
        let response: ValueSelect[] = [];
        servicesAll.forEach((service) => {
          response.push({
            value: service.id,
            label: service.name
          });
        })
        return response;
      };
  
      const handleSubmit = async (values: UserLevelForm) => {
          if (isWMS()) {
              const response: Response = await createUserLevel(values);
              const { locale } = router.query;
              if (response.status >= 200 && response.status <= 299) {
                showMsg("Nivel de usuario creado de manera satisfactoria.", { type: "success" });
                
                router.push(`/${locale}/wms/user_levels`);
              } else {
                let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
                
                showMsg(message, { type: "error" });
              }
          }
      };
    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>Insertar nivel de usuario</b></div>
                <div className='user-form-body__container'>
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchemaUserLevel(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <div className='user-form-body__form'>
                          <GenericInput
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            customClass="custom-input"
                          />
                          <GenericInput
                            type="select"
                            name="designated_service"
                            selectLabel="Seleccione el servicio designado"
                            options={getServicesFormatted(services)}
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
  
export default UserLevelFormBody;