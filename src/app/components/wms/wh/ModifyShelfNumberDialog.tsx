import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { generateValidationSchemaNumberShelf } from "../../../../validation/generateValidationSchemaShelf";
import { Formik, Form } from 'formik';
import GenericInput from '../../common/GenericInput';
import { Warehouse } from '../../../../types/warehouse';
import { Shelf } from '../../../../types/shelf';
import '../../../../styles/generic.dialog.scss';

interface Params {
  close: () => any;
  confirm: (shelfNumber: number) => any;
  title: string;
  warehouseCode: string;
  shelf: Shelf;
}

const ModifyShelfNumberDialog = ({ close, confirm, title, shelf, warehouseCode }: Params) => {
  const intl = useIntl();

  const initialValues = {
    number_of_shelves: shelf.number_of_shelves,
  }

  const handleSubmit = async(values: {number_of_shelves: number}) => {
    await confirm(values.number_of_shelves);
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
            validationSchema={generateValidationSchemaNumberShelf(intl)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className='flex flex-col gap-3'>
                <div className='fields-shelf-dialog gap-3 scrollable-hidden'>
                  <div className="w-full elements-row-end" style={{ height: '45px' }}>
                    <span>{`${warehouseCode}${String(shelf.partition_table).padStart(2, '0')}`}</span>
                  </div>  
                  <div className="w-full">
                      <GenericInput
                        type="number"
                        name="number_of_shelves"
                        placeholder={intl.formatMessage({ id: 'shelf_number' })}
                        customClass="custom-input"
                        minValue={1}
                        required
                      />
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

export default ModifyShelfNumberDialog;