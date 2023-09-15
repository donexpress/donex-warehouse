import React, { useEffect, useState } from "react";
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
} from "../../../../services/api.exit_plan";
import { Button } from "@nextui-org/react";
import { ExitPlan, ExitPlanProps, State } from "../../../../types/exit_plan";
import { User } from "../../../../types/user";
import { Warehouse } from "../../../../types/warehouse";
import { getHourFormat, getLanguage } from "@/helpers/utilserege1992";

const ExitPlanFormBody = ({
  id,
  exitPlan,
  isFromDetails,
  countries,
  users,
  warehouses,
  destinations,
}: ExitPlanProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  const [filter_user, set_filter_user] = useState<string>("");
  const [filter_warehouse, set_filter_warehouse] = useState<string>("");
  const date = new Date(
    exitPlan ? (exitPlan.delivered_time ? exitPlan.delivered_time : "") : ""
  );
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  const [destinationSelected, setDestinationSelected] = useState<string>("");
  const initialValues: ExitPlan = {
    address: id && exitPlan ? exitPlan.address : "",
    warehouse_id:
      id && exitPlan && exitPlan.warehouse_id
        ? exitPlan.warehouse_id
        : undefined,
    city: id && exitPlan ? exitPlan.city : "",
    country: id && exitPlan ? exitPlan.country : "",
    delivered_time:
      id && exitPlan
        ? date.toISOString().slice(0,16) : "",
    observations: id && exitPlan ? exitPlan.observations : "",
    type: id && exitPlan ? exitPlan.type : -1,
    user_id:
      id && exitPlan && exitPlan.user && exitPlan.user.id
        ? exitPlan.user.id
        : undefined,
    destination: id && exitPlan ? exitPlan.destination: ''
  };

  console.log(initialValues, exitPlan?.warehouse_id);

  const cancelSend = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms/exit_plan`);
    }
  };

  const handleSubmit = async (values: ExitPlan) => {
    if (values.delivered_time === "") {
      values.delivered_time = null;
    }
    if (isWMS()) {
      if (id) {
        await modify(id, values);
      } else {
        await create(values);
      }
    }
  };

  const create = async (values: ExitPlan) => {
    const d = destinations?.destinations.find(el => el.value === destinationSelected)
    values.destination = d?.value
    const response: Response = await createExitPlan(values);
    treatmentToResponse(response);
  };

  const modify = async (paymentMethodId: number, values: ExitPlan) => {
    const response: Response = await updateExitPlan(paymentMethodId, values);
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/exit_plan`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/exit_plan/${id}/update`);
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
    if (value !== filter_user) {
      set_filter_user(value);
    }
  };

  const changeDestination = (value: any) => {
    setDestinationSelected(value);
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

  return (
    <div className="user-form-body">
      <h1 className="text-xl font-semibold">
        {id
          ? isFromDetails
            ? intl.formatMessage({ id: "vizualice" })
            : intl.formatMessage({ id: "modify" })
          : intl.formatMessage({ id: "insert" })}{" "}
        {intl.formatMessage({ id: "exitPlan" })}
      </h1>
      <div className="user-form-body__container">
        <Formik
          initialValues={initialValues}
          validationSchema={generateValidationSchemaExitPlan(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="user_id"
                    placeholder={intl.formatMessage({ id: "user" })}
                    options={getUsersFormatted(users)}
                    customClass="select-filter"
                    isMulti={false}
                    getValueChangeFn={getValueChange}
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select-filter"
                    name="warehouse_id"
                    placeholder={intl.formatMessage({ id: "warehouse" })}
                    options={getwarehouseFormatted(warehouses)}
                    customClass="select-filter"
                    isMulti={false}
                    getValueChangeFn={getValueChange}
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
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="address"
                    placeholder={intl.formatMessage({
                      id: "address",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails || destinationSelected !== 'private_address'}
                  />
                </div>
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
                    type="datetime-local"
                    name="delivered_time"
                    placeholder={intl.formatMessage({
                      id: "delivery_time",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <div className="flex justify-end gap-3">
                  <div>
                    {!isFromDetails && (
                      <Button
                        color="primary"
                        type="submit"
                        className="px-4"
                        disabled={isSubmitting || !isValid}
                      >
                        {isSubmitting
                          ? intl.formatMessage({ id: "sending" })
                          : id
                          ? intl.formatMessage({ id: "modify" })
                          : intl.formatMessage({ id: "add" })}
                      </Button>
                    )}
                    {isFromDetails && id && (
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
                      onClick={() => cancelSend()}
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
      </div>
    </div>
  );
};

export default ExitPlanFormBody;
