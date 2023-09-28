import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { PackingList } from "../../../../types/storage_plan";
import GenericInput from "../../common/GenericInput";
import { Form, Formik } from "formik";

interface Params {
  close: () => any;
  confirm: (data: any) => any;
  title: string;
}
const AddExitPlanDialog = ({ close, confirm, title }: Params) => {
  const intl = useIntl();
  const initialValues = {
    case_number: "",
    warehouse_order_number: "",
  };
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card">
        <div className="confirmation_card_header black-label">
          <strong>{title}</strong>
        </div>
        <div className="flex justify-center my-4  black-label elements-center">
          <div className="user-form-body__container">
            <Formik initialValues={initialValues} onSubmit={confirm}>
              {({ isSubmitting, isValid }) => (
                <Form className="flex flex-col gap-3">
                  <div className="flex gap-3 flex-wrap justify-between">
                    <div className="w-full sm:w-[99%]">
                      <GenericInput
                        type="text"
                        name="case_number"
                        placeholder={intl.formatMessage({
                          id: "expansion_box_number",
                        })}
                        customClass="custom-input"
                      />
                    </div>
                    <div className="w-full sm:w-[99%]">
                      <GenericInput
                        type="text"
                        name="warehouse_order_number"
                        placeholder={intl.formatMessage({
                          id: "warehouse_order_number",
                        })}
                        customClass="custom-input"
                      />
                    </div>
                  </div>
                  <div className="elements-row-end">
                    <Button
                      color="primary"
                      type="submit"
                      className="px-4"
                      style={{ marginRight: "15px" }}
                    >
                      {intl.formatMessage({ id: "confirmation_header" })}
                    </Button>
                    <Button
                      onClick={close}
                      type="button"
                      className="bg-secundary px-4"
                    >
                      {intl.formatMessage({ id: "cancel" })}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExitPlanDialog;
