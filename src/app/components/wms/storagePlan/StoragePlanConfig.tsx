import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem, } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import '../../../../styles/wms/storage.plan.config.scss';
import { showMsg, isOMS, isWMS, packingListDataToExcel } from '../../../../helpers';
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl';
import { updatePackingListById, removePackingListById } from '../../../../services/api.packing_list';
import { updateStoragePlanById, createStoragePlan, getStoragePlanById, getEmptyLocationsPlan } from '../../../../services/api.storage_plan';
import { autoAssignLocation } from '../../../../services/api.package_shelf';
import { StoragePlanConfigProps, PackingList, StoragePlan, EmptyLocation } from '../../../../types/storage_plan';
import { User } from '../../../../types/user';
import { Response } from '../../../../types/index';
import { Warehouse } from '../../../../types/warehouse';
import RowStoragePlan from '../../common/RowStoragePlan';
import RowStoragePlanHeader from '../../common/RowStoragePlanHeader';
import { Formik, Form } from 'formik';
import PackingListDialog from '../../common/PackingListDialog';
import BatchOnShelvesDialog from '../../common/BatchOnShelvesDialog';
import BatchOnShelvesSADialog from '../../common/BatchOnShelvesSADialog';
import ReceiptPDF from '../../common/ReceiptPDF';
import LocationSPLabelsPDF from '../../common/LocationSPLabelsPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CopyColumnToClipboard from "../../common/CopyColumnToClipboard";
import { getDateFormat, getHourFormat } from '../../../../helpers/utils';
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { Loading } from "../../common/Loading";

const changeAllCheckedPackingList = (packingLists: PackingList[], checked: boolean = true): PackingList[] => {
  return packingLists.map((packingList: PackingList) => {
    return {
      ...packingList,
      checked
    }
  });
};

