import React, { useState, ChangeEvent } from 'react';
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

const WarehouseConfig = ({ warehouse, id }: WarehouseConfigProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();

    const cancelSend = () => {
        router.push(`/${locale}/wms/warehouses`);
    };

    const goToEdit = () => {
      router.push(`/${locale}/wms/warehouses/${id}/update`)
    };

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
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 5px', borderTopLeftRadius: '5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'warehouse_code' })}</span>
                                    </div>
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'warehouse_name' })}</span>
                                    </div>
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
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
                                    
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'number_of_partitions' })}</span>
                                    </div>
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'number_of_shelves' })}</span>
                                    </div>
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'total_volume' })}</span>
                                    </div>

                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 5px' }}>
                                        { warehouse.patition_amount }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { warehouse.shelfs ? warehouse.shelfs.length : 0 }
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 2px' }}>
                                        { '--' }
                                    </div>
                                    
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'used_volume' })}</span>
                                    </div>
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'state' })}</span>
                                    </div>
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 2px' }}>
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
                                    <div className='elements-center bg-default-100' style={{ padding: '7px 2px 7px 5px' }}>
                                      <span className='text-center'>{intl.formatMessage({ id: 'remark' })}</span>
                                    </div>
                                    <div className='storage-plan-header' style={{ padding: '5px 2px 5px 5px', borderBottomLeftRadius: '5px' }}>
                                        { warehouse.observations }
                                    </div>
                                </div>
                            </div>
                            <div className='storage-plan-header'>
                                <div className='elements-center bg-default-100' style={{ padding: '7px 0px 7px 2px', height: '32px', borderTopRightRadius: '5px' }}>
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
            </div>
        </div>
    );
};

export default WarehouseConfig;