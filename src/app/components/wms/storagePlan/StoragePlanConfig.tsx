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
import { useIntl } from 'react-intl';
import { updatePackingListById, removePackingListById } from '../../../../services/api.packing_list';
import { updateStoragePlanById, createStoragePlan} from '../../../../services/api.storage_plan';
import { StoragePlanProps, PackingList, StoragePlan } from '../../../../types/storage_plan';
import { User } from '../../../../types/user';
import { Response } from '../../../../types/index';
import { Warehouse } from '../../../../types/warehouse';
import RowStoragePlan from '../../common/RowStoragePlan';
import RowStoragePlanHeader from '../../common/RowStoragePlanHeader';
import { Formik, Form } from 'formik';
import PackingListDialog from '../../common/PackingListDialog';
import BatchOnShelvesDialog from '../../common/BatchOnShelvesDialog';
import ReceiptPDF from '../../common/ReceiptPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

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
    const [showRemoveBoxDialog, setShowRemoveBoxDialog] = useState<boolean>(false);
    const [showSplitBillDialog, setShowSplitBillDialog] = useState<boolean>(false);
    const [showBatchOnShelvesDialog, setShowBatchOnShelvesDialog] = useState<boolean>(false);
    const [boxNumber, setBoxNumber] = useState<number | null>(storagePlan?.box_amount ? storagePlan?.box_amount : null);
    
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
            setShowRemoveBoxDialog(true);
          } break;
          case 3: {
            router.push(`/${locale}/wms/storage_plan/${id}/modify_packing_list`)
          } break;
          case 4: {
            setShowSplitBillDialog(true);
          } break;
          case 5: {
            setShowBatchOnShelvesDialog(true);
          } break;
          case 6: {
            router.push(`/${locale}/wms/storage_plan/${id}/history`)
          } break;
          case 7: {
            //Fast delivery
          } break;
          case 8: {
            
          } break;
        }
      }
  
      const formatBody = (values: StoragePlan, isSplitBill=false, nextState=-1): StoragePlan => {
        return {
                user_id: values.user_id,
                warehouse_id: values.warehouse_id,
                customer_order_number: values.customer_order_number + (isSplitBill ? '_1' : ''),
                box_amount: values.box_amount,
                delivered_time: values.delivered_time,
                observations: values.observations,
                rejected_boxes: values.rejected_boxes,
                return: values.return,
                state: (nextState !== -1 && (!values.state || (values.state && values.state <= 3))) ? nextState : (values.state ? values.state : 1)
              };
      }

      const removeBoxes = async() => {
        let amount = 0;
        let packingListAux: PackingList[] = [];
        for (let index = 0; index < selectedRows.length; index++) {
          const element: PackingList = selectedRows[index];
          const response: Response = await removePackingListById(Number(element.id));
          if (response.status >= 200 && response.status <= 299) {
            amount ++;
            packingListAux.push(element);
          }
        }
        if (amount !== 0) {
          await updateStoragePlanById(Number(id), formatBody({ ...(storagePlan as StoragePlan), box_amount: (rows.length - amount) < 0 ? 0 : (rows.length - amount) }));
          const items = rows.filter(item => !packingListAux.find(subItem => subItem.id === item.id));
          setRows(items);
          setSelectedRows([]);
          showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
          setBoxNumber(items.length);
        } else {
          showMsg(intl.formatMessage({ id: 'unknownStatusErrorMsg' }), { type: "error" })
        }
        setShowRemoveBoxDialog(false);
      };

      const closeRemoveBoxesDialog = () => {
        setShowRemoveBoxDialog(false);
      }

      const formatBodyPackingList = (pl: PackingList, storagePlanId: number): PackingList => {
        return  {
          storage_plan_id: storagePlanId,
          box_number: pl.box_number,
          case_number: pl.case_number,
          client_height: pl.client_height,
          client_length: pl.client_length,
          client_weight: pl.client_weight,
          client_width: pl.client_width,
          amount: pl.amount,
          product_name: pl.product_name,
          english_product_name: pl.english_product_name,
          price: pl.price,
          material: pl.material,
          customs_code: pl.customs_code,
          fnscu: pl.fnscu,
          order_transfer_number: pl.order_transfer_number,
          id: pl.id
        };
      }

      const splitBill = async() => {
        let amount = 0;
        let packingListAux: PackingList[] = [];
        const response: Response = await createStoragePlan(formatBody({ ...(storagePlan as StoragePlan), box_amount: selectedRows.length }, true));
        if (response.status >= 200 && response.status <= 299) {
          const responseSP: StoragePlan = response.data;
          if (responseSP) {
            for (let index = 0; index < selectedRows.length; index++) {
              const element: PackingList = selectedRows[index];
              const response: Response = await updatePackingListById(Number(element.id), formatBodyPackingList(element, Number(responseSP.id)));
              if (response.status >= 200 && response.status <= 299) {
                amount ++;
                packingListAux.push(element);
              }
            }

            if (amount !== 0) {
              await updateStoragePlanById(Number(id), formatBody({ ...(storagePlan as StoragePlan), box_amount: (rows.length - amount) < 0 ? 0 : (rows.length - amount) }));
              const items = rows.filter(item => !packingListAux.find(subItem => subItem.id === item.id));
              setRows(items);
              setSelectedRows([]);
              setBoxNumber(items.length);
            }
          }
          showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
          setShowSplitBillDialog(false);
        } else {
          let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
          showMsg(message, { type: "error" });
        }
      };

      const closeSplitBillDialog = () => {
        setShowSplitBillDialog(false);
      }

      const batchOnShelvesAction = (packingListItems: PackingList[]) => {
        setShowBatchOnShelvesDialog(false);
        const elements = changeRowsAfterBatchOnShelves(packingListItems);
        setRows(elements);
        setSelectedRows([]);

        if (allHavePackageShelf(elements)) {
          if (storagePlan && storagePlan.state && storagePlan.state !== 3) {
            updateStoragePlanById(Number(id), formatBody(storagePlan, false, 3));
          }
        } else if (atLeastOneHasPackageShelf(elements)) {
          if (storagePlan && storagePlan.state && storagePlan.state !== 2) {
            updateStoragePlanById(Number(id), formatBody(storagePlan, false, 2));
          }
        }
      }

      const allHavePackageShelf = (packingListItems: PackingList[]): boolean => {
        return packingListItems.every((item) => (item.package_shelf && (item.package_shelf.length > 0)));
      };
      
      const atLeastOneHasPackageShelf = (packingListItems: PackingList[]): boolean => {
        return packingListItems.some((item) => (item.package_shelf && (item.package_shelf.length > 0)));
      };

      const changeRowsAfterBatchOnShelves = (packingListItems: PackingList[]) => {
        const updatedRows = [...rows];
    
        packingListItems.forEach((item) => {
          const index = updatedRows.findIndex((row) => row.id === item.id);
    
          if (index !== -1) {
            updatedRows[index] = { ...updatedRows[index], ...item };
          }
        });
    
        return changeAllCheckedPackingList(updatedRows, false);
      }

      const closeBatchOnShelvesDialog = () => {
        setShowBatchOnShelvesDialog(false);
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
                        {boxNumber}
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
                          <DropdownItem className={(storagePlan && storagePlan.state !== 1) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(1)}>
                            {intl.formatMessage({ id: "add_box" })}
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || (storagePlan && storagePlan.state !== 1)) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(2)}>
                            {intl.formatMessage({ id: "remove_box" })}
                          </DropdownItem>
                          {/* <DropdownItem className={((storagePlan && (storagePlan.state === 1 || storagePlan.state === 4))) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(7)}>
                            {intl.formatMessage({ id: "fast_delivery" })}
                          </DropdownItem> */}
                          <DropdownItem className={(storagePlan && (storagePlan.state !== 3)) ? 'do-not-show-dropdown-item' : ''}>
                            <PDFDownloadLink document={<ReceiptPDF storagePlan={storagePlan as StoragePlan} intl={intl} />} fileName="receipt_pdf.pdf">
                              {({ blob, url, loading, error }) =>
                                intl.formatMessage({ id: "generate_receipt" })
                              }
                            </PDFDownloadLink>
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || (storagePlan && (storagePlan.state === 4))) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(5)}>
                            {intl.formatMessage({ id: "batch_on_shelves" })}
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || (selectedRows.length === rows.length) || (storagePlan && (storagePlan.state === 3 || storagePlan.state === 4))) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(4)}>
                            {intl.formatMessage({ id: "split_bill" })}
                          </DropdownItem>
                          <DropdownItem onClick={() => handleAction(6)}>
                            {intl.formatMessage({ id: "history" })}
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
            { showRemoveBoxDialog && <PackingListDialog close={closeRemoveBoxesDialog} confirm={removeBoxes} title={intl.formatMessage({ id: 'remove_box' })} packingLists={selectedRows} /> }
            { showSplitBillDialog && <PackingListDialog close={closeSplitBillDialog} confirm={splitBill} title={intl.formatMessage({ id: 'split_bill' })} packingLists={selectedRows} /> }
            { showBatchOnShelvesDialog && <BatchOnShelvesDialog close={closeBatchOnShelvesDialog} confirm={batchOnShelvesAction} title={intl.formatMessage({ id: 'batch_on_shelves' })} packingLists={selectedRows} warehouse={storagePlan?.warehouse} /> }
        </div>
    );
};
  
export default StoragePlanConfig;