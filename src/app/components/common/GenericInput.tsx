import React, { InputHTMLAttributes, useState, useEffect } from "react";
import { Field, useField } from "formik";
import "../../../styles/generic.input.scss";
import Image from "next/image";
import { TypeField } from "../../../types";
import dontShowPasswordIcon from "../../../assets/icons/dont_see_passwd.svg";
import showPasswordIcon from "../../../assets/icons/see_passwd.svg";
import passwordIcon from "../../../assets/icons/login/password.svg";
import userIcon from "../../../assets/icons/login/user.svg";
import { useIntl } from "react-intl";
import Select from "react-select";
import { useFormikContext } from "formik";

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
  ...props
}) => {
  // @ts-ignore
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const intl = useIntl();
  const formik = useFormikContext();

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [isTouchedMenu, setIsTouchedMenu] = useState<boolean>(false);

  const inputClassName = `generic-input${
    type === "password" ? " input-with-right-icon" : ""
  }${hasRepresentativeIcon ? " input-with-left-icon" : ""} ${customClass} ${
    meta.touched && meta.error ? "input-error" : ""
  }`;

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "#101935" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor:  "#101935",
        color: "#aeb9e1",
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
  };

  useEffect(() => {
    if (type === "select-filter") {
      const { values } = formik;
      // @ts-ignore
      const value = values[String(props.name)];

      if (value && options && options.length > 0) {
        const filter = options.filter((option) => option.value === value);

        if (filter.length > 0) {
          setSelectedOption(filter[0]);
        }
      } else {
        setSelectedOption(null);
      }
    }
  }, [formik, options, type]);

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
          onChange={(selectedOption) => {
            formik.setFieldValue(
              String(props.name),
              selectedOption ? selectedOption.value : null
            );
          }}
          onMenuClose={() => setIsTouchedMenu(true)}
        />
      )}
      {type !== "select" &&
        type !== "select-filter" &&
        type !== "textarea" &&
        type !== "checkbox" && (
          <input
            {...field}
            {...props}
            type={getTypeField(type)}
            className={inputClassName}
            disabled={disabled}
            placeholder={
              props.placeholder
                ? props.placeholder + (props.required ? " *" : "")
                : ""
            }
          />
        )}
      {props.placeholder && (
        <div className="label-up">
          {props.required && <span className="label-up__required">* </span>}
          {props.placeholder}
        </div>
      )}
      {hasRepresentativeIcon && (
        <div className="container-icon-left elements-center">
          {isUserField && <Image src={userIcon} alt="" className="icon-left" />}
          {isPasswordField && (
            <Image src={passwordIcon} alt="" className="icon-left" />
          )}
        </div>
      )}
      {type === "password" && (
        <div className="container-eyes elements-center">
          {showPassword && (
            <Image
              src={showPasswordIcon}
              alt=""
              className="eye-icon"
              onClick={() => setShowPassword(false)}
            />
          )}
          {!showPassword && (
            <Image
              src={dontShowPasswordIcon}
              alt=""
              className="eye-icon"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
      )}
      {type === "checkbox" && (
        <div>
          <Field type="checkbox" {...props} disabled={disabled} />
          <span style={{ marginLeft: "5px" }}>{props.placeholder}</span>
        </div>
      )}
      {(meta.touched || (type === "select-filter" && isTouchedMenu)) &&
      meta.error ? (
        <div className="error-text">{meta.error}</div>
      ) : (
        <div className="without-error"></div>
      )}
    </div>
  );
};

export default GenericInput;
