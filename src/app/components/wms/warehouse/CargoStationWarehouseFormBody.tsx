import React from "react";
import "../../../../styles/wms/user.form.scss";
import { showMsg, isOMS, isWMS } from "../../../../helpers";
import { useRouter } from "next/router";
import { generateValidationSchemaWarehouse } from "../../../../validation/generateValidationSchemaWarehouse";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import {
  CargoStationWarehouseForm,
  Country,
  StateWarehouse,
  CargoStationWarehouseProps,
  ValueSelect,
  Response,
} from "../../../../types";
import {
  createCargoTerminal,
  updateWarehouseById,
} from "../../../../services/api.warehouse";
import { Button, Chip } from "@nextui-org/react";

const CargoStationWarehouseFormBody = ({
  states,
  countries,
  receptionAreas,
  id,
  warehouse,
  isFromDetails,
}: CargoStationWarehouseProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  const initialValues: CargoStationWarehouseForm = {
    name: id && warehouse ? warehouse.name : "",
    english_name: id && warehouse ? warehouse.english_name : "",
    receiving_area: id && warehouse ? warehouse.receiving_area : "",
    principal: id && warehouse ? warehouse.principal : "",
    contact_phone: id && warehouse ? warehouse.contact_phone : "",
    // @ts-ignore
    state: id && warehouse && warehouse.state ? warehouse.state.value : 'normal',
    address: id && warehouse ? warehouse.address : "",
    city: id && warehouse ? warehouse.city : "",
    province: id && warehouse ? warehouse.province : "",
    country: id && warehouse ? warehouse.country : "Mexico",
    cp: id && warehouse ? warehouse.cp : "",
    shared_warehouse_system_code:
      id && warehouse ? warehouse.shared_warehouse_system_code : "",
    shared_warehouse_docking_code:
      id && warehouse ? warehouse.shared_warehouse_docking_code : "",
    customer_order_number_rules:
      id && warehouse ? warehouse.customer_order_number_rules : "",
  };

  const getStatesFormatted = (statesAll: StateWarehouse[]): ValueSelect[] => {
    let response: ValueSelect[] = [];
    statesAll.forEach((state) => {
      response.push({
        value: state.value,
        label: getLabelByLanguage(state),
      });
    });
    return response;
  };

  const getLabelByLanguage = (state: StateWarehouse) => {
    if (locale === 'es') {
      return state.es_name;
    } else if (locale === 'zh') {
      return state.zh_name;
    }
    return state.name;
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

  const getRegionalDivisionFormatted = (
    receptionAreasAll: StateWarehouse[]
  ): ValueSelect[] => {
    let response: ValueSelect[] = [];
    receptionAreasAll.forEach((ra) => {
      response.push({
        value: ra.name,
        label: ra.name,
      });
    });
    return response;
  };

  const cancelSend = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms/warehouse_cargo_station`);
    }
  };

  const handleSubmit = async (values: CargoStationWarehouseForm) => {
    if (isWMS()) {
      if (id) {
        await modify(id, values);
      } else {
        await create(values);
      }
    }
  };

  const formatBody = (
    values: CargoStationWarehouseForm
  ): CargoStationWarehouseForm => {
    return {
      ...values,
      state: values.state ? values.state : 'normal',
    };
  };

  const create = async (values: CargoStationWarehouseForm) => {
    const response: Response = await createCargoTerminal(formatBody(values));
    treatmentToResponse(response);
  };

  const modify = async (
    warehouseId: number,
    values: CargoStationWarehouseForm
  ) => {
    const response: Response = await updateWarehouseById(
      warehouseId,
      formatBody(values)
    );
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/warehouse_cargo_station`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      if (response.status === 409 && response.data.message === "name already exists") {
        message = intl.formatMessage({ id: "site_name_already_exists" });
      }
      showMsg(message, { type: "error" });
    }
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/warehouse_cargo_station/${id}/update`);
  };

  const goBack = () => {
    router.back();
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
          {intl.formatMessage({ id: "cargoTerminal" })}
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
          validationSchema={generateValidationSchemaWarehouse(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="name"
                    placeholder={intl.formatMessage({ id: "site_name" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="english_name"
                    placeholder={intl.formatMessage({
                      id: "site_name_english",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="receiving_area"
                    selectLabel={intl.formatMessage({
                      id: "select_reception_area",
                    })}
                    options={getRegionalDivisionFormatted(receptionAreas)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="principal"
                    placeholder={intl.formatMessage({ id: "principal" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="contact_phone"
                    placeholder={intl.formatMessage({ id: "contact_phone" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="select"
                    name="state"
                    selectLabel={intl.formatMessage({ id: "select_state" })}
                    options={getStatesFormatted(states)}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="address"
                    placeholder={`${intl.formatMessage({ id: "address" })} 1`}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="city"
                    placeholder={intl.formatMessage({ id: "city" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="province"
                    placeholder={intl.formatMessage({ id: "province" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
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
                    name="cp"
                    placeholder={intl.formatMessage({ id: "postal_code" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="shared_warehouse_system_code"
                    placeholder={intl.formatMessage({
                      id: "shared_warehouse_system_code",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="shared_warehouse_docking_code"
                    placeholder={intl.formatMessage({
                      id: "shared_warehouse_berth_code",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="customer_order_number_rules"
                    placeholder={intl.formatMessage({
                      id: "customer_order_number_rules",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                  />
                </div>
              </div>
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
            </Form>
          )}
        </Formik>
        {!isFromDetails && (
          <div className="pt-4 flex flex-col gap-3">
            <div className="font-semibold text-sm">
              {intl.formatMessage({ id: "single_number_format" })}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <Chip>{"{shipment_id}"}: </Chip>
                {intl.formatMessage({ id: "system_tracking_number" })}
              </div>
              <div>
                <Chip>{"{client_reference}"}: </Chip>
                {intl.formatMessage({ id: "customer_order_number" })}
              </div>
              <div>
                <Chip>{"{ext_numbers}"}: </Chip>
                {intl.formatMessage({ id: "extended_odd_numbers" })}
              </div>
              <div>
                <Chip>{"{self_reference}"}: </Chip>
                {intl.formatMessage({ id: "associated_tracking_number" })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargoStationWarehouseFormBody;
