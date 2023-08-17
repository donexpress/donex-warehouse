import React from 'react';
import '../../../styles/login.scss';
import Image from 'next/image';
import logoDE from '../../../assets/icons/logo_desktop.png';
import { Formik, Form } from 'formik';
import GenericInput from './GenericInput';
import { useIntl } from 'react-intl';
import { AppProps, LoginBody, LoginResponse } from '../../../types';
import '../../../styles/common.scss';
import SelectLanguage from './SelectLanguage';
import generateValidationSchema from '../../../validation/generateValidationSchema';
import { login } from '../../../services/api.users';
import { setCookie } from '../../../helpers/cookieUtils';
import { showMsg } from '../../../helpers';
import { useRouter } from 'next/router'

const LoginBody = ({ inWMS, inOMS }: AppProps) => {
    const router = useRouter();
    const intl = useIntl()

    const initialValues: LoginBody = {
      username: '',
      password: '',
    };
  
    const handleSubmit = async (values: LoginBody) => {
      const response: LoginResponse = await login(values);
      const { locale } = router.query;
      if (response.status >= 200 && response.status <= 299 && response.token !== undefined) {
        showMsg(intl.formatMessage({ id: 'successLoginMsg' }), { type: "success" });
        
        if (inWMS) {
          setCookie('tokenWMS', response.token);
          setCookie('profileWMS', JSON.stringify({username: values.username}));
          router.push(`/${locale}/wms`);
        } else {
          setCookie('tokenOMS', response.token);
          setCookie('profileOMS', JSON.stringify({username: values.username}));
          router.push(`/${locale}/oms`);
        }
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        if (response.status === 401) {
          message = intl.formatMessage({ id: 'dontExistUserPasswordMsg' });
        }
        showMsg(message, { type: "error" });
      }
    };

    return (
        <div className='login-body scrollable-hidden elements-center'>
            <div className='login-body__background'>
              <div className='login-body__stuffed'>
                <div className='login-body__low-background'></div>
              </div>
            </div>
            <div className='login-body__container-language'>
                <SelectLanguage isFromLogin={true}/>
            </div>
            <div className='login-body__container'>
                <div className='elements-center'>
                  <Image
                    src={logoDE}
                    alt=''
                    className='login-body__logo'
                  />
                  <div className='black-label login-body__enterprise-name'>
                    Don Express Warehouse {inWMS && "WMS"}{inOMS && "OMS"}
                  </div>
                </div>
                {
                  inWMS && (
                    <div className='note-wms'>
                      <b>{intl.formatMessage({ id: 'wmsLoginNoteMain' })}</b> {intl.formatMessage({ id: 'wmsLoginNoteSecondary' })}
                    </div>
                  )
                }
                <Formik
                  initialValues={initialValues}
                  validationSchema={generateValidationSchema(intl)}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <GenericInput
                        type="text"
                        name="username"
                        placeholder={intl.formatMessage({ id: 'username' })}
                        customClass="custom-input"
                        hasRepresentativeIcon={true}
                        isUserField={true}
                      />
                      <GenericInput
                        type="password"
                        name="password"
                        placeholder={intl.formatMessage({ id: 'password' })}
                        customClass="custom-input"
                        hasRepresentativeIcon={true}
                        isPasswordField={true}
                      />
                      <button
                        type="submit"
                        className='login-button'
                        disabled={isSubmitting || !isValid}
                      >
                        {isSubmitting ? intl.formatMessage({ id: 'sending' }) : intl.formatMessage({ id: 'login' })}
                      </button>
                    </Form>
                  )}
                </Formik>
            </div>
        </div>
    );
};
  
export default LoginBody;