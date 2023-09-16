import React, { InputHTMLAttributes, useState, useEffect, ChangeEvent, useCallback } from 'react';
import { Field, useField } from 'formik';
import '../../../styles/generic.input.scss';
import Image from 'next/image';
import { TypeField } from '../../../types';
import dontShowPasswordIcon from '../../../assets/icons/dont_see_passwd.svg';
import showPasswordIcon from '../../../assets/icons/see_passwd.svg';
import passwordIcon from '../../../assets/icons/login/password.svg';
import userIcon from '../../../assets/icons/login/user.svg';
import { useIntl } from 'react-intl';
import Select from 'react-select';
import { useFormikContext } from 'formik';

type OptionType = {
  value: string | number;
  label: string;
};

type GenericInputProps = {
  label?: string;
  selectLabel?: string;
  type: TypeField;
  options?: OptionType[];
  customClass?: string;
  hasRepresentativeIcon?: boolean;
  isUserField?: boolean;
  isPasswordField?: boolean;
  disabled?: boolean;
  minValue?: number;
  hideErrorContent?: boolean;
  selectDateMinToday?: boolean;
  onChangeFunction?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  getValueChangeFn?: (value: any)=>void;
  isMulti?: boolean;
} & InputHTMLAttributes<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

const GenericInput: React.FC<GenericInputProps> = ({
  label,
  selectLabel,
  type,
  options,
  customClass,
  hasRepresentativeIcon,
  isUserField,
  isPasswordField,
  disabled = false,
  hideErrorContent = false,
  onChangeFunction,
  isMulti=false,
  minValue=undefined,
  selectDateMinToday=false,
  getValueChangeFn,
  ...props
}) => {
  // @ts-ignore
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const intl = useIntl();
  const formik = useFormikContext();

  const [selectedOption, setSelectedOption] = useState<OptionType | OptionType[] | null>(null);
  const [isTouchedMenu, setIsTouchedMenu] = useState<boolean>(false);

  const inputClassName = `generic-input${
    type === "password" ? " input-with-right-icon" : ""
  }${hasRepresentativeIcon ? " input-with-left-icon" : ""} ${customClass} ${
    meta.touched && meta.error ? "input-error" : ""
  }`;

  const colourStyles = {
    control: (styles: any) => ({ ...styles, backgroundColor: "#101935", borderColor: "#343b4f", paddingTop: "3px", paddingBottom: "3px",
    "&:hover": {
      borderColor: "#7e89ac",
    },
    "&:focus": {
      borderColor: "#7e89ac",
    }, }),
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
        ...styles,
        backgroundColor:  "#1c2c4c",
        color: "#aeb9e1",
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
    placeholder: (provided: any) => ({
      ...provided,
      color: '#aeb9e1',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#333',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#aeb9e1',
    }),
  };

  useEffect(() => {
      if (type === "select-filter") {
        const { values } = formik;
        // @ts-ignore
        const value = values[String(props.name)];

        if (isMulti) {
          // Tratar valores múltiples
          if (value && options && options.length > 0) {
            const selectedOptions = options.filter((option) =>
              value.includes(option.value)
            );
            setSelectedOption(selectedOptions);
          } else {
            setSelectedOption([]);
          }
        } else {
          if (value && options && options.length > 0) {
            const filter = options.filter((option) => option.value === value);

            if (filter.length > 0) {
              setSelectedOption(filter[0]);
            }
          } else {
            setSelectedOption(null);
          }
        }

      }
  }, []);

  const onChangeReactSelect = (value: number | number[]) => {
    if (type === "select-filter") {
      if (isMulti) {
        // Tratar valores múltiples
        if (value && options && options.length > 0) {
          const selectedOptions = options.filter((option) =>
            (value as number[]).includes(Number(option.value))
          );
          setSelectedOption(selectedOptions);
          if (getValueChangeFn !== undefined) {
            getValueChangeFn(selectedOptions);
          }
        } else {
          setSelectedOption([]);
        }
      } else {
        if (value && options && options.length > 0) {
          // @ts-ignore
          const filter = options.filter((option) => option.value === value);

          if (filter.length > 0) {
            setSelectedOption(filter[0]);
            if(getValueChangeFn)
            getValueChangeFn(value);
          }
        } else {
          setSelectedOption(null);
        }
      }
    }
  }

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (onChangeFunction) {
        onChangeFunction(event);
      }
      formik.handleChange(event);
      if (type === "number" && minValue !== undefined) {
        const newValue = event.target.value;
        const parsedValue = parseFloat(newValue);

        if (!isNaN(parsedValue) && parsedValue < minValue) {
          formik.setFieldValue(String(props.name), minValue);
        } else {
          formik.handleChange(event);
        }
      } else if (type === "date") {
        const newValue = event.target.value;
        const selectedDate = new Date(newValue);
        const currentDate = new Date();

        if (selectDateMinToday && selectedDate < currentDate) {
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          
          const formattedDate = `${year}-${month}-${day}`;
          formik.setFieldValue(String(props.name), formattedDate);
        } else {
          formik.handleChange(event);
        }
      } else {
        formik.handleChange(event);
      }
    },
    [formik, onChangeFunction]
  );

  const getTypeField = (typeField: TypeField) => {
    if (typeField === "password") {
      return showPassword ? "text" : "password";
    }
    return typeField;
  };

  return (
    <div className="input-container">
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      {type === "select" && (
        <select
          {...field}
          {...props}
          className={inputClassName}
          disabled={disabled}
          autoComplete="on"
          onChange={handleChange}
        >
          <option
            value=""
            label={
              (selectLabel
                ? selectLabel
                : intl.formatMessage({ id: "selectOption" })) +
              (props.required ? " *" : "")
            }
          />
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      )}
      {type === "textarea" && (
        <textarea
          {...field}
          {...props}
          className={inputClassName}
          disabled={disabled}
        />
      )}
      {type === "select-filter" && (
        <Select
          styles={colourStyles}
          name={props.name}
          options={options}
          className={customClass}
          isDisabled={disabled}
          placeholder={props.placeholder + (props.required ? " *" : "")}
          isSearchable
          value={selectedOption}
          isMulti={isMulti}
          onChange={(selectedOption: any) => {
            let value: any = null;
            if (Array.isArray(selectedOption)) {
              const selectedValues = selectedOption.map(option => option.value);
              formik.setFieldValue(String(props.name), selectedValues);
              value = selectedValues;
            } else {
              formik.setFieldValue(String(props.name), selectedOption ? selectedOption.value : null);
              value = selectedOption ? selectedOption.value : null;
            }
            onChangeReactSelect(value);
          }}
          onMenuClose={() => setIsTouchedMenu(true)}
        />
      )}
      {
        type !== 'select' && type !== 'select-filter' && type !== 'textarea' && type !== 'checkbox' && 
        <input {...field} {...props} onChange={handleChange} type={getTypeField(type)} className={inputClassName} disabled={disabled} placeholder={ props.placeholder ? (props.placeholder + (props.required ? ' *' : '')) : "" } />
      }
      {
        props.placeholder && (
          <div className='label-up'>{props.required && (<span className='label-up__required'>* </span>)}{props.placeholder}</div>
        )
      }
      {
        hasRepresentativeIcon && (
          <div className='container-icon-left elements-center'>
            {
              isUserField &&
              <Image
                src={userIcon}
                alt=''
                className='icon-left'
              />
            }
            {
              isPasswordField &&
              <Image
                src={passwordIcon}
                alt=''
                className='icon-left'
              />
            }
          </div>
        )
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
      {
        type === 'checkbox' && (
          <div>
            <Field type="checkbox" {...props}  disabled={disabled} onChange={handleChange} />
            <span style={{marginLeft: '5px'}}>{props.placeholder}</span>
          </div>
        )
      }
      {
        !hideErrorContent && (
          <div>
            {(meta.touched || (type === 'select-filter' && isTouchedMenu)) && meta.error ? (
              <div className='error-text'>{meta.error}</div>
            ) : (<div className='without-error'></div>)}
          </div>
        )
      }
    </div>
  );
};

export default GenericInput;
