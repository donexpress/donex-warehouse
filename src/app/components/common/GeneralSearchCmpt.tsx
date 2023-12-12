import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
} from "@nextui-org/react";
import Select from 'react-select';
import { capitalize } from "../../../helpers/utils";
import { useIntl } from "react-intl";
import "../../../styles/general.search.scss";
import "./../../../styles/generic.input.scss";
import { InputData } from "../../../types/general_search";
import { SearchIcon } from "./SearchIcon";

interface Params {
    data: InputData[];
    getQueryFn: (urlParams: string) => void;
    shouldResetFields: boolean;
    isMajorFields?: boolean;
};

interface SearchFields {
    [key: string]: string;
};

const GeneralSearchCmpt = ({ data, getQueryFn, shouldResetFields, isMajorFields = false }: Params) => {
    const [searchFields, setSearchFields] = useState<SearchFields>({});
    const [inputs, setInputs] = useState<InputData[]>([]);
    const [firstLoad, setFirstLoad] = useState<boolean>(true);

    useEffect(() => {
        setInputs(data);
    }, [data]);

    useEffect(() => {
        if (!firstLoad) {
          setSearchFields(resetParams());
        } else {
          setFirstLoad(false);
        }
    }, [shouldResetFields]);

    const resetParams = () => {
      const resetFields: SearchFields = {};
    
      Object.keys(searchFields).forEach((key) => {
        resetFields[key] = "";
      });
    
      return resetFields;
    }

    const handleFieldChange = (key: string, value: string) => {
        const response: SearchFields = {
            ...searchFields,
            [key]: value
        }
        setSearchFields(response);
        getQuery(response);
    };

    const onClear = (key: string) => {
        const response: SearchFields = {
            ...searchFields,
            [key]: ""
        }
        setSearchFields(response);
        getQuery(response);
    };

    const getQuery = (sf: SearchFields) => {
      const nonEmptyValues = Object.values(sf).filter((value) => value && value !== "");
      let queryString = "";
      if (nonEmptyValues.length > 0) {
        const resultObject: SearchFields = {};
  
        Object.entries(sf).forEach(([key, value]) => {
          if (value && value !== "") {
            resultObject[key] = value;
          }
        });
        queryString = encodeURI(JSON.stringify(resultObject));
      }console.log(queryString)
      //const queryArrString = Object.entries(sf)
      //  .map(([key, value]) => (value && value.trim() !== "") ? `${key}=${encodeURIComponent(value)}` : '');

      //const queryString = queryArrString.length > 0 ? queryArrString.filter((qs: string) => qs !== '').join('&') : "";
        getQueryFn(queryString);
    };

    const getLabel = (inputData: InputData, value: string) => {
        const element = inputData.selectionItems ? inputData.selectionItems.find(si => si.value === value) : undefined;
        return element ? element.label : "";
    };

    return inputs.length > 0 ? (
        <div className={isMajorFields ? "container-search-inputs-major" : "container-search-inputs"}>
            {inputs.map((inputData: InputData) => (
                <div key={inputData.key}>
                    {inputData.type === "text" && (
                        <Input
                          isClearable
                          className="search-input"
                          placeholder={inputData.placeholder}
                          startContent={<SearchIcon />}
                          value={searchFields[inputData.key]}
                          onClear={() => onClear(inputData.key)}
                          onChange={(e) => handleFieldChange(inputData.key, e.target.value)}
                        />
                    )}
                    {inputData.type === "select" && (
                        <Select
                          isSearchable
                          options={inputData.selectionItems ? inputData.selectionItems.map((column) => ({
                            value: column.value,
                            label: capitalize(column.label)
                          })) : []}
                          value={searchFields[inputData.key].trim() !== "" ? { value: searchFields[inputData.key], label: getLabel(inputData, searchFields[inputData.key]) } : null}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                                handleFieldChange(inputData.key, selectedOption.value);
                            } else {
                                handleFieldChange(inputData.key, "");
                            }
                          }}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: "#212c4d !important",
                              border: "1px solid #37446b !important",
                              borderRadius: "4px !important",
                              height: "40px",
                            }),
                            option: (provided) => ({
                              ...provided,
                              color: "#aeb9e1",
                              backgroundColor: "#212c4d !important",
                            }), placeholder: (provided) => ({
                              ...provided,
                              color: "#aeb9e1",
                              fontWeight: 400,
                              fontSize: "var(--nextui-font-size-small)"
                            }), input: (provided) => ({
                              ...provided,
                              color: "#aeb9e1",
                              fontWeight: 400,
                              fontSize: "var(--nextui-font-size-small)"
                            }), singleValue: (provided) => ({
                              ...provided,
                              color: "#aeb9e1",
                              fontWeight: 400,
                              fontSize: "var(--nextui-font-size-small)"
                            }), menu: (provided) => ({
                              ...provided,
                              color: "#aeb9e1",
                              backgroundColor: "#212c4d !important",
                              fontWeight: 400,
                              fontSize: "var(--nextui-font-size-small)"
                            }),
                          }}
                          placeholder={inputData.placeholder}
                        />
                    )}
                </div>
            ))}
        </div>
    ) : null
};

export default GeneralSearchCmpt;