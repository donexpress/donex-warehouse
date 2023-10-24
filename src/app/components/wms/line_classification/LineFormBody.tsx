import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import "../../../../styles/wms/user.form.scss";
import { showMsg } from "../../../../helpers";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import GenericInput from "../../common/GenericInput";
import { useIntl } from "react-intl";
import { LineForm, Response } from "../../../../types";
import { LineFormProps, CargoStationWarehouseForm, ValueSelect } from "../../../../types";
import { createLine, updateLine } from '../../../../services/api.lines';
import { generateValidationLines, generateValidationLinesModify } from "../../../../validation/generateValidationLines";

const getAffiliationsFormatted = (affiliationsAll: CargoStationWarehouseForm[]): ValueSelect[] => {
  let response: ValueSelect[] = [];
  affiliationsAll.forEach((affiliation) => {
    response.push({
      value: Number(affiliation.id),
      label: affiliation.name,
    });
  });
  return response;
};

const LineFormBody = ({ id, line, isFromDetails }: LineFormProps) => {
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();

  let initialValues: LineForm = {
    name: id && line ? line.name : "",
    contain_channels: '',
    include_order_account: '',
  };

  const handleSubmit = async (values: LineForm) => {
    if (id) {
      await modify(id, values);
    } else {
      await create(values);
    }
  };

  const formatBody = (values: LineForm): LineForm => {
    let data: any = {};
    data.name = values.name;
    if (values.contain_channels != '')
      data.contain_channels = values.contain_channels;

    if (values.include_order_account != '')
      data.include_order_account = values.include_order_account;

    return data;
  };

  const create = async (values: LineForm) => {
    const response: Response = await createLine(formatBody(values));
    treatmentToResponse(response);
  };

  const modify = async (lineId: number, values: LineForm) => {
    const response: Response = await updateLine(lineId, formatBody(values));
    treatmentToResponse(response);
  };

  const treatmentToResponse = (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      const message = id
        ? intl.formatMessage({ id: "changedsuccessfullyMsg" })
        : intl.formatMessage({ id: "successfullyMsg" });
      showMsg(message, { type: "success" });
      router.push(`/${locale}/wms/line_classification`);
    } else {
      let message = intl.formatMessage({ id: "unknownStatusErrorMsg" });
      showMsg(message, { type: "error" });
    }
  };

  const cancelSend = () => {
    router.push(`/${locale}/wms/line_classification`);
  };

  const goToEdit = () => {
    router.push(`/${locale}/wms/line_classification/${id}/update`);
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
          {intl.formatMessage({ id: "lineClassification" })}
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
          validationSchema={id ? generateValidationLines(intl) : generateValidationLinesModify(intl)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap justify-between">
                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="name"
                    placeholder={intl.formatMessage({ id: "name" })}
                    customClass="custom-input"
                    disabled={isFromDetails}
                    required
                  />
                </div>

                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="contain_channels"
                    placeholder={intl.formatMessage({ id: "contain_channels" })}
                    customClass="custom-input"
                    disabled={true}
                  />
                </div>

                <div className="w-full sm:w-[49%]">
                  <GenericInput
                    type="text"
                    name="include_order_account"
                    placeholder={intl.formatMessage({ id: "include_order_account" })}
                    customClass="custom-input"
                    disabled={true}
                  />
                </div>
              </div>

              <div className='flex justify-end gap-3'>
                <div>
                  {
                    !isFromDetails &&
                    (
                      <Button
                        color="primary"
                        type="submit"
                        className='px-4'
                        disabled={isSubmitting || !isValid}
                      >
                        {isSubmitting ? intl.formatMessage({ id: 'sending' }) : (id ? intl.formatMessage({ id: 'modify' }) : intl.formatMessage({ id: 'add' }))}
                      </Button>
                    )
                  }
                  {
                    isFromDetails && id && (
                      <Button
                        color="primary"
                        type="button"
                        className='px-4'
                        onClick={() => goToEdit()}
                      >
                        {intl.formatMessage({ id: 'go_to_edit' })}
                      </Button>
                    )
                  }
                </div>
                <div>
                  <Button
                    type="button"
                    className='bg-secundary px-4'
                    onClick={() => cancelSend()}
                  >
                    {intl.formatMessage({ id: 'cancel' })}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LineFormBody;
