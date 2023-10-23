import React from "react";
import "../../../../styles/wms/user.form.scss";
import { showMsg, isOMS, isWMS } from "../../../../helpers";
import { useRouter } from "next/router";
import { generateValidationSchemaPaymentMethod } from "../../../../validation/generateValidationSchema";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { Response } from "../../../../types";
import {
  createPaymentMethod,
  updatePaymentMethodById,
} from "../../../../services/api.payment_method";
import {
  PaymentMethod,
  PaymentMethodProps,
} from "../../../../types/payment_methods";
import { Button } from "@nextui-org/react";

const PaymentMethodFormBody = ({
  id,
  paymentMethod,
  isFromDetails,
}: PaymentMethodProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  const initialValues: PaymentMethod = {
    code: id && paymentMethod ? paymentMethod.code : "",
    name: id && paymentMethod ? paymentMethod.name : "",
  };

  const cancelSend = () => {
    if (isWMS()) {
      router.push(`/${locale}/wms/payment_methods`);
    }
  };

  const handleSubmit = async (values: PaymentMethod) => {
    if (isWMS()) {
      if (id) {
        await modify(id, values);
      } else {
        await create(values);
      }
    }
  };

  const create = async (values: PaymentMethod) => {
    const response: Response = await createPaymentMethod(values);
    treatmentToResponse(response);
  };

  const modify = async (paymentMethodId: number, values: PaymentMethod) => {
    const response: Response = await updatePaymentMethodById(
      paymentMethodId,
      values
    );
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/payment_methods`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/payment_methods/${id}/update`);
  };

  const goBack = () => {
    router.push(`/${locale}/wms/payment_methods`);
  };

  return (
    <div className="user-form-body">
      <div className="flex gap-3 flex-wrap justify-between">
        <h1 className="text-xl font-semibold">
          {id
            ? isFromDetails
              ? intl.formatMessage({ id: "vizualice" })
              : intl.formatMessage({ id: "modify" })
            : intl.formatMessage({ id: "insert" })}{" "}
          {intl.formatMessage({ id: "paymentMethod" })}
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
          validationSchema={generateValidationSchemaPaymentMethod(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="code"
                    placeholder={intl.formatMessage({ id: "code" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
                  />
                </div>
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="name"
                    placeholder={intl.formatMessage({
                      id: "payment_method_name",
                    })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
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

export default PaymentMethodFormBody;
