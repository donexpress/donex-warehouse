import React, { useState, ChangeEvent } from 'react';
import { Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem, } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import '../../../../styles/wms/storage.plan.config.scss';
import { showMsg, isOMS, isWMS } from '../../../../helpers';
import { useRouter } from 'next/router'
import GenericInput from '../../common/GenericInput';
import { useIntl } from 'react-intl';
import { createPackingList } from '../../../../services/api.packing_list';
import { StoragePlanProps, PackingList } from '../../../../types/storage_plan';
import { User } from '../../../../types/user';
import { Warehouse } from '../../../../types/warehouse';
import RowStoragePlan from '../../common/RowStoragePlan';
import RowStoragePlanHeader from '../../common/RowStoragePlanHeader';
import { Formik, Form } from 'formik';

const changeAllCheckedPackingList = (packingLists: PackingList[], checked: boolean = true): PackingList[] => {
  return packingLists.map((packingList: PackingList) => {
    return {
      ...packingList,
      checked
    }
  });
};

const StoragePlanConfig = ({ users, warehouses, id, storagePlan }: StoragePlanProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [rows, setRows] = useState<PackingList[]>(storagePlan && storagePlan.packing_list ? changeAllCheckedPackingList(storagePlan.packing_list, false) : []);
    const [selectedRows, setSelectedRows] = useState<PackingList[]>([]);
    const [tabToShow, setTabToShow] = useState<number>(1);
    const [selectAllPackingListItems, setSelectAllPackingListItems] = useState<boolean>(false);
    
    const initialValues = {
        rows: [],
    };
  
      const cancelSend = () => {
          if (isWMS()) {
            router.push(`/${locale}/wms/storage_plan`);
          }
      };

      const getUserLabel = (usersAll: User[], userId: number): string | number => {
        const response: User[] = usersAll.filter((user) => user.id === userId);
        if (response && response.length > 0) {
          return response[0].customer_number + ' - ' +  response[0].username;
        }
        return userId;
      };

      const getWarehouseLabel = (warehouseAll: Warehouse[], warehouseId: number): string | number => {
        const response: Warehouse[] = warehouseAll.filter((warehouse) => warehouse.id === warehouseId);
        if (response && response.length > 0) {
          return response[0].name + ` (${response[0].code})`;
        }
        return warehouseId;
      };

      const goToEdit = () => {
        router.push(`/${locale}/wms/storage_plan/${id}/update`)
      };

      const handleUpdateRow = (id: number, updatedValues: PackingList) => {
        
      };

      const handleAction = (action: number) => {
        switch(action) {
          case 1: {
            router.push(`/${locale}/wms/storage_plan/${id}/add_packing_list`)
          } break;
          case 2: {

          } break;
          case 3: {
            router.push(`/${locale}/wms/storage_plan/${id}/modify_packing_list`)
          } break;
        }
      }

      const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, index: number = -1) => {
        // @ts-ignore
        const { type, checked } = event.target;
        if (type === "checkbox") {
          if (index === -1) {
            setSelectAllPackingListItems(checked);
            setRows(changeAllCheckedPackingList(rows, checked));
            setSelectedRows(checked ? changeAllCheckedPackingList(rows, true) : []);
          } else {
            const item: PackingList = {...rows[index], checked};
            const items: PackingList[] = rows.map((packingList: PackingList, i: number) => {
              return index !== i ? packingList : item;
            });
            setRows(items);

            if (checked) {
              setSelectedRows(selectedRows.concat([item]));
            } else {
              setSelectedRows(selectedRows.filter((element) => element.id !== item.id))
            }

            const isCheckoutAllItems = items.every(element => element.checked);
            if (isCheckoutAllItems) {
              setSelectAllPackingListItems(true);
            } else {
              setSelectAllPackingListItems(false);
            }
          }
        }
      }

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <div className='flex' style={{ paddingRight: '16px' }}>
              <h1 className="flex-1 text-xl font-semibold">
                {intl.formatMessage({ id: "config" })}
                {" "}
                {intl.formatMessage({ id: 'storagePlan' })}
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
                <div className='storage-plan-data'>
                  <div style={{ paddingTop: '10px' }}>
                    <div className='storage-plan-data__table bg-default-100' style={{ padding: '5px 0px 5px 5px', borderRadius: '5px 5px 0 0' }}>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'customer_order_number' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'user' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'storage' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'number_of_boxes' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'country' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'client_weight' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'client_volume' })}</span>
                      </div>
                      <div className='elements-center'>
                        <span className='text-center'>{intl.formatMessage({ id: 'observations' })}</span>
                      </div>
                    </div>
                    <div className='storage-plan-data__table storage-plan-header' style={{ padding: '5px 0px 5px 5px', borderRadius: '0 0 5px 5px' }}>
                      <div>
                        {storagePlan?.customer_order_number}
                      </div>
                      <div>
                        {getUserLabel(users, Number(storagePlan?.user_id))}
                      </div>
                      <div>
                        {getWarehouseLabel(warehouses, Number(storagePlan?.warehouse_id))}
                      </div>
                      <div>
                        {storagePlan?.box_amount}
                      </div>
                      <div>
                        {storagePlan?.country}
                      </div>
                      <div>
                        {storagePlan?.weight}
                      </div>
                      <div>
                        {storagePlan?.volume}
                      </div>
                      <div>
                        {storagePlan?.observations}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <div className='storage-plan-data__header-pl' style={{ paddingRight: '16px' }}>
                    <div className='elements-row-start show-sp-desktop'>
                      <div className={tabToShow === 1 ? 'tab-selected' : 'tag-default'} onClick={()=>{ setTabToShow(1) }}>
                        <span>{intl.formatMessage({ id: "cargo_information" })}</span>
                      </div>
                      <div className={tabToShow === 2 ? 'tab-selected' : 'tag-default'} onClick={()=>{ setTabToShow(2) }}>
                        <span>{intl.formatMessage({ id: "packing_list" })}</span>
                      </div>
                    </div>
                    <div className='elements-center-end'>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button color="primary" type="button" className='px-4'>
                            {intl.formatMessage({ id: "actions" })}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleAction(1)}>
                            {intl.formatMessage({ id: "add_box" })}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleAction(2)}>
                            {intl.formatMessage({ id: "remove_box" })}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleAction(3)}>
                            {intl.formatMessage({ id: "modify_packing_list" })}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className='elements-row-start show-sp-mobile'>
                      <div className={tabToShow === 1 ? 'tab-selected' : 'tag-default'} onClick={()=>{ setTabToShow(1) }}>
                        <span>{intl.formatMessage({ id: "cargo_information" })}</span>
                      </div>
                      <div className={tabToShow === 2 ? 'tab-selected' : 'tag-default'} onClick={()=>{ setTabToShow(2) }}>
                        <span>{intl.formatMessage({ id: "packing_list" })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  tabToShow === 1 && (
                    <div style={{ paddingTop: '10px' }} className='info-packing-list'>
                      <div>
                        <div className='info-packing-list__table bg-default-100' style={{ padding: '5px 0px 5px 5px', borderRadius: '5px 5px 0 0' }}>
                          <div className='elements-center'>
                            <input type="checkbox" name="selectAll" checked={selectAllPackingListItems} onChange={handleCheckboxChange} />
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'box_number' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'expansion_box_number' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'outgoing_order' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'transfer_order_number' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'bill_lading_number' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'client_weight' })}(kg) / {intl.formatMessage({ id: 'dimensions' })}(cm)</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'storage_weight' })}(kg) / {intl.formatMessage({ id: 'dimensions' })}(cm)</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'location' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'storage_time' })}</span>
                          </div>
                          <div className='elements-center'>
                            <span className='text-center'>{intl.formatMessage({ id: 'delivery_time' })}</span>
                          </div>
                        </div>
                        {rows.map((row, index) => (
                          <div key={index} className='info-packing-list__table storage-plan-header' style={{ padding: '8px 0px 8px 5px'}}>
                            <div className='elements-center'>
                              <input type="checkbox" name={`packing-list-${index}`} checked={row.checked} onChange={(event) => handleCheckboxChange(event, index)} />
                            </div>
                            <div>{row.box_number}</div>
                            <div>{row.case_number}</div>
                            <div>{'--'}</div>
                            <div>{row.order_transfer_number ? row.order_transfer_number : '--'}</div>
                            <div>{'--'}</div>
                            <div>{'--'}</div>
                            <div>{'--'}</div>
                            <div>{'--'}</div>
                            <div>{'--'}</div>
                            <div>{'--'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                {
                  tabToShow === 2 && (
                    <div style={{ paddingTop: '10px' }}>
                      <Formik initialValues={initialValues} onSubmit={()=>{}}>
                        <Form>
                          <div className='boxes-container'>
                            <div>
                              <RowStoragePlanHeader onlyReadly={true} />
                              {rows.map((row, index) => (
                                <RowStoragePlan key={index} initialValues={{ ...row, id: index }}
                                onUpdate={(updatedValues) => handleUpdateRow(index, updatedValues)} onlyReadly={true} />
                              ))}
                            </div>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  )
                }
            </div>
        </div>
    );
};
  
export default StoragePlanConfig;