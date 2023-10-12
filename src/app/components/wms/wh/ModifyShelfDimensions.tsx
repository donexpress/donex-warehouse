import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { generateValidationSchemaDimensionsShelf } from "../../../../validation/generateValidationSchemaShelf";
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { Shelf } from '../../../../types/shelf';
import '../../../../styles/generic.dialog.scss';

interface Params {
  close: () => any;
  confirm: (location_length: number, location_width: number, high_inventory: number) => any;
  title: string;
  shelf: Shelf;
}

const ModifyShelfDimensionsDialog = ({ close, confirm, title, shelf }: Params) => {
  const intl = useIntl();

  const initialValues = {
    location_length: shelf.location_length ? shelf.location_length : 0,
    location_width: shelf.location_width ? shelf.location_width : 0,
    high_inventory: shelf.high_inventory ? shelf.high_inventory : 0,
  }

  const handleSubmit = async(values: {location_length: number, location_width: number, high_inventory: number}) => {
    await confirm(values.location_length, values.location_width, values.high_inventory);
  }
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
          <strong>{ title }</strong>
        </div>
        <div style={{ width: '250px', maxWidth: '90vw' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={generateValidationSchemaDimensionsShelf(intl)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className='flex flex-col gap-3'>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                    <div className='flex gap-3 flex-wrap justify-between'>
                      <div className="w-full">
                          <GenericInput
                            type="number"
                            name="location_length"
                            placeholder={intl.formatMessage({ id: 'length' }) + ' ' + '(cm)'}
                            customClass="custom-input"
                            minValue={0}
                            required
                          />
                      </div>
                      <div className="w-full">
                          <GenericInput
                            type="number"
                            name="location_width"
                            placeholder={intl.formatMessage({ id: 'width' }) + ' ' + '(cm)'}
                            customClass="custom-input"
                            minValue={0}
                            required
                          />
                      </div>
                      <div className="w-full">
                          <GenericInput
                            type="number"
                            name="high_inventory"
                            placeholder={intl.formatMessage({ id: 'height' }) + ' ' + '(cm)'}
                            customClass="custom-input"
                            minValue={0}
                            required
                          />
                      </div>
                    </div>
                </div>
                <div className="elements-row-end w-full">
                  <Button
                    color="primary"
                    type="submit"
                    className="px-4"
                    style={{ marginRight: '15px' }}
                    disabled={isSubmitting || !isValid}
                  >
                    {intl.formatMessage({ id: "confirmation_header" })}
                  </Button>
                  <Button onClick={close} type="button" className="bg-secundary px-4">
                    {intl.formatMessage({ id: "cancel" })}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ModifyShelfDimensionsDialog;