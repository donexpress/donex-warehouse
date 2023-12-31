import React, { useState, ChangeEvent } from 'react';
import { Button } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import '../../../../styles/wms/storage.plan.config.scss';
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl';
import { HistoryStoragePlanProps, History as HistorySP, StoragePlan, PackingList } from '../../../../types/storage_plan';
import { PackageShelf } from '../../../../types/package_shelf';
import ElementHistoryDialog from '../../common/ElementHistoryDialog';
import { getDateFormat, getHourFormat } from '../../../../helpers/utils';

const StoragePlanHistory = ({ id, storagePlan, warehouses, users, inWMS }: HistoryStoragePlanProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [historyElement, setHistoryElement] = useState<HistorySP | null>(null);
    const [showElementHistoryDialog, setShowElementHistoryDialog] = useState<boolean>(false);
  
    const cancelSend = () => {
        const goBack = router.query.goBack;
        if (goBack && goBack === 'config') {
          router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan/${id}/config`);
        } else {
          router.push(`/${locale}/${inWMS ? 'wms' : 'oms'}/storage_plan`);
        }
    };

    const openElementHistoryDialog = async(element: HistorySP) => {
        await setHistoryElement(element);
        setShowElementHistoryDialog(true);
    }

    const closeElementHistoryDialog = () => {
        setShowElementHistoryDialog(false);
    }

    const getDateFromStr = (date: string | undefined): string => {
        if (date !== undefined && (date.length >= 10)) {
            return date.substring(0, 10);
        }
        return '';
    }

    const getHourFromStr = (date: string | undefined): string => {
        if (date !== undefined && (date.length >= 19)) {
            return date.substring(11, 19);
        }
        return '';
    }

    const getHistorySort = (elements: HistorySP[]) => {
        elements.sort(function (a, b) {
            // @ts-ignore
            const dateA = a.data.updated_at !== undefined ? (new Date(a.data.updated_at)).getTime() : -1;
            // @ts-ignore
            const dateB = b.data.updated_at !== undefined ? (new Date(b.data.updated_at)).getTime() : -1;
        
            return dateA - dateB;
          });
        return elements;
    }

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <div className='flex' style={{ paddingRight: '16px' }}>
              <h1 className="flex-1 text-xl font-semibold">
                {intl.formatMessage({ id: "history" })}
              </h1>
              <div className='w-100'>
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
            <div className='user-form-body__container'>
                <div className='storage-plan-data'>
                  <div className='w-full' style={{ padding: '10px 15px 0' }}>
                    {
                        storagePlan && storagePlan.history && (
                            <div className='w-full' style={{ borderLeft: 'dashed 2px white' }}>
                            {storagePlan.history.map((historySP: HistorySP, index: number) => (
                                <div className='w-full' key={index} style={{ padding: '0 15px', textAlign: 'left', position: 'relative', minHeight: '20px', background: index%2 === 0 ? 'none' : '#37446b' }} onClick={() => {openElementHistoryDialog(historySP)}}>
                                    <div style={{ height: '25px', width: '25px', borderRadius: '50%', background: '#9CA5AE', position: 'absolute', top: '0', left: '-13px', zIndex: '10' }}></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', columnGap: '20px', padding: '10px 0 10px 15px' }}>
                                        <div className='elements-center-start'>
                                            <div style={{ display: 'inline-block', marginBottom: '10px', padding: '3px 10px', background: 'white', color: '#333', borderRadius: '15px' }}>
                                                {
                                                    historySP.type === 'packing_list' && <span style={{fontSize: '11px'}}>{intl.formatMessage({ id: 'packing_list_item' })}</span>
                                                }
                                                {
                                                    historySP.type === 'storage_plan' && <span style={{fontSize: '11px'}}>{intl.formatMessage({ id: 'storagePlan' })}</span>
                                                }
                                                {
                                                    historySP.type === 'shelf_package' && <span style={{fontSize: '11px'}}>{intl.formatMessage({ id: 'package_location_on_shelf' })}</span>
                                                }
                                            </div>
                                            <div style={{ marginBottom: '5px' }}>
                                                {
                                                    historySP.data.updated_at ? getDateFormat(historySP.data.updated_at) : ''
                                                }
                                            </div>
                                            <div>
                                                {
                                                    historySP.data.updated_at ? getHourFormat(historySP.data.updated_at) : ''
                                                }
                                            </div>
                                        </div>
                                        <div className='elements-center-start'>
                                            {
                                                historySP.type === 'packing_list' && 
                                                <div className='elements-center-start'>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'box_number' })}</span>
                                                    <div style={{ paddingBottom: '10px' }}>{((historySP.data) as PackingList).box_number}</div>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'expansion_box_number' })}</span>
                                                    <div style={{ paddingBottom: '10px' }}>{((historySP.data) as PackingList).case_number}</div>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'amount' })}</span>
                                                    <div>{((historySP.data) as PackingList).amount}</div>
                                                </div>
                                            }
                                            {
                                                historySP.type === 'storage_plan' && 
                                                <div className='elements-center-start'>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'customer_order_number' })}</span>
                                                    <div style={{ paddingBottom: '10px' }}>{((historySP.data) as StoragePlan).customer_order_number}</div>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'warehouse_order_number' })}</span>
                                                    <div>{((historySP.data) as StoragePlan).order_number}</div>
                                                </div>
                                            }
                                            {
                                                historySP.type === 'shelf_package' && 
                                                <div className='elements-center-start'>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'box_number' })}</span>
                                                    <div style={{ paddingBottom: '10px' }}>{(((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.box_number : '')}</div>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'expansion_box_number' })}</span>
                                                    <div style={{ paddingBottom: '10px' }}>{(((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.case_number : '')}</div>
                                                    <span style={{ fontWeight: '600' }}>{intl.formatMessage({ id: 'location' })}</span>
                                                    <div style={{ paddingBottom: '10px' }}>
                                                        {`${intl.formatMessage({ id: 'partition' })}: ${((historySP.data) as PackageShelf).shelf ? ((historySP.data) as PackageShelf).shelf?.partition_table : ''}
                                                        ${intl.formatMessage({ id: 'shelf' })}: ${((historySP.data) as PackageShelf).shelf ? ((historySP.data) as PackageShelf).shelf?.number_of_shelves : ''}
                                                        ${intl.formatMessage({ id: 'layer' })}: ${((historySP.data) as PackageShelf).layer}
                                                        ${intl.formatMessage({ id: 'column' })}: ${((historySP.data) as PackageShelf).column}`}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        )
                    }
                  </div>
                </div>
            </div>
            { showElementHistoryDialog && <ElementHistoryDialog close={()=>{closeElementHistoryDialog()}} title={intl.formatMessage({ id: 'item_history' })} historySP={historyElement} warehouses={warehouses} users={users} /> }
        </div>
    );
};
  
export default StoragePlanHistory;