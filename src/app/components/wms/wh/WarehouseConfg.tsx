import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem, } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import '../../../../styles/wms/warehouse.config.scss';
import { showMsg, isOMS, isWMS, getDateFromStr, getHourFromStr } from '../../../../helpers';
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl';
import { Response } from '../../../../types/index';
import { Warehouse, WarehouseConfigProps } from '../../../../types/warehouse';
import { Shelf } from '../../../../types/shelf';
import { removeShelfById } from '../../../../services/api.shelf';
import AddShelfDialog from '../../common/AddShelfDialog';
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { PDFDownloadLink } from '@react-pdf/renderer';
import LocationLabelsPDF from '../../common/LocationLabelsPDF';

type PartitionsItem = {
  partition_number: number;
  label: string;
}

const changeAllCheckedShelves = (shelves: Shelf[], checked: boolean = true): Shelf[] => {
  return shelves.map((shelf: Shelf) => {
    return {
      ...shelf,
      checked
    }
  });
};

const WarehouseConfig = ({ warehouse, id }: WarehouseConfigProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [partition, setPartition] = useState<number>(warehouse.patition_amount ? warehouse.patition_amount : 0);
    const [shelves, setShelves] = useState<Shelf[]>(warehouse.shelfs ? changeAllCheckedShelves(warehouse.shelfs, false) : []);
    const [shelvesToShow, setShelvesToShow] = useState<Shelf[]>((warehouse.patition_amount && warehouse.shelfs && (warehouse.patition_amount > 0) && (warehouse.shelfs.length > 0)) ? 
    (changeAllCheckedShelves(warehouse.shelfs, false).filter((shelf: Shelf) => shelf.partition_table === 1)) 
    : 
    []
    );
    const [shelvesToShowSelected, setShelvesToShowSelected] = useState<Shelf[]>([]);
    const [selectAllShelvesItems, setSelectAllShelvesItems] = useState<boolean>(false);
    const [partitionSelected, setPartitionSelected] = useState<number>(warehouse.patition_amount && warehouse.patition_amount > 0 ? 1 : 0);
    const [partitionItems, setPartitionItems] = useState<PartitionsItem[]>([]);

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [isCreatePartition, setIsCreatePartition] = useState<boolean>(false);
    const [partitionTableDialog, setPartitionTableDialog] = useState<number>(0);
    const [shelfNumberDialog, setShelfNumberDialog] = useState<number>(0);
    
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);


    useEffect(() => {
      let items: PartitionsItem[] = [];
      for (let index = 0; index < partition; index++) {
        const element: PartitionsItem = {
          partition_number: (index + 1),
          label: (`${warehouse.code}${String(index + 1).padStart(2, '0')}`)
        };
        items.push(element);
      }
      setPartitionItems(items);
    }, [partition, warehouse.code]);

    const selectPartitionItem = (partitionItem: PartitionsItem) => {
      if (partitionItem.partition_number !== partitionSelected) {
        setShelvesToShow(shelves.filter((shelf: Shelf) => shelf.partition_table === partitionItem.partition_number));
        setPartitionSelected(partitionItem.partition_number);
      }
    }

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, index: number = -1) => {
      // @ts-ignore
      const { type, checked } = event.target;
      if (type === "checkbox") {
        if (index === -1) {
          setSelectAllShelvesItems(checked);
          setShelvesToShow(changeAllCheckedShelves(shelvesToShow, checked));
          setShelvesToShowSelected(checked ? changeAllCheckedShelves(shelvesToShow, true) : []);
        } else {
          const item: Shelf = {...shelvesToShow[index], checked};
          const items: Shelf[] = shelvesToShow.map((shelf: Shelf, i: number) => {
            return index !== i ? shelf : item;
          });
          setShelvesToShow(items);

          if (checked) {
            setShelvesToShowSelected(shelvesToShowSelected.concat([item]));
          } else {
            setShelvesToShowSelected(shelvesToShowSelected.filter((element) => element.id !== item.id))
          }

          const isCheckoutAllItems = items.every(element => element.checked);
          if (isCheckoutAllItems) {
            setSelectAllShelvesItems(true);
          } else {
            setSelectAllShelvesItems(false);
          }
        }
      }
    }

    const cancelSend = () => {
        router.push(`/${locale}/wms/warehouses`);
    };

    const goToEdit = () => {
      router.push(`/${locale}/wms/warehouses/${id}/update?goBack=config`)
    };

    const goToShelf = (shelfId: number) => {
      router.push(`/${locale}/wms/warehouses/${id}/config/${shelfId}/shelf`)
    };

    const findMaxNumberOfShelvesNP = (pt: number): number => {
      const shelvesNP = shelves.filter((sv: Shelf) => sv.partition_table === pt)
      if (shelvesNP.length === 0) {
        return 1;
      }
    
      let maxNumber = shelvesNP.reduce((max, shelf) => {
        return Math.max(max, shelf.number_of_shelves);
      }, shelvesNP[0].number_of_shelves);

      if (shelvesNP.length > maxNumber) {
        maxNumber = shelvesNP.length;
      }
    
      return maxNumber + 1;
    }

    const handleAddPartition = async() => {
      await setTitleDialog(intl.formatMessage({ id: "add_partition" }));
      await setIsCreatePartition(true);
      await setPartitionTableDialog(partition + 1);
      await setShelfNumberDialog(findMaxNumberOfShelvesNP(partition+1));
      await setShowDialog(true);
    }

    const findMaxNumberOfShelves = (): number => {
      if (shelvesToShow.length === 0) {
        return 1;
      }
    
      let maxNumber = shelvesToShow.reduce((max, shelf) => {
        return Math.max(max, shelf.number_of_shelves);
      }, shelvesToShow[0].number_of_shelves);

      if (shelvesToShow.length > maxNumber) {
        maxNumber = shelvesToShow.length;
      }
    
      return maxNumber + 1;
    }

    const handleAddShelves = async() => {
      await setTitleDialog(intl.formatMessage({ id: "add_shelves" }));
      await setIsCreatePartition(false);
      await setPartitionTableDialog(partitionSelected);
      await setShelfNumberDialog(findMaxNumberOfShelves());
      await setShowDialog(true);
    }

    const confirmAddShelves = (items: Shelf[]) => {
      setShelves(shelves.concat(items));
      setShelvesToShowSelected([]);
      if (isCreatePartition) {
        if (partition === 0) {
          setShelvesToShow(items);
          setPartitionSelected(1)
        }
        setPartition(partition + 1);
      } else {
        setShelvesToShow(shelvesToShow.concat(items));
      }
      closeDialog();
    }

    const closeDialog = () => {
      setShowDialog(false);
      setTitleDialog('');
      setIsCreatePartition(false);
      setPartitionTableDialog(0);
      setShelfNumberDialog(0);
    }

    const handleRemoveShelves = async() => {
      let amount = 0;
      let shelvesAux: Shelf[] = [];
      for (let index = 0; index < shelvesToShowSelected.length; index++) {
        const element = shelvesToShowSelected[index];
        const response: Response = await removeShelfById(Number(element.id));
        if (response.status >= 200 && response.status <= 299) {
          amount ++;
          shelvesAux.push(element);
        }
      }

      if (amount !== 0) {
        setShelves(shelves.filter(item => !shelvesAux.find(subItem => subItem.id === item.id)));
        setShelvesToShow(shelvesToShow.filter(item => !shelvesAux.find(subItem => subItem.id === item.id)));
        setShelvesToShowSelected([]);
        showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
      } else {
        showMsg(intl.formatMessage({ id: 'unknownStatusErrorMsg' }), { type: "error" })
      }

      setShowDeleteDialog(false);
    }

    const openDeleteDialog = () => {
      setShowDeleteDialog(true);
    }

    const closeDeleteDialog = () => {
      setShowDeleteDialog(false);
    }

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <div className='flex' style={{ paddingRight: '16px' }}>
              <h1 className="flex-1 text-xl font-semibold">
                {intl.formatMessage({ id: "config" })}
                {" "}
                {intl.formatMessage({ id: 'warehouse' })}
              </h1>
              <div className='w-100'>
                <Button
                  color="primary"
                  type="button"
                  className='px-4'
                  onClick={()=>goToEdit()}
                >
                  {intl.formatMessage({ id: 'go_to_edit' })}
                </Button>
              </div>
            </div>
            <div className='user-form-body__container'>
                <div className='warehouse-data'>
                    <div style={{ paddingTop: '10px', minWidth: '100%' }}>
                        <div className='warehouse-data__table storage-plan-header' style={{ borderRadius: '5px' }}>
                            <div>
                                <div className='warehouse-data__sub-table'>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 5px', borderTopLeftRadius: '5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'warehouse_code' })}</span>
                                    </div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'warehouse_name' })}</span>
                                    </div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'country' })}</span>
                                    </div>

                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 5px' }}>
                                        { warehouse.code }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { warehouse.name }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { warehouse.country }
                                    </div>
                                    
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'number_of_partitions' })}</span>
                                    </div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'number_of_shelves' })}</span>
                                    </div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'total_volume' })} (m³)</span>
                                    </div>

                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 5px' }}>
                                        { partition }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { shelves.length }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { '--' }
                                    </div>
                                    
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'used_volume' })} (m³)</span>
                                    </div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'state' })}</span>
                                    </div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'creation_time' })}</span>
                                    </div>

                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 5px' }}>
                                        { '--' }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { 'Activo' }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { `${getDateFromStr(warehouse.created_at)} ${getHourFromStr(warehouse.created_at)}` }
                                    </div>
                                </div>
                                <div>
                                    <div className='elements-center-start bg-default-100' style={{ padding: '7px 2px 7px 5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'remark' })}</span>
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 5px', borderBottomLeftRadius: '5px' }}>
                                        { warehouse.observations && warehouse.observations !== '' ? warehouse.observations : '--' }
                                    </div>
                                </div>
                            </div>
                            <div className='storage-plan-header' style={{ borderBottomRightRadius: '5px' }}>
                                <div className='elements-center-start bg-default-100' style={{ padding: '7px 0px 7px 2px', height: '32px', borderTopRightRadius: '5px' }}>
                                  <span className='text-center'>{intl.formatMessage({ id: 'address_information' })}</span>
                                </div>

                                <div className='storage-plan-header' style={{ padding: '5px 0px 5px 5px', height: 'calc(100% - 32px)' , borderLeft: 'solid 1px #37446b', borderBottomRightRadius: '5px' }}>
                                    { warehouse.address_1 &&
                                        <div>{ warehouse.address_1 }</div> 
                                    }
                                    { warehouse.address_2 &&
                                        <div>{ warehouse.address_2 }</div> 
                                    }
                                    { warehouse.city &&
                                        <div>{ warehouse.city }</div> 
                                    }
                                    { warehouse.province &&
                                        <div>{ warehouse.province }</div> 
                                    }
                                    { warehouse.cp &&
                                        <div>{ warehouse.cp }</div> 
                                    }
                                    { warehouse.company &&
                                        <div>{ warehouse.company }</div> 
                                    }
                                    { warehouse.phone &&
                                        <div>{ warehouse.phone }</div> 
                                    }
                                    { warehouse.email &&
                                        <div>{ warehouse.email }</div> 
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <div className='warehouse-data__header-pl' style={{ paddingRight: '16px' }}>
                    <div className='elements-row-start show-sp-desktop'>
                      <div className='tab-selected'>
                        <span>{intl.formatMessage({ id: "partitions" })}</span>
                      </div>
                    </div>
                    <div className='elements-row-end'>
                      <Button
                        color="primary"
                        onClick={() => handleAddPartition()}
                      >
                        {intl.formatMessage({ id: "add_partition" })}
                      </Button>
                    </div>
                    <div className='elements-row-start show-sp-mobile'>
                      <div className='tab-selected'>
                        <span>{intl.formatMessage({ id: "partitions" })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  (partition === 0) && (
                    <div style={{ fontSize: '14px', padding: '10px 5px 20px' }}>
                      <span>{intl.formatMessage({ id: "are_no_partitions" })}</span>
                    </div>
                  )
                }
                {
                  (partition > 0) && (
                    <div style={{ paddingTop: '10px', width: '100%' }} className='tag-container'>
                    {partitionItems.map((item, index) => (
                      <div key={index} className={ partitionSelected === item.partition_number ? 'tag-container__tag-selected' : 'tag-container__tag' } onClick={() => {selectPartitionItem(item)}} >
                        {item.label}
                      </div>
                    ))}
                    </div>
                  )
                }
                {
                  (shelvesToShow.length > 0) && (
                    <div style={{ paddingTop: '20px' }}>
                      <div className='warehouse-data__header-pl' style={{ paddingRight: '16px' }}>
                        <div className='elements-row-start show-sp-desktop'>
                          <div className='tab-selected'>
                            <span>{intl.formatMessage({ id: "shelves" })}</span>
                          </div>
                        </div>
                        <div className='elements-row-end-config'>
                          <Button
                            color="primary"
                            onClick={() => handleAddShelves()}
                            style={{ marginRight: '10px' }}
                          >
                            {intl.formatMessage({ id: "add_shelves" })}
                          </Button>
                          <Button
                            color="primary"
                            onClick={() => openDeleteDialog()}
                            style={{ marginRight: '10px' }}
                            isDisabled={(shelvesToShowSelected.length === 0)  || (shelvesToShowSelected.length === shelvesToShow.length)}
                          >
                            {intl.formatMessage({ id: "remove_shelves" })}
                          </Button>
                          <Button
                            color="primary"
                            type="button"
                            isDisabled={(shelvesToShowSelected.length === 0)}
                          >
                            <PDFDownloadLink document={<LocationLabelsPDF warehouse={warehouse} shelfs={shelvesToShowSelected} intl={intl} />} fileName="location_labels.pdf">
                              {({ blob, url, loading, error }) =>
                                intl.formatMessage({ id: "generate_labels" })
                              }
                            </PDFDownloadLink>
                          </Button>
                        </div>
                        <div className='elements-row-start show-sp-mobile'>
                          <div className='tab-selected'>
                            <span>{intl.formatMessage({ id: "partitions" })}</span>
                          </div>
                        </div>
                      </div>
                    </div> 
                  )
                }
                {
                  (shelvesToShow.length > 0) && (
                    <div style={{ paddingTop: '10px' }} className='info-shelf'>
                      <div className='info-shelf__sub-container'>
                        <div className='info-shelf__table bg-default-100' style={{ padding: '8px 0px 8px 5px', borderRadius: '5px 5px 0 0' }}>
                          <div className='elements-center'>
                            <input type="checkbox" name="selectAll" checked={selectAllShelvesItems} onChange={handleCheckboxChange} />
                          </div>
                          <div className='elements-center-start'>
                            <span className='text-center'>{intl.formatMessage({ id: 'shelf_number' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className='text-center'>{intl.formatMessage({ id: 'location_size' })} (cm)</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className='text-center'>{intl.formatMessage({ id: 'layers' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className='text-center'>{intl.formatMessage({ id: 'levels' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className='text-center'>{intl.formatMessage({ id: 'number_of_locations' })}</span>
                          </div>
                        </div>
                        {shelvesToShow.map((row: Shelf, index) => (
                          <div key={index} className='info-shelf__table storage-plan-header' style={{ padding: '8px 0px 8px 5px'}}>
                            <div className='elements-center'>
                              <input type="checkbox" name={`shelf-${index}`} checked={row.checked} onChange={(event) => handleCheckboxChange(event, index)} />
                            </div>
                            <div onClick={() => {goToShelf(Number(row.id))}} style={{cursor: 'pointer'}}>{`${warehouse.code}${String(row.partition_table).padStart(2, '0')}${String(row.number_of_shelves).padStart(2, '0')}`}</div>
                            <div>{row.location_length}*{row.location_width}*{row.high_inventory}</div>
                            <div>{row.layers}</div>
                            <div>{row.column_ammount}</div>
                            <div>{row.layers*row.column_ammount}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
            </div>
            { showDialog && (<AddShelfDialog close={closeDialog} confirm={confirmAddShelves} title={titleDialog} partition_table={partitionTableDialog} warehouse={warehouse} shelf_number={shelfNumberDialog} isCreatePartition={isCreatePartition}></AddShelfDialog>) }
            { showDeleteDialog && <ConfirmationDialog close={closeDeleteDialog} confirm={handleRemoveShelves} />}
        </div>
    );
};

export default WarehouseConfig;