import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { Carrier, MWB } from '../../../types';
import '../../../styles/generic.dialog.scss';
import { capitalize } from "@material-ui/core";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { indexCarriers } from "@/services/api.carrierserege1992";
import React from "react";
import { generateShippingInvoice } from "@/services/api.manifesterege1992";
import { Loading } from "./Loading";
import { indexWaybillIDS } from "@/services/api.waybillerege1992";
import { showMsg } from "@/helperserege1992";
import Select from 'react-select';
import { Form, Formik } from "formik";
import GenericInput from "./GenericInput";
import { ShippingInvoice } from "@/types/guideerege1992";

interface Params {
  close: () => any;
  title: string;
}

const GenerateDialog = ({ close, title }: Params) => {
  const intl = useIntl();

  const [carriers, setCarriers] = useState<Carrier[] | null>([]);
  const [waybillIDS, setWaybillIDS] = useState<MWB[] | null>([]);
  const [carrierValue, setCarrierValue] = React.useState("");
  const [waybillIDValue, setWaybillIDValue] = React.useState("");

  const [date, setDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [disableConfirm, setDisableConfirm] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState('mwb');
  const [billCodeValue, setBillCodeValue] = React.useState("");

  useEffect(() => {
    loadCarriers();
    loadMWB();
  }, []);

  const loadCarriers = async () => {
    const _carriers = await indexCarriers();
    setCarriers(_carriers);
  }

  const loadMWB = async () => {
    const _waybillIDS = await indexWaybillIDS();
    setWaybillIDS(_waybillIDS);
  }

  const handleSubmit = async () => {
    try {
      setDisableConfirm(true);
      let response: any = null;
      const data = {
        waybill_id: waybillIDValue,
        carrier: carrierValue,
        eta: date
      };
      response = await generateShippingInvoice(data);

      setDisableConfirm(false);
      if (response.status && response.status >= 200 && response.status <= 299) {
        showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        if (response.status && (response.status === 404)) {
          message = intl.formatMessage({ id: 'billNotFoundMsg' });
        }
        showMsg(message, { type: "error" });
      }
    } catch (error) {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const validateBillCode = (cadena: string): boolean => {
    const regex = /^\d{4}_\d{2}_[QMT]_[a-zA-Z\d]+$/;

    return regex.test(cadena);
  };

  const validateBillCodeIncomplete = (cadena: string): boolean => {
    const regex = /^\d{4}\d{2}[QMT][a-zA-Z\d]+$/;

    return regex.test(cadena);
  };

  let initialValues: ShippingInvoice = {
    waybill_id: "",
    carrier: "",
    eta: "",
  };

  const formatBillCode = (input: string): string => {
    console.log("entro")
    if (!input) {
      return "";
    }

    const cleanedInput = input.replace(/[^a-zA-Z0-9_]/g, '');

    if (validateBillCodeIncomplete(cleanedInput)) {
      const formattedInput = cleanedInput.replace(/^(\d{4})(\d{2})([QMT])([a-zA-Z\d]+)$/, '$1_$2_$3_$4');
      return formattedInput;
    }

    const regex = /^(\d{4})(_?(\d{2}))?_?([QMT])?_?([a-zA-Z\d]*)$/;
    const match = cleanedInput.match(regex); console.log(match)
    if (match) {
      const completeParam = cleanedInput.replace(/_/g, '');
      const param1 = match[1];
      const param2 = match[3] || null;
      const param3 = match[4] || null;
      const param4 = match[5] || null;

      let response = param1 + '_';
      if (param2) {
        response += param2 + '_';
        if (param3) {
          response += param3 + '_';
          if (param4) {
            response += param4;
          } else if (completeParam.length > 7) {
            response += completeParam.substring(7);
          }
        } else if (completeParam.length > 6) {
          response += completeParam.substring(6);
        }
      } else if (completeParam.length > 4) {
        response += completeParam.substring(4);
      }

      return response;
    }
    return cleanedInput;
  };

  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <Loading loading={loading} content={intl.formatMessage({ id: "loading_items" })} >
          <div className="confirmation_card_header" style={{ color: 'white' }}>
            <div className="upload-batch-sp-header-dialog">
              <strong>{title}</strong>
            </div>
          </div>
          <div style={{ width: '500px', maxWidth: '90vw' }}>
            <div className='flex flex-col gap-3'>
              <Formik initialValues={initialValues} onSubmit={() => { }}>
                <Form>

                  {/* <div className="elements-row-start w-full mt-2" style={{ gap: '20px' }}>
                <label>
                  <input
                    type="radio"
                    value="mwb"
                    checked={selectedOption === 'mwb'}
                    onChange={(e) => handleOptionChange(e)}
                  />
                  {"  "}
                  {intl.formatMessage({ id: "waybill_id" })}
                </label>
                <label>
                  <input
                    type="radio"
                    value="bill_code"
                    checked={selectedOption === 'bill_code'}
                    onChange={handleOptionChange}
                  />
                  {"  "}
                  {intl.formatMessage({ id: "bill_code" })}
                </label>
              </div> */}
                  {selectedOption === 'mwb' && (
                    <div className='flex mt-8 mb-1'>
                      <div className="mr-2" style={{ width: "100%" }}>
                        <Select
                          isSearchable
                          options={waybillIDS ? waybillIDS.map((column) => ({
                            value: column.waybill_id,
                            label: capitalize(column.waybill_id)
                          })) : []}
                          value={waybillIDValue.trim() !== "" ? { value: waybillIDValue, label: waybillIDValue } : null}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              setWaybillIDValue(selectedOption.value);
                            } else {
                              setWaybillIDValue("");
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
                          placeholder={intl.formatMessage({ id: "waybill_id" })}
                        />
                      </div>
                      <div className="ml-2" style={{ width: "100%" }}>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              className="bnt-dropdown"
                              style={{ width: "-webkit-fill-available" }}
                              endContent={<ChevronDownIcon className="text-small" />}
                            >
                              {carrierValue.trim() !== "" ? carrierValue : intl.formatMessage({ id: "carrier" })}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            style={{ width: "100%" }}
                            disallowEmptySelection
                            aria-label="Carrier"
                            closeOnSelect={true}
                            selectionMode="single"
                          >
                            {carriers ? carriers.map((column) => (
                              <DropdownItem style={{ width: "100%" }} onClick={(e) => setCarrierValue(column.name)} key={column.position} className="capitalize">
                                {capitalize(column.name)}
                              </DropdownItem>
                            )) : []}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>)}
                  <div className="w-full mt-5">
                    <GenericInput
                      onChangeFunction={(event) => setDate(event?.target.value)}
                      type="date"
                      name="arrival_date"
                      placeholder={intl.formatMessage({
                        id: "arrival_date",
                      })}
                      customClass="custom-input"
                    />
                  </div>
                </Form>
              </Formik>
              {/* {selectedOption === 'bill_code' && (
                <div className='flex flex-col mt-5 mb-10'>
                  <div className='flex mb-2'>
                    <div className="mr-2" style={{ width: "100%" }}>
                      <Input
                        className="search-input"
                        placeholder={intl.formatMessage({ id: "bill_code" })}
                        value={billCodeValue}
                        onChange={(e) => setBillCodeValue(formatBillCode(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="w-full">{intl.formatMessage({ id: "format" })}: {intl.formatMessage({ id: "year" })}_{intl.formatMessage({ id: "month" })}_{intl.formatMessage({ id: "period" })}_{intl.formatMessage({ id: "carrier" })}</div>
                  <div className="w-full">{intl.formatMessage({ id: "year" })}: {intl.formatMessage({ id: "ym_digits" }, {dig: '4'})}</div>
                  <div className="w-full">{intl.formatMessage({ id: "month" })}: {intl.formatMessage({ id: "ym_digits" }, {dig: '2'})}</div>
                  <div className="w-full">{intl.formatMessage({ id: "period" })}: {`{Q | M | T}`}</div>
                  <div className="w-full">{intl.formatMessage({ id: "carrier" })}: {`RedPack | OCA | AMPM | ...`}</div>
                  <div className="w-full">{intl.formatMessage({ id: "bill_code_ex" }, {year: (new Date()).getFullYear(), month: ((new Date()).getMonth() + 1).toString().padStart(2, '0')})}</div>
                </div>
              )} */}
              <div className="elements-row-end w-full">
                <Button
                  color="primary"
                  type="submit"
                  className="px-4"
                  style={{ marginRight: '15px' }}
                  onClick={handleSubmit}
                  disabled={waybillIDValue === "" || date === "" || carrierValue === ""}
                >
                  {intl.formatMessage({ id: "confirmation_header" })}
                </Button>
                <Button onClick={close} type="button" className="bg-secundary px-4">
                  {intl.formatMessage({ id: "cancel" })}
                </Button>
              </div>
            </div>
          </div>
        </Loading>
      </div>
    </div>
  );
};

export default GenerateDialog;