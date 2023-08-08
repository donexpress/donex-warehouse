import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import '../../../styles/generic.input.scss';

type GenericInputProps = {
  label?: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'daterange' | 'tel' | 'search';
  options?: { value: string; label: string }[];
  customClass?: string;
  name: string;
} & InputHTMLAttributes<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

const GenericInput: React.FC<GenericInputProps> = ({
  label,
  type,
  options,
  customClass,
  name,
  ...inputProps
}) => {
  const [field, meta] = useField(name);

  const inputClassName = `genericInput ${customClass} ${
    meta.touched && meta.error ? 'inputError' : ''
  }`;

  return (
    <div className='inputContainer'>
      {label &&  
        <label htmlFor={inputProps.id || name}>{label}</label>
      }
      {
        type === 'select' &&
        <select {...field} {...inputProps} className={inputClassName}>
          <option value="" label="Selecciona una opción" />
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
        <textarea {...field} {...inputProps} className={inputClassName} />
      }
      {
        type !== 'select' && type !== 'textarea' && 
        <input {...field} {...inputProps} type={type} className={inputClassName} />
      }
      {meta.touched && meta.error ? (
        <div className='errorText'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default GenericInput;
