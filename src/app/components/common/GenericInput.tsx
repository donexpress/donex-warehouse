import React, { InputHTMLAttributes, useState } from 'react';
import { useField } from 'formik';
import '../../../styles/generic.input.scss';
import Image from 'next/image';
import { TypeField } from '../../../types';
import dontShowPasswordIcon from '../../../assets/icons/dont_see_passwd.svg';
import showPasswordIcon from '../../../assets/icons/see_passwd.svg';
import { useIntl } from 'react-intl';

type GenericInputProps = {
  label?: string;
  selectLabel?: string;
  type: TypeField;
  options?: { value: string | number; label: string }[];
  customClass?: string;
} & InputHTMLAttributes<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

const GenericInput: React.FC<GenericInputProps> = ({
  label,
  selectLabel,
  type,
  options,
  customClass,
  ...props
}) => {
  // @ts-ignore
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const intl = useIntl()

  const inputClassName = `generic-input${type === 'password' ? ' input-with-left-icon' : ''} ${customClass} ${
    meta.touched && meta.error ? 'input-error' : ''
  }`;

  const getTypeField = (typeField: TypeField) => {
    if (typeField === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return typeField;
  };

  return (
    <div className='input-container'>
      {label &&  
        <label htmlFor={props.id || props.name}>{label}</label>
      }
      {
        type === 'select' &&
        <select {...field} {...props} className={inputClassName}>
          <option value="" label={ selectLabel ? selectLabel : intl.formatMessage({ id: 'selectOption' })} />
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      }
      {
        type === 'textarea' &&
        <textarea {...field} {...props} className={inputClassName} />
      }
      {
        type !== 'select' && type !== 'textarea' && 
        <input {...field} {...props} type={getTypeField(type)} className={inputClassName} />
      }
      {
        type === 'password' && (
          <div className='container-eyes elements-center'>
            {showPassword &&
              <Image
                src={showPasswordIcon}
                alt=''
                className='eye-icon'
                onClick={() => setShowPassword(false)}
              />
            }
            {!showPassword &&
              <Image
                src={dontShowPasswordIcon}
                alt=''
                className='eye-icon'
                onClick={() => setShowPassword(true)}
              />
            }
          </div>
        )
      }
      {meta.touched && meta.error ? (
        <div className='error-text'>{meta.error}</div>
      ) : (<div className='without-error'></div>)}
    </div>
  );
};

export default GenericInput;
