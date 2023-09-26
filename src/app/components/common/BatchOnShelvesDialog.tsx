import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { PackingList } from "../../../types/storage_plan";
import { generateValidationSchemaBatchOnShelves } from "../../../validation/generateValidationSchemaBatchOnShelves";
import { Formik, Form } from 'formik';
import GenericInput from './GenericInput';
import { Response, ValueSelect } from '../../../types';
import { Warehouse } from '../../../types/warehouse';
import { Shelf } from '../../../types/shelf';
import { PackageShelf } from '../../../types/package_shelf';
import '../../../styles/generic.dialog.scss';
import { createPackageShelf, updatePackageShelfById } from '../../../services/api.package_shelf';
import { showMsg } from '../../../helpers';

interface Params {
  close: () => any;
  confirm: (packingListItems: PackingList[]) => any;
  title: string;
  packingLists: PackingList[];
  warehouse: Warehouse | undefined;
}

type BatchOnShelves = {
  partition_id: number | null;
  shelf_id: number | null;
  location_id: number | null;
}

const BatchOnShelvesDialog = ({ close, confirm, title, packingLists, warehouse }: Params) => {
  const intl = useIntl();
  const [allShelfs, setAllShelfs] = useState<Shelf[]>([]);
  const [pAmount, setPAmount] = useState<number>(0);

  const [partitions, setPartitions] = useState<ValueSelect[]>([]);
  const [shelfs, setShelfs] = useState<ValueSelect[]>([]);
  const [locations, setLocations] = useState<ValueSelect[]>([]);

  useEffect(() => {
    if (warehouse !== undefined) {
      setAllShelfs(warehouse.shelfs ? warehouse.shelfs : []);
      const partitionAmount = warehouse.patition_amount ? warehouse.patition_amount : 0;
      setPAmount(partitionAmount);
      if (partitionAmount > 0) {
        const elements: ValueSelect[] = [];
        //const count = partitionAmount.toString().length >= 2 ? partitionAmount.toString().length : 2;
        for (let index = 1; index <= partitionAmount; index++) {
          elements.push({
            value: index,
            label: warehouse.code + String(index).padStart(2, '0')
          });
        }
        setPartitions(elements);
      }
    }
  }, [warehouse]);

  const initialValues: BatchOnShelves = {
    partition_id: null,
    shelf_id: null,
    location_id: null,
  }

  const handleSubmit = async (values: BatchOnShelves) => {
    const shelfId = Number(values.shelf_id);
    const shelf = allShelfs.filter((sh: Shelf) => sh.id === shelfId);
    const aux = values.location_id?.toString().split('-');
    if (aux && (aux.length === 2)) {
      const layer = Number(aux[0]);
      const column = Number(aux[1]);
      
      let c = 0;
      let packingListItems: PackingList[] = [];
      for (let i = 0; i < packingLists.length; i++) {
        let packingList = packingLists[i];
        const bodyParams: PackageShelf = {
          column,
          layer,
          shelf_id: shelfId,
          package_id: Number(packingList.id)
        };

        if (packingList.package_shelf && packingList.package_shelf.length > 0) {
          const response: Response = await updatePackageShelfById(Number(packingList.package_shelf[0].id), bodyParams);
          if (response.status >= 200 && response.status <= 299) {
            c++;
            const data: PackageShelf = {...packingList.package_shelf[0], ...bodyParams};
            if (shelf.length > 0) {
              data.shelf = shelf[0];
            }
            packingList.package_shelf = [data];
            packingListItems.push(packingList);
          }
        } else {
          const response: Response = await createPackageShelf(bodyParams);
          if (response.status >= 200 && response.status <= 299) {
            c++;
            const data: PackageShelf = response.data;
            if (shelf.length > 0) {
              data.shelf = shelf[0];
            }
            packingList.package_shelf = [data];
            packingListItems.push(packingList);
          }
        }
      }
      if (c > 0) {
        const message = intl.formatMessage({ id: 'successfullyActionMsg' });
        showMsg(message, { type: "success" });
        confirm(packingListItems);
      } else {
        let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
        showMsg(message, { type: "error" });
        close();
      }
    }
  };
      
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // @ts-ignore
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    
    if (name === 'partition_id') {
      if (fieldValue && fieldValue !== '') {
        const elements: Shelf[] = allShelfs.filter((sh: Shelf) => sh.partition_table === Number(fieldValue));
        elements.sort((a, b) => Number(a.id) - Number(b.id));
        //const countPA = pAmount.toString().length >= 2 ? pAmount.toString().length : 2;
        //let count = elements.length.toString().length;
        //count = count < 2 ? 2 : count;
        setShelfs(
          elements.map((sh: Shelf, ind: number) => ({
              value: Number(sh.id),
              label: (warehouse as Warehouse).code + String(sh.partition_table).padStart(2, '0') + String(sh.number_of_shelves).padStart(2, '0'),
            }))
        )
      } else {
        setShelfs([]);
        setLocations([]);
      }
    } else if (name === 'shelf_id') {
      if (fieldValue && fieldValue !== '') {
        const element: Shelf[] = allShelfs.filter((sh: Shelf) => sh.id === Number(fieldValue));
        const elementSf: ValueSelect[] = shelfs.filter((vs: ValueSelect) => vs.value === Number(fieldValue));
        if (element.length > 0 && elementSf.length > 0) {
          const currentShelf = elementSf[0];
          const columns = element[0].column_ammount;
          const layers = element[0].layers;
          if (columns > 0 && layers > 0) {
            //const columnsLength = columns.toString().length >= 2 ? columns.toString().length : 2;
            //const layersLength = layers.toString().length >= 2 ? layers.toString().length : 2;
            let items: ValueSelect[] = [];
            for (let i = 1; i <= layers; i++) {
              for (let j = 1; j <= columns; j++) {
                const value = i.toString() + '-' + j.toString();
                const layerStr = String(i).padStart(2, '0');
                const columnStr = String(j).padStart(2, '0');

                items.push({
                  value: value,
                  label: currentShelf.label + layerStr + columnStr
                });
              }
            }
            setLocations(items);
          } else {
            setLocations([]);
          }
        } else {
          setLocations([]);
        }
      } else {
        setLocations([]);
      }
    }
  };
  
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
                      options={partitions}
                      customClass="custom-input"
                      required
                      onChangeFunction={handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <GenericInput
                      type="select"
                      name="shelf_id"
                      selectLabel={intl.formatMessage({ id: 'select_shelf' })}
                      options={shelfs}
                      customClass="custom-input"
                      required
                      onChangeFunction={handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <GenericInput
                      type="select"
                      name="location_id"
                      selectLabel={intl.formatMessage({ id: 'select_location' })}
                      options={locations}
                      customClass="custom-input"
                      required
                      onChangeFunction={handleInputChange}
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