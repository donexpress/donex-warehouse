import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { PackingList } from "../../../types/storage_plan";
import { generateValidationSchemaBatchOnShelves } from "../../../validation/generateValidationSchemaBatchOnShelves";
import { Formik, Form } from 'formik';
import GenericInput from './GenericInput';
import { Response, ValueSelect } from '../../../types';
import '../../../styles/generic.dialog.scss';

interface Params {
  close: () => any;
  confirm: () => any;
  title: string;
  packingLists: PackingList[];
}

type BatchOnShelves = {
  partition_id: number | null;
  shelf_id: number | null;
  location_id: number | null;
}

const BatchOnShelvesDialog = ({ close, confirm, title, packingLists }: Params) => {
  const intl = useIntl();

  const initialValues: BatchOnShelves = {
    partition_id: null,
    shelf_id: null,
    location_id: null,
  }

  const handleSubmit = async (values: BatchOnShelves) => {
    confirm();
  };

  const getData = (values: any[]): ValueSelect[] => {
    return [];
  }
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
          <strong>{ title }</strong>
        </div>
        <div style={{ width: '380px', maxWidth: '90vw' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={generateValidationSchemaBatchOnShelves(intl)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className='flex flex-col gap-3'>
                <div className='flex gap-3 flex-wrap justify-between'>
                  <div className="w-full">
                    <GenericInput
                      type="select"
                      name="partition_id"
                      selectLabel={intl.formatMessage({ id: 'select_partition' })}
                      options={getData([])}
                      customClass="custom-input"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <GenericInput
                      type="select"
                      name="shelf_id"
                      selectLabel={intl.formatMessage({ id: 'select_shelf' })}
                      options={getData([])}
                      customClass="custom-input"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <GenericInput
                      type="select"
                      name="location_id"
                      selectLabel={intl.formatMessage({ id: 'select_location' })}
                      options={getData([])}
                      customClass="custom-input"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-2 mb-3 elements-center w-full">
                    {packingLists.map((pl: PackingList, index: number) => (
                      <div key={index} style={{ borderTop: 'solid 1px #343B4F', borderLeft: 'solid 1px #343B4F', borderRight: 'solid 1px #343B4F', borderBottom: (index === (packingLists.length-1)) ? 'solid 1px #343B4F' : 'none', padding: '8px 10px', textAlign: 'left', width: '100%' }}>
                          { pl.box_number }
                      </div>
                    ))}
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

export default BatchOnShelvesDialog;