const StoragePlanConfig = ({ id, inWMS }: StoragePlanConfigProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [rows, setRows] = useState<PackingList[]>([]);
    const [selectedRows, setSelectedRows] = useState<PackingList[]>([]);
    const [tabToShow, setTabToShow] = useState<number>(1);
    const [selectAllPackingListItems, setSelectAllPackingListItems] = useState<boolean>(false);
    const [showRemoveBoxDialog, setShowRemoveBoxDialog] = useState<boolean>(false);
    const [showSplitBillDialog, setShowSplitBillDialog] = useState<boolean>(false);
    const [showBatchOnShelvesDialog, setShowBatchOnShelvesDialog] = useState<boolean>(false);
    const [showBatchOnShelvesSADialog, setShowBatchOnShelvesSADialog] = useState<boolean>(false);
    const [emptyLocationItems, setEmptyLocationItems] = useState<EmptyLocation[]>([]);
    const [confirmationBatchOnShelvesDialog, setConfirmationBatchOnShelvesDialog] = useState<boolean>(false);
    const [showForceEntryDialog, setShowForceEntryDialog] = useState<boolean>(false);
    const [showAssignAutoDialog, setShowAssignAutoDialog] = useState<boolean>(false);
    const [boxNumber, setBoxNumber] = useState<number | null>(null);
    const [stateStoragePlan, setStateStoragePlan] = useState<string>('to be storage')
    const [storagePlan, setStoragePlan] = useState<StoragePlan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      getStoragePlan(id);
    }, []);

    const getStoragePlan = async(storagePlanId: number) => {
      setLoading(true);
      let sPlan = await getStoragePlanById(storagePlanId);
      if (sPlan !== null) {
        setStoragePlan(sPlan);
        setRows (sPlan.packing_list ? changeAllCheckedPackingList(sPlan.packing_list, false) : []);
        setBoxNumber(sPlan?.box_amount ? sPlan?.box_amount : null);
        setStateStoragePlan(sPlan.state ? sPlan.state : 'to be storage');
      }
      setLoading(false);
    }

    const autoAssignLocationAction = async() => {
      setLoading(true);
      let values: object = {};
      if (selectedRows.length > 0) {
        const boxIds: number[] = selectedRows.map((pl: PackingList) => {
          return Number(pl.id);
        });
        values = {
          box_ids: boxIds
        };
      }
      let response = await autoAssignLocation(id, values);
      if (response.status >= 200 && response.status <= 299) {
        if (response.data.success) {
          closeAssignAutoDialog();
          let restElements = rows.filter(row => !selectedRows.some(sr => sr.id === row.id));
          const allHavePS = allHavePackageShelf(restElements);
          
          if (storagePlan && stateStoragePlan && stateStoragePlan !== 'stocked' && (selectedRows.length === 0 || restElements.length === 0 || allHavePS)) {
            await updateStoragePlanById(Number(id), formatBody(storagePlan, false, 'stocked'));
          } else if (storagePlan && stateStoragePlan && stateStoragePlan !== 'into warehouse' && stateStoragePlan !== 'stocked') {
            await updateStoragePlanById(Number(id), formatBody(storagePlan, false, 'into warehouse'));
          }
          setSelectedRows([]);
          showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
          await getStoragePlan(id);
        } else {
          closeAssignAutoDialog();
          setLoading(false);
          showMsg(intl.formatMessage({ id: 'no_space_auto_location' }), { type: "warning" })
          openConfirmationBatchOnShelvesDialog();
        }
      } else {
        closeAssignAutoDialog();
        setLoading(false);
        showMsg(intl.formatMessage({ id: 'unknownStatusErrorMsg' }), { type: "error" })
      }
    }

    const initialValues = {
        rows: [],
    };

    const valuesToExportPDF = new Set([
      "order_number",
      "customer_order_number",
      "user_id",
      "warehouse_id",
      "box_amount",
    ]);
  
      const cancelSend = () => {
          router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan`);
      };

      const getUserLabel = (): string | number => {
        if (storagePlan && storagePlan.user) {
          return storagePlan.user.customer_number + ' - ' +  storagePlan.user.username;
        }
        return '';
      };

      const getWarehouseLabel = (): string | number => {
        if (storagePlan?.warehouse) {
          return storagePlan?.warehouse.name + ` (${storagePlan?.warehouse.code})`;
        }
        return '';
      };

      const goToEdit = () => {
        router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/update?goBack=config`)
      };

      const handleUpdateRow = (id: number, updatedValues: PackingList) => {
        
      };

      const handleAction = (action: number) => {
        switch(action) {
          case 1: {
            router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/add_packing_list`)
          } break;
          case 2: {
            setShowRemoveBoxDialog(true);
          } break;
          case 3: {
            router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/modify_packing_list`)
          } break;
          case 4: {
            setShowSplitBillDialog(true);
          } break;
          case 5: {
            setShowBatchOnShelvesDialog(true);
          } break;
          case 6: {
            router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/history?goBack=config`)
          } break;
          case 7: {
            //Fast delivery
          } break;
          case 8: {
            
          } break;
        }
      }
  
      const formatBody = (values: StoragePlan, isSplitBill=false, nextState: string = ''): StoragePlan => {
        return {
                user_id: values.user_id,
                warehouse_id: values.warehouse_id,
                customer_order_number: values.customer_order_number + (isSplitBill ? '_1' : ''),
                box_amount: values.box_amount,
                delivered_time: values.delivered_time,
                observations: values.observations,
                rejected_boxes: values.rejected_boxes,
                return: values.return,
                state: (nextState !== '' && (!stateStoragePlan || (stateStoragePlan && (stateStoragePlan === 'to be storage' || stateStoragePlan === 'into warehouse' || stateStoragePlan === 'stocked')))) ? nextState : (stateStoragePlan ? stateStoragePlan : 'to be storage')
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

      const semiautomaticAssignFn = async() => {
        setLoading(true);
        const response: Response = await getEmptyLocationsPlan(id);
        setLoading(false);
        if (response.status >= 200 && response.status <= 299) {
          const data = response.data;
          if (data.available && (data.available.length > 0)) {
            const items: EmptyLocation[] = data.available;
            await setEmptyLocationItems(items);
            setShowBatchOnShelvesSADialog(true);
          } else {
            showMsg(intl.formatMessage({ id: 'no_suggestions_to_show_sl' }), { type: "warning" })
            openConfirmationBatchOnShelvesDialog();
          }
        } else {
          showMsg(intl.formatMessage({ id: 'unknownStatusErrorMsg' }), { type: "error" })
        }
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

      const batchOnShelvesAction = (packingListItems: PackingList[], isSemiautomatic: boolean = false) => {
        if (!isSemiautomatic) {
          setShowBatchOnShelvesDialog(false);
        } else {
          closeBatchOnShelvesSADialog();
        }
        const elements = changeRowsAfterBatchOnShelves(packingListItems);
        setRows(elements);
        setSelectedRows([]);

        if (allHavePackageShelf(elements)) {
          if (storagePlan && stateStoragePlan && stateStoragePlan !== 'stocked') {
            updateStoragePlanById(Number(id), formatBody(storagePlan, false, 'stocked'));
            setStateStoragePlan('stocked');
          }
        } else if (atLeastOneHasPackageShelf(elements)) {
          if (storagePlan && stateStoragePlan && stateStoragePlan !== 'into warehouse' && stateStoragePlan !== 'stocked') {
            updateStoragePlanById(Number(id), formatBody(storagePlan, false, 'into warehouse'));
            setStateStoragePlan('into warehouse');
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

      const closeBatchOnShelvesSADialog = () => {
        setShowBatchOnShelvesSADialog(false);
        setEmptyLocationItems([]);
      }

      const openConfirmationBatchOnShelvesDialog = () => {
        setConfirmationBatchOnShelvesDialog(true);
      }

      const handleConfirmationBatchOnShelvesDialog = async() => {
        await closeConfirmationBatchOnShelvesDialog();
        setShowBatchOnShelvesDialog(true);
      }

      const closeConfirmationBatchOnShelvesDialog = async() => {
        await setConfirmationBatchOnShelvesDialog(false);
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

      const openAssignAutoDialog = () => {
        setShowAssignAutoDialog(true);
      }

      const closeAssignAutoDialog = () => {
        setShowAssignAutoDialog(false);
      }

      const openForceEntryStoragePlanDialog = () => {
        setShowForceEntryDialog(true);
      }

      const closeForceEntryStoragePlanDialog = () => {
        setShowForceEntryDialog(false);
      }

      const handleForceEntry = async() => {
          const response: Response = await updateStoragePlanById(Number(id), formatBody(storagePlan as StoragePlan, false, 'stocked'));
          if (response.status >= 200 && response.status <= 299) {
            const message = intl.formatMessage({ id: 'successfullyActionMsg' });
            setStateStoragePlan('stocked');
            showMsg(message, { type: "success" });
            closeForceEntryStoragePlanDialog();
          } else {
            let message = intl.formatMessage({ id: 'unknownStatusErrorMsg' });
            showMsg(message, { type: "error" });
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
                  className={(!inWMS && (stateStoragePlan !== 'to be storage')) ? 'do-not-show-dropdown-item' : 'px-4'}
                  onClick={()=>goToEdit()}
                >
                  {intl.formatMessage({ id: 'go_to_edit' })}
                </Button>
              </div>
              <div className='w-100' style={{ marginLeft: '10px' }}>
                <Button
                  color="primary"
                  type="button"
                  className='px-4'
                  onClick={()=>cancelSend()}
                >
                  {intl.formatMessage({ id: 'back' })}
                </Button>
              </div>
            </div>
            <Loading loading={loading}>
            <div className='user-form-body__container'>
                <div className='storage-plan-data'>
                  <div style={{ paddingTop: '10px' }}>
                    <div className='storage-plan-data__table bg-default-100' style={{ padding: '5px 0px 5px 5px', borderRadius: '5px 5px 0 0' }}>
                      <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'customer_order_number' })}</span>
                      </div>
                      {
                        inWMS && (
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'user' })}</span>
                          </div>
                        )
                      }
                      {
                        inWMS && (
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'storage' })}</span>
                          </div>
                        )
                      }
                      {
                        inWMS && (
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'number_of_boxes' })}</span>
                          </div>
                        )
                      }
                      {
                        !inWMS && (
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'number_of_boxes_entered' })}</span>
                          </div>
                        )
                      }
                      {
                        !inWMS && (
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'number_of_boxes_stored' })}</span>
                          </div>
                        )
                      }
                      {
                        !inWMS && (
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'evidence' })}</span>
                          </div>
                        )
                      }
                      <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'country' })}</span>
                      </div>
                      <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'reference_number' })}</span>
                      </div>
                      <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'pr_number' })}</span>
                      </div>
                      {/* <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'client_weight' })}</span>
                      </div>
                      <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'client_volume' })}</span>
                      </div> */}
                      <div className='elements-center-start'>
                        <span className=''>{intl.formatMessage({ id: 'observations' })}</span>
                      </div>
                    </div>
                    <div className='storage-plan-data__table storage-plan-header' style={{ padding: '5px 0px 5px 5px', borderRadius: '0 0 5px 5px' }}>
                      <div>
                        {storagePlan?.customer_order_number}
                      </div>
                      {
                        inWMS && (
                          <div>
                            {getUserLabel()}
                          </div>
                        )
                      }
                      {
                        inWMS && (
                          <div>
                            {getWarehouseLabel()}
                          </div>
                        )
                      }
                      <div>
                        {boxNumber}
                      </div>
                      {
                        !inWMS && (
                          <div>
                            { rows.length > 0 ? (rows.filter((pl: PackingList) => pl.package_shelf && pl.package_shelf.length > 0).length - rows.filter((pl: PackingList) => pl.dispatched).length) : '0' }
                          </div>
                        )
                      }
                      {
                        !inWMS && (
                          <div>
                            { (storagePlan && storagePlan.images) ? storagePlan.images.length : '0' }
                          </div>
                        )
                      }
                      <div>
                        {storagePlan?.country}
                      </div>
                      <div className='spc'>
                        {storagePlan?.reference_number &&
                          <CopyColumnToClipboard
                            value={
                              storagePlan?.reference_number
                            }
                          />
                        } 
                      </div>
                      <div className='spc'>
                        {storagePlan?.pr_number &&
                          <CopyColumnToClipboard
                            value={
                              storagePlan?.pr_number
                            }
                          />
                        }
                      </div>
                      {/* <div>
                        {storagePlan?.weight}
                      </div>
                      <div>
                        {storagePlan?.volume}
                      </div> */}
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
                      {(storagePlan && (storagePlan !== null)) && 
                      (<Dropdown>
                        <DropdownTrigger>
                          <Button color="primary" type="button" className='px-4'>
                            {intl.formatMessage({ id: "actions" })}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem className={(storagePlan && stateStoragePlan !== 'to be storage') ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(1)}>
                            {intl.formatMessage({ id: "add_box" })}
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || (storagePlan && stateStoragePlan !== 'to be storage')) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(2)}>
                            {intl.formatMessage({ id: "remove_box" })}
                          </DropdownItem>
                          {/* <DropdownItem className={((storagePlan && (stateStoragePlan === 'to be storage' || stateStoragePlan === 4))) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(7)}>
                            {intl.formatMessage({ id: "fast_delivery" })}
                          </DropdownItem> */}
                          <DropdownItem onClick={() => packingListDataToExcel(storagePlan as StoragePlan, rows, intl, tabToShow === 1 ? 'ic' : 'lg' )}>
                            {intl.formatMessage({ id: "generate_xlsx_inventory" })}
                          </DropdownItem>
                          <DropdownItem>
                            <PDFDownloadLink document={<ReceiptPDF storagePlan={storagePlan as StoragePlan} intl={intl} />} fileName="inventory_pdf.pdf">
                              {({ blob, url, loading, error }) =>
                                intl.formatMessage({ id: "generate_pdf_inventory" })
                              }
                            </PDFDownloadLink>
                          </DropdownItem>
                          <DropdownItem className={(!inWMS || (storagePlan && (stateStoragePlan !== 'stocked' && stateStoragePlan !== 'into warehouse'))) ? 'do-not-show-dropdown-item' : ''}>
                            <PDFDownloadLink document={<LocationSPLabelsPDF packingLists={rows} warehouseCode={String((storagePlan as StoragePlan).warehouse?.code)} orderNumber={String((storagePlan as StoragePlan).order_number)} intl={intl} />} fileName="entry_plan_labels.pdf">
                              {({ blob, url, loading, error }) =>
                                intl.formatMessage({ id: "generate_location_tag" })
                              }
                            </PDFDownloadLink>
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || !inWMS || (storagePlan && (stateStoragePlan === 'cancelled'))) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(5)}>
                            {intl.formatMessage({ id: "batch_on_shelves" })}
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || !inWMS || (storagePlan && (stateStoragePlan === 'cancelled'))) ? 'do-not-show-dropdown-item' : ''} onClick={() => semiautomaticAssignFn()}>
                            {intl.formatMessage({ id: "batch_on_shelves_semiauto" })}
                          </DropdownItem>
                          <DropdownItem className={(!inWMS || (storagePlan && (stateStoragePlan === 'cancelled'))) ? 'do-not-show-dropdown-item' : ''} onClick={() => openAssignAutoDialog()}>
                            {intl.formatMessage({ id: "batch_on_shelves_auto" })}
                          </DropdownItem>
                          <DropdownItem className={(selectedRows.length === 0 || (selectedRows.length === rows.length) || (storagePlan && ((inWMS && (stateStoragePlan === 'stocked' || stateStoragePlan === 'cancelled')) || (!inWMS && stateStoragePlan !== 'to be storage')))) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(4)}>
                            {intl.formatMessage({ id: "split_bill" })}
                          </DropdownItem>
                          <DropdownItem className={(inWMS && storagePlan && stateStoragePlan === 'into warehouse') ? '' : 'do-not-show-dropdown-item'} onClick={() => openForceEntryStoragePlanDialog()}>
                            {intl.formatMessage({ id: "force_entry" })}
                          </DropdownItem>
                          <DropdownItem className={(!storagePlan?.history || (storagePlan?.history && storagePlan?.history.length === 0)) ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(6)}>
                            {intl.formatMessage({ id: "history" })}
                          </DropdownItem>
                          <DropdownItem className={(!inWMS && storagePlan && stateStoragePlan !== 'to be storage') ? 'do-not-show-dropdown-item' : ''} onClick={() => handleAction(3)}>
                            {intl.formatMessage({ id: "modify_packing_list" })}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>)}
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
                        <div className='info-packing-list__table-ic bg-default-100' style={{ padding: '5px 0px 5px 5px', borderRadius: '5px 5px 0 0' }}>
                          <div className='elements-center'>
                            <input type="checkbox" name="selectAll" checked={selectAllPackingListItems} onChange={handleCheckboxChange} />
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'box_number' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'expansion_box_number' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'outgoing_order' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'dispatch_date' })}</span>
                          </div>
                          {/* <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'transfer_order_number' })}</span>
                          </div> */}
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'bill_lading_number' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'client_weight' })}(kg) / {intl.formatMessage({ id: 'dimensions' })}(cm)</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'storage_weight' })}(kg) / {intl.formatMessage({ id: 'dimensions' })}(cm)</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'location' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'storage_time' })}</span>
                          </div>
                          <div className='elements-center-start'>
                            <span className=''>{intl.formatMessage({ id: 'delivery_time' })}</span>
                          </div>
                        </div>
                        <div className='boxes-container-values'>
                        {rows.map((row, index) => (
                          <div key={index} className='info-packing-list__table-ic storage-plan-header' style={{ padding: '8px 0px 8px 5px'}}>
                            <div className='elements-start-center'>
                              <input type="checkbox" style={{ marginTop: '3px' }} name={`packing-list-${index}`} checked={row.checked} onChange={(event) => handleCheckboxChange(event, index)} />
                            </div>
                            <div>
                              <CopyColumnToClipboard
                                value={ row.box_number }
                              />
                            </div>
                            <div>
                              <CopyColumnToClipboard
                                value={ row.case_number }
                              />
                            </div>
                            <div>{row.output_plan_delivered_number ? <CopyColumnToClipboard value={ row.output_plan_delivered_number }/> : '--'}</div>
                            <div>{row.dispatched_time ? `${getDateFormat(row.dispatched_time)}, ${getHourFormat(row.dispatched_time)}` : '--'}</div>
                            {/* <div>{row.order_transfer_number ? row.order_transfer_number : '--'}</div> */}
                            <div>{(storagePlan && storagePlan.pr_number) ? (
                              <CopyColumnToClipboard value={ storagePlan.pr_number } />
                            ) : '--'}</div>
                            <div>{`${row.client_weight} / ${row.client_length}*${row.client_width}*${row.client_height}`}</div>
                            <div>{'--'}</div>
                            <div style={{ overflowWrap: 'break-word' }}>
                            {
                              (row.package_shelf && row.package_shelf.length > 0) ? (
                                <>
                                  {(storagePlan && storagePlan.warehouse) ? (
                                    <>
                                      {storagePlan.warehouse.code}-{String(row.package_shelf[0].shelf?.partition_table).padStart(2, '0')}-{String(row.package_shelf[0].shelf?.number_of_shelves).padStart(2, '0')}-{String(row.package_shelf[0].layer).padStart(2, '0')}-{String(row.package_shelf[0].column).padStart(2, '0')}
                                      <br />
                                    </>
                                  ) : null}
                                  {intl.formatMessage({ id: 'partition' })}: {(row.package_shelf && row.package_shelf.length > 0 && row.package_shelf[0].shelf) ? row.package_shelf[0].shelf.partition_table : ''}
                                  &nbsp;
                                  {intl.formatMessage({ id: 'shelf' })}: {(row.package_shelf && row.package_shelf.length > 0 && row.package_shelf[0].shelf) ? row.package_shelf[0].shelf.number_of_shelves : ''}
                                  <br />
                                  {intl.formatMessage({ id: 'layer' })}: {(row.package_shelf && row.package_shelf.length > 0) ? row.package_shelf[0].layer : ''}
                                  &nbsp;
                                  {intl.formatMessage({ id: 'column' })}: {(row.package_shelf && row.package_shelf.length > 0) ? row.package_shelf[0].column : ''}
                                </>
                              ) : '--'
                            }
                            </div>
                            <div>{row.storage_time ? `${row.storage_time} ${intl.formatMessage({id: 'days'})}` : "--"}</div>
                            <div>{(storagePlan && storagePlan.delivered_time) ? `${getDateFormat(storagePlan.delivered_time)}, ${getHourFormat(storagePlan.delivered_time)}` : '--'}</div>
                          </div>
                        ))}
                        </div>
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
                              <RowStoragePlanHeader onlyReadly={true} inWMS={inWMS} />
                              <div className='boxes-container-values'>
                                {rows.map((row, index) => (
                                  <RowStoragePlan key={index} initialValues={{ ...row, id: index }} inWMS={inWMS}
                                  onUpdate={(updatedValues) => handleUpdateRow(index, updatedValues)} onlyReadly={true} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  )
                }
            </div>
            </Loading>
            { showRemoveBoxDialog && <PackingListDialog close={closeRemoveBoxesDialog} confirm={removeBoxes} title={intl.formatMessage({ id: 'remove_box' })} packingLists={selectedRows} /> }
            { showSplitBillDialog && <PackingListDialog close={closeSplitBillDialog} confirm={splitBill} title={intl.formatMessage({ id: 'split_bill' })} packingLists={selectedRows} /> }
            { showBatchOnShelvesDialog && <BatchOnShelvesDialog close={closeBatchOnShelvesDialog} confirm={batchOnShelvesAction} title={intl.formatMessage({ id: 'batch_on_shelves' })} packingLists={selectedRows.length > 0 ? selectedRows : rows} warehouse={storagePlan?.warehouse} /> }
            { showBatchOnShelvesSADialog && <BatchOnShelvesSADialog close={closeBatchOnShelvesSADialog} confirm={batchOnShelvesAction} title={intl.formatMessage({ id: 'batch_on_shelves_semiauto' })} packingLists={selectedRows} warehouse={storagePlan?.warehouse} emptyLocations={emptyLocationItems} /> }
            { showForceEntryDialog && <ConfirmationDialog close={closeForceEntryStoragePlanDialog} confirm={handleForceEntry} />}
            { showAssignAutoDialog && <ConfirmationDialog close={closeAssignAutoDialog} confirm={autoAssignLocationAction} content={selectedRows.length > 0 ? intl.formatMessage({ id: "confirmation_partial_location_text" }) : intl.formatMessage({ id: "confirmation_location_text" })} />}
            { confirmationBatchOnShelvesDialog && <ConfirmationDialog close={closeConfirmationBatchOnShelvesDialog} confirm={handleConfirmationBatchOnShelvesDialog} content={intl.formatMessage({ id: "want_package_location_manual" })} />}
        </div>
    );
};
  
export default StoragePlanConfig;