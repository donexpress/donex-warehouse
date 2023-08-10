import React from 'react';
import '../../../styles/login.scss';
import Image from 'next/image';
import uCorreosLogo from '../../../assets/icons/uCorreosLogo.jpg';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import GenericInput from './GenericInput';
import { useIntl } from 'react-intl';
import { LoginProps } from '../../../types';
import '../../../styles/common.scss';
import SelectLanguage from './SelectLanguage';
import generateValidationSchema from '../../../validation/generateValidationSchema';


const LoginBody = ({ inWMS, inOMS }: LoginProps) => {
    const intl = useIntl()

    const initialValues = {
      username: '',
      password: '',
    };
  
    const handleSubmit = (values: any) => {
      console.log(values);
    };

    return (
        <div className='login-body scrollable-hidden elements-center'>
            <div className='login-body__container-language'>
                <SelectLanguage/>
            </div>
            <div className='login-body__container'>
                <div className='elements-center'>
                  <Image
                    src={uCorreosLogo}
                    alt=''
                    className='login-body__logo'
                  />
                  <div className='black-label login-body__enterprise-name'>
                    Don Express Warehouse
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
                      />
                      <GenericInput
                        type="password"
                        name="password"
                        placeholder={intl.formatMessage({ id: 'password' })}
                        customClass="custom-input"
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