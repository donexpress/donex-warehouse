import React, { useEffect, useState, ChangeEvent } from "react";
import "../../../../styles/wms/user.form.scss";
import { showMsg, isOMS, isWMS } from "../../../../helpers";
import { useRouter } from "next/router";
import { generateValidationSchemaExitPlan } from "../../../../validation/generateValidationSchema";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { Country, Response, ValueSelect } from "../../../../types";
import {
  createExitPlan,
  updateExitPlan,
  pullBoxes,
} from "../../../../services/api.exit_plan";
import { Button } from "@nextui-org/react";
import { ExitPlan, ExitPlanProps, State, AddBoxes } from "../../../../types/exit_plan";
import { User } from "../../../../types/user";
import { Staff } from "../../../../types/staff";
import { Warehouse } from "../../../../types/warehouse";
import { getHourFormat, getLanguage } from "@/helpers/utilserege1992";
import ExitPlanBox from "./ExitPlanBox";
import LocationTable from "../../common/LocationTable";
import ExitPlanAppendixFromOP from './ExitPlanAppendixFromOP';
import { AppendixFromOPBody, Appendix } from "../../../../types/appendix";
import { createAppendix } from "@/services/api.appendixerege1992";

const ExitPlanFormBody = ({
  id,
  exitPlan,
  isFromDetails,
  countries,
  users,
  warehouses,
  destinations,
  addresses,
  userOwner,
}: ExitPlanProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  // const [filter_user, set_filter_user] = useState<string>("");
  // const [filter_warehouse, set_filter_warehouse] = useState<string>("");
  const getWarehouseOrderNumber = (): string => {
    const warehouseOrderNumber = router.query.warehouseOrderNumber;
    return (warehouseOrderNumber && warehouseOrderNumber !== '') ? ((!!Array.isArray(warehouseOrderNumber)) ? (warehouseOrderNumber.length > 0 ? warehouseOrderNumber[0] : '') : warehouseOrderNumber) : '';
  };
  const date = new Date(
    exitPlan ? (exitPlan.delivered_time ? exitPlan.delivered_time : "") : ""
  );
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const [destinationSelected, setDestinationSelected] = useState<string>(
    id && exitPlan && exitPlan.destination ? exitPlan.destination : ""
  );
  const [user, setUser] = useState<number | undefined>(
    isOMS()
      ? users[0].id
      : id && exitPlan && exitPlan.user && exitPlan.user.id
      ? exitPlan.user.id
      : undefined
  );
  const [warehouse, setWarehouse] = useState<number | undefined>(
    id && exitPlan && exitPlan.warehouse_id ? exitPlan.warehouse_id : undefined
  );
  const [address, setAddress] = useState<string>(
    id && exitPlan && exitPlan.address ? exitPlan.address : ""
  );
  const [delivered_time, setDeliveredTime] = useState<string>(
    id && exitPlan && exitPlan.delivered_time
      ? date.toISOString().slice(0, 16)
      : ""
  );
  const [relabel, setRelabel] = useState<boolean>(
    id && exitPlan && exitPlan.relabel ? exitPlan.relabel : false
  );

  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [showAddPackages, setShowAddPackages] = useState<boolean>(getWarehouseOrderNumber() !== '');
  const [appendixes, setAppendixes] = useState<AppendixFromOPBody[]>([]);

  let initialValues: ExitPlan = {
    address: id && exitPlan ? exitPlan.address : "",
    warehouse_id:
      id && exitPlan && exitPlan.warehouse_id
        ? exitPlan.warehouse_id
        : undefined,
    city: id && exitPlan ? exitPlan.city : "",
    country: id && exitPlan ? exitPlan.country : "Mexico",
    delivered_time:
      id && exitPlan && exitPlan.delivered_time
        ? exitPlan.delivered_time.slice(0, 16)
        : "",
    observations: id && exitPlan ? exitPlan.observations : "",
    type: id && exitPlan ? exitPlan.type : -1,
    user_id: isOMS()
      ? users[0].id
      : id && exitPlan && exitPlan.user && exitPlan.user.id
      ? exitPlan.user.id
      : undefined,
    destination: id && exitPlan ? exitPlan.destination : "",
    reference_number: id && exitPlan ? exitPlan.reference_number : "",
    relabel: id && exitPlan ? exitPlan.relabel : false,
    // @ts-ignore
    show_add_packages: getWarehouseOrderNumber() !== '',
    // @ts-ignore
    case_number: "",
    // @ts-ignore
    warehouse_order_number: getWarehouseOrderNumber(),
  };

  const formatBody = (values: ExitPlan): ExitPlan => {
    const body = {
      address: values.address,
      warehouse_id: values.warehouse_id,
      city: values.city,
      country: values.country,
      delivered_time: values.delivered_time,
      observations: values.observations,
      type: values.type,
      user_id: values.user_id,
      destination: values.destination,
      reference_number: values.reference_number,
      relabel: values.relabel ? values.relabel : false,
    };
    if(isOMS()) {
      delete body.user_id
    }
    return body
  }

  const createAppendixes = async (outputPlanId: number) => {
    if (userOwner) {
      try {
        const promises = appendixes.map((el) => {
          const appdx: Appendix = {
            name: el.name,
            user_id: userOwner.id,
            output_plan_id: outputPlanId,
            function: el.function,
            url: el.url,
            is_owner_admin: isWMS() ? true : false
          };
          return createAppendix(appdx);
        }
        );
        await Promise.all(promises);
        showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
          type: "success",
        });
      } catch (e) {
        showMsg(intl.formatMessage({ id: "unknownStatusErrorMsg" }), {
          type: "error",
        });
      }
    }
  };

  const handleSubmit = async (values: ExitPlan) => {
    if (values.delivered_time === "") {
      values.delivered_time = null;
    }
    if (id) {
      await modify(id, values);
    } else {
      await create(values);
    }
  };

  const create = async (values: ExitPlan) => {
    const d = destinations?.destinations.find(
      (el) => el.value === destinationSelected
    );
    values.destination = d?.value;
    const response: Response = await createExitPlan(formatBody(values));
    if (response.status >= 200 && response.status <= 299) {
      const responseEP: ExitPlan = response.data;
      // @ts-ignore
      const caseNumber: string = values.case_number ? values.case_number : '';
      // @ts-ignore
      const warehouseOrderNumber: string = values.warehouse_order_number ? values.warehouse_order_number : '';
      if (responseEP && showAddPackages && (caseNumber !== '' || warehouseOrderNumber !== '')) {
        const data: AddBoxes = {
          case_number: caseNumber,
          warehouse_order_number: warehouseOrderNumber
        }
        const resp: any = await pullBoxes(Number(responseEP.id), data);
        
        if (resp["stored"]) {
          showMsg(intl.formatMessage({ id: "not_correct_state_msg" }), {
            type: "warning",
          });
        } else if (resp["already_used"]) {
          showMsg(intl.formatMessage({ id: "alreadyUsedmsg" }), {
            type: "error",
          });
        } else if (resp["duplicated"]) {
          showMsg(intl.formatMessage({ id: "duplicatedMsg" }), {
            type: "warning",
          });
        } else if (!(appendixes.length > 0 && userOwner)) {
          showMsg(intl.formatMessage({ id: "successfullyActionMsg" }), {
            type: "success",
          });
        }

        if (appendixes.length > 0 && userOwner) {
          await createAppendixes(Number(responseEP.id));
        }
      } else if (responseEP && appendixes.length > 0 && userOwner) {
        await createAppendixes(Number(responseEP.id));
      } else {
        const message = intl.formatMessage({ id: "successfullyMsg" });
        showMsg(message, { type: "success" });
      }
      goBack();
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const modify = async (paymentMethodId: number, values: ExitPlan) => {
    const response: Response = await updateExitPlan(paymentMethodId, formatBody(values));
    if (response.status >= 200 && response.status <= 299) {
      const message = intl.formatMessage({ id: "changedsuccessfullyMsg" });
      showMsg(message, { type: "success" });
      goBack();
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      goBack();
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const goToEdit = () => {
    router.push(`/${locale}/${isOMS() ? "oms" : "wms"}/exit_plan/${id}/update`);
  };

  const goBack = () => {
    router.back();
  };

  const getUsersFormatted = (users: User[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    users.forEach((user) => {
      response.push({
        value: Number(user.id),
        label: user.username,
      });
    });
    return response;
  };

  const getwarehouseFormatted = (warehouses: Warehouse[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    warehouses.forEach((warehouse) => {
      response.push({
        value: Number(warehouse.id),
        label: warehouse.name,
      });
    });
    return response;
  };

  const getValueChange = (value: any) => {
    setUser(value);
  };
  const getWarehouseValueChange = (value: any) => {
    setWarehouse(value);
  };

  const getAddressValueChange = (value: any) => {
    setAddress(value);
  };

  const changeDestination = (value: any) => {
    setDestinationSelected(value);
    initialValues.address = "";
  };

  const getStatesFormattedCountries = (
    countriesAll: Country[]
  ): ValueSelect[] => {
    let response: ValueSelect[] = [];
    countriesAll.forEach((country) => {
      response.push({
        value: country.name,
        label: country.emoji + " " + country.name,
      });
    });
    return response;
  };

  const getDestinationFormatted = (
    destination: { destinations: State[] } | undefined
  ): ValueSelect[] => {
    let response: ValueSelect[] = [];
    if (destination) {
      destination.destinations.forEach((dest) => {
        response.push({
          label: dest[getLanguage(intl)],
          value: dest.value,
        });
      });
    }
    return response;
  };

  const getStatesFormattedAddresses = (addresses: {
    addresses: { amazon: State[]; meli: State[] };
  }): ValueSelect[] => {
    const response: ValueSelect[] = [];
    if (destinationSelected && destinationSelected !== "private_address") {
      // @ts-ignore
      addresses.addresses[destinationSelected].forEach((el) => {
        response.push({
          label: el[getLanguage(intl)],
          value: el.value,
        });
      });
    }
    return response;
  };

  const checkPendingState = (state: any) => {
    return state === "pending";
  };

  useEffect(() => {
    if (relabel) {
      if (user === undefined || warehouse === undefined || address === "") {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    } else {
      if (
        user === undefined ||
        warehouse === undefined ||
        address === "" ||
        delivered_time === ""
      ) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }
  }, [user, warehouse, delivered_time, address, relabel]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // @ts-ignore
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;

    if (name === 'show_add_packages') {
      setShowAddPackages(fieldValue);
    }
    switch (name) {
      case "user_id":
        setUser(fieldValue);
        break;
      case "warehouse_id":
        setWarehouse(fieldValue);
        break;
      case "address":
        setAddress(fieldValue);
        break;
      case "delivered_time":
        setDeliveredTime(fieldValue);
        break;
      case "relabel":
        setRelabel(fieldValue);
        break;
    }
  };

  return (
    <div className="user-form-body shadow-small">
      <div className="flex gap-3 flex-wrap justify-between">
        <h1 className="text-xl font-semibold">
          {id
            ? isFromDetails
              ? intl.formatMessage({ id: "vizualice" })
              : intl.formatMessage({ id: "modify" })
            : intl.formatMessage({ id: "insert" })}{" "}
          {intl.formatMessage({ id: "exitPlan" })}
        </h1>
        <div className="flex justify-end gap-3">
          <div>
            <Button
              onClick={() => goBack()}
              color="primary"
              type="button"
              className="bg-primary px-4"
            >
              {intl.formatMessage({ id: "back" })}
            </Button>
          </div>
        </div>
      </div>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          // validationSchema={generateValidationSchemaExitPlan(intl, destinationSelected)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    onChangeFunction={handleInputChange}
                    type="select-filter"
                    name="user_id"
                    placeholder={intl.formatMessage({ id: "user" })}
                    options={getUsersFormatted(users)}
                    customClass="select-filter"
                    isMulti={false}
                    getValueChangeFn={getValueChange}
                    disabled={isFromDetails || isOMS()}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    onChangeFunction={handleInputChange}
                    type="select-filter"
                    name="warehouse_id"
                    placeholder={intl.formatMessage({ id: "warehouse" })}
                    options={getwarehouseFormatted(warehouses)}
                    customClass="select-filter"
                    isMulti={false}
                    getValueChangeFn={getWarehouseValueChange}
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="country"
                    placeholder={intl.formatMessage({ id: "select_nation" })}
                    options={getStatesFormattedCountries(countries)}
                    customClass="select-filter"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="city"
                    placeholder={intl.formatMessage({
                      id: "province",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="destination"
                    placeholder={intl.formatMessage({
                      id: "destination",
                    })}
                    getValueChangeFn={changeDestination}
                    options={getDestinationFormatted(destinations)}
                    customClass="select-filter"
                    disabled={isFromDetails}
                  />
                </div>
                {destinationSelected === "private_address" && (
                  <div className="w-full sm:w-[49%]">
                    <GenericInput
                      onChangeFunction={handleInputChange}
                      type="text"
                      name="address"
                      required
                      placeholder={intl.formatMessage({
                        id: "address",
                      })}
                      customClass="custom-input"
                      disabled={
                        isFromDetails ||
                        destinationSelected !== "private_address"
                      }
                    />
                  </div>
                )}
                {destinationSelected !== "private_address" && (
                  <div className="w-full sm:w-[49%]">
                    <GenericInput
                      onChangeFunction={handleInputChange}
                      type="select-filter"
                      required
                      name="address"
                      getValueChangeFn={getAddressValueChange}
                      placeholder={intl.formatMessage({ id: "address" })}
                      options={getStatesFormattedAddresses(addresses)}
                      customClass="select-filter"
                      disabled={isFromDetails}
                    />
                  </div>
                )}

                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="observations"
                    placeholder={intl.formatMessage({
                      id: "observations",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    onChangeFunction={handleInputChange}
                    type="datetime-local"
                    name="delivered_time"
                    placeholder={intl.formatMessage({
                      id: "delivery_time",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="reference_number"
                    placeholder={intl.formatMessage({
                      id: "reference_number",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    onChangeFunction={handleInputChange}
                    hideErrorContent={true}
                    type="checkbox"
                    name="relabel"
                    placeholder={intl.formatMessage({
                      id: "relabel",
                    })}
                    customClass="custom-input"
                  />
                </div>
              </div>
              {
                !id && (
                  <div className="flex gap-2 flex-wrap">
                    <GenericInput onChangeFunction={handleInputChange} hideErrorContent={true} type='checkbox' name="show_add_packages" placeholder={intl.formatMessage({ id: 'add_exit_plan_boxes' })} customClass='custom-input' />
                  </div>
                )
              }
              {
                showAddPackages &&
                <div className='flex gap-3 flex-wrap justify-between' style={{ paddingRight: '16px' }}>
                  <div className="w-full sm:w-[49%]">
                    <GenericInput
                      type="text"
                      name="case_number"
                      placeholder={`${intl.formatMessage({
                        id: "expansion_box_number",
                      })} / ${intl.formatMessage({
                        id: "box_number",
                      })}`}
                      customClass="custom-input"
                      hideErrorContent={true}
                    />
                    <span className="text_example">{intl.formatMessage({
                        id: "input_example_1",
                      })}</span>
                  </div>
                  <div className="w-full sm:w-[49%]">
                    <GenericInput
                      type="text"
                      name="warehouse_order_number"
                      placeholder={`${intl.formatMessage({
                        id: "warehouse_order_number",
                      })} / ${intl.formatMessage({
                        id: "customer_order_number",
                      })}`}
                      customClass="custom-input"
                      hideErrorContent={true}
                    />
                    <span className="text_example">{intl.formatMessage({
                        id: "input_example_2",
                      })}</span>
                  </div>
                </div>
              }
              <div className="flex justify-end gap-3">
                <div className="flex justify-end gap-3">
                  <div>
                    {!isFromDetails && (
                      <Button
                        color="primary"
                        type="submit"
                        className="px-4"
                        disabled={isSubmitting || disableButton}
                      >
                        {isSubmitting
                          ? intl.formatMessage({ id: "sending" })
                          : id
                          ? intl.formatMessage({ id: "modify" })
                          : intl.formatMessage({ id: "add" })}
                      </Button>
                    )}
                    {isFromDetails &&
                      id &&
                      (!isOMS() ||
                        (isOMS() &&
                          exitPlan &&
                          checkPendingState(exitPlan.state))) && (
                        <Button
                          color="primary"
                          onClick={() => goToEdit()}
                          className="px-4"
                          type="button"
                        >
                          {intl.formatMessage({ id: "go_to_edit" })}
                        </Button>
                      )}
                  </div>
                  <div>
                    <Button
                      onClick={() => goBack()}
                      type="button"
                      className="bg-secundary px-4"
                    >
                      {intl.formatMessage({ id: "cancel" })}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {
          !id && userOwner && (
            <ExitPlanAppendixFromOP owner={userOwner} updateAppendix={setAppendixes}></ExitPlanAppendixFromOP>
          )
        }
      </div>
      {isFromDetails && exitPlan && (
        <LocationTable exitPlan={exitPlan} isDetail />
      )}
    </div>
  );
};

export default ExitPlanFormBody;
