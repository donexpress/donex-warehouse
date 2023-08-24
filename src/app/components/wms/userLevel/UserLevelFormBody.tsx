import React from 'react';
import '../../../../styles/wms/user.form.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import { generateValidationSchemaUserLevel } from '../../../../validation/generateValidationSchema';
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { Response, ValueSelect } from '../../../../types';
import { createUserLevel, updateUserLevelById } from '../../../../services/api.user_level';
import { UserLevelProps, UserLevel } from '../../../../types/user_levels';
import { Service } from '../../../../types/service';

const UserLevelFormBody = ({ services, id, userLevel, isFromDetails }: UserLevelProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    
    const initialValues: UserLevel = {
      name: (id && userLevel) ? userLevel.name : '',
      service_id: (id && userLevel) ? userLevel.service_id : null,
      observations: (id && userLevel) ? userLevel.observations : ''
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
  
      const formatBody = (values: UserLevel): UserLevel => {
        return {
                ...values, 
                service_id: values.service_id ? Number(values.service_id) : null
              };
      }
  
      const handleSubmit = async (values: UserLevel) => {
          if (isWMS()) {
            if (id) {
              await modify(id, values);
            } else {
              await create(values);
            }
          }
      };

      const create = async (values: UserLevel) => {
        const response: Response = await createUserLevel(formatBody(values));
        treatmentToResponse(response);
      }
    
      const modify = async (userLevelId: number, values: UserLevel) => {
        const response: Response = await updateUserLevelById(userLevelId, formatBody(values));
        treatmentToResponse(response);
      }

      const treatmentToResponse = (response: Response) => {
        if (response.status >= 200 && response.status <= 299) {
          const message = id ? intl.formatMessage({ id: 'changedsuccessfullyMsg' }) : intl.formatMessage({ id: 'successfullyMsg' });
          showMsg(message, { type: "success" });
          router.push(`/${locale}/wms/user_levels`);
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      }

      const goToEdit = () => {
        router.push(`/${locale}/wms/user_levels/${id}/update`)
      };

    return (
        <div className='elements-start-center user-form scrollable-hidden'>
            <div className='user-form-body'>
                <div className='user-form-body__title black-label'><b>{id ? (isFromDetails ? intl.formatMessage({ id: 'vizualice' }) : intl.formatMessage({ id: 'modify' })) : intl.formatMessage({ id: 'insert' })} {intl.formatMessage({ id: 'userLevel' })}</b></div>
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
                            placeholder={intl.formatMessage({ id: 'name' })}
                            customClass="custom-input"
                            disabled={ isFromDetails }
                            required
                          />
                          <GenericInput
                            type="select"
                            name="service_id"
                            selectLabel={intl.formatMessage({ id: 'select_designated_service' })}
                            options={getServicesFormatted(services)}
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
  
export default UserLevelFormBody;