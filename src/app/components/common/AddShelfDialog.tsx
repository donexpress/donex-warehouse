import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { generateValidationSchemaShelf } from "../../../validation/generateValidationSchemaShelf";
import { Formik, Form } from 'formik';
import GenericInput from './GenericInput';
import { Response, ValueSelect } from '../../../types';
import { Warehouse } from '../../../types/warehouse';
import { Shelf } from '../../../types/shelf';
import '../../../styles/generic.dialog.scss';
import { createShelf } from '../../../services/api.shelf';
import { updateWhById } from '../../../services/api.wh';
import { showMsg } from '../../../helpers';

interface Params {
  close: () => any;
  confirm: (shelvesItems: Shelf[]) => any;
  title: string;
  warehouse: Warehouse;
  partition_table: number;
  shelf_number: number;
  isCreatePartition: boolean;
}

const AddShelfDialog = ({ close, confirm, title, partition_table, warehouse, shelf_number, isCreatePartition = false }: Params) => {
  const intl = useIntl();

  useEffect(() => {

  }, []);

  const initialValues: Shelf = {
    column_ammount: 1,
    layers: 1,
    warehouse_id: Number(warehouse.id),
    partition_table: partition_table,
    number_of_shelves: 1,
    high_inventory: 0,
    location_length: 0,
    location_width: 0
  }

  /* const formatBody = (wh: Warehouse) => {
    return {
        code: warehouse.code,
        name: warehouse.name,
        contact: warehouse.contact,
        company: warehouse.company,
        country: warehouse.country,
        address_1: warehouse.address_1,
        address_2: warehouse.address_2,
        city: warehouse.city,
        province: warehouse.province,
        cp: warehouse.cp,
        phone: warehouse.phone,
        email: warehouse.email,
        observations: warehouse.observations,
        patition_amount: partition_table,
      };
  }

  const createPartition = async(values: Shelf) => {
    const response: Response = await updateWhById(Number(warehouse.id), formatBody(warehouse));
    if (response.status >= 200 && response.status <= 299) {
        await createShelves(values);
    } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
    }
  } */

  const handleSubmit = async(values: Shelf) => {
    let c = 0;
    let shelvesItems: Shelf[] = [];
    for (let i = shelf_number; i < (shelf_number + values.number_of_shelves); i++) {
        const bodyParams: Shelf = {
          column_ammount: values.column_ammount,
          layers: values.layers,
          number_of_shelves: i,
          high_inventory: values.high_inventory,
          location_width: values.location_width,
          location_length: values.location_length,
          warehouse_id: values.warehouse_id,
          partition_table: values.partition_table
        };
        
        const response: Response = await createShelf(bodyParams);
        if (response.status >= 200 && response.status <= 299) {
          c++;
          const data: Shelf = response.data;
          shelvesItems.push({...data, checked: false});
        }
    }
    if (c > 0) {
      const message = intl.formatMessage({ id: 'successfullyActionMsg' });
      showMsg(message, { type: "success" });
      confirm(shelvesItems);
    } else {
      let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
      showMsg(message, { type: "error" });
      close();
    }
  }
      
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // @ts-ignore
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    
  };
  
  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
          <strong>{ title }</strong>
        </div>
        <div style={{ width: '500px', maxWidth: '90vw' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={generateValidationSchemaShelf(intl)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className='flex flex-col gap-3'>
                {
                    isCreatePartition && (
                        <div className="flex justify-center mt-2 mb-3 elements-center w-full">
                            <div style={{ borderTop: 'solid 1px #343B4F', borderLeft: 'solid 1px #343B4F', borderRight: 'solid 1px #343B4F', borderBottom: 'solid 1px #343B4F', padding: '8px 10px', textAlign: 'left', width: '100%' }}>
                                {warehouse.code}{String(partition_table).padStart(2, '0')}
                            </div>
                        </div>
                    )
                }
                <div className='fields-shelf-dialog gap-3 scrollable-hidden'>
                  <div className="w-full">
                      <GenericInput
                        type="number"
                        name="number_of_shelves"
                        placeholder={intl.formatMessage({ id: 'number_of_shelves' })}
                        customClass="custom-input"
                        minValue={0}
                        onChangeFunction={handleInputChange}
                        required
                      />
                  </div>
                  <div className="w-full">
                      <GenericInput
                        type="number"
                        name="layers"
                        placeholder={intl.formatMessage({ id: 'layers' })}
                        customClass="custom-input"
                        minValue={0}
                        onChangeFunction={handleInputChange}
                        required
                      />
                  </div>
                  <div className="w-full">
                      <GenericInput
                        type="number"
                        name="column_ammount"
                        placeholder={intl.formatMessage({ id: 'columns' })}
                        customClass="custom-input"
                        minValue={0}
                        onChangeFunction={handleInputChange}
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
                        onChangeFunction={handleInputChange}
                        required
                      />
                  </div>
                  <div className="w-full">
                      <GenericInput
                        type="number"
                        name="location_length"
                        placeholder={intl.formatMessage({ id: 'length' }) + ' ' + '(cm)'}
                        customClass="custom-input"
                        minValue={0}
                        onChangeFunction={handleInputChange}
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
                        onChangeFunction={handleInputChange}
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

export default AddShelfDialog;