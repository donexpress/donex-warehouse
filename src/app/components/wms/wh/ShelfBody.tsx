import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import '../../../../styles/wms/user.form.scss';
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl';
import { Shelf, ShelfConfigProps, ShelfConfig } from '../../../../types/shelf'
import { PackageShelf } from '../../../../types/package_shelf'
import { PackingList } from '../../../../types/storage_plan'
import { Response } from '../../../../types'
import { updateShelfById } from '../../../../services/api.shelf';
import { showMsg } from '../../../../helpers'
import { PDFDownloadLink } from '@react-pdf/renderer';
import LocationLabelsPDF from '../../common/LocationLabelsPDF';

const ShelfBody = ({ id, warehouse, shelf, warehouse_id }: ShelfConfigProps) => {
    const router = useRouter();
    const { locale } = router.query;
    const intl = useIntl();
    const [sendRequest, setSendRequest] = useState<boolean>(false);
    const [layers, setLayers] = useState<number>(shelf.layers);
    const [columns, setColumns] = useState<number>(shelf.column_ammount);
    const [shelfConfig, setShelfConfig] = useState<ShelfConfig>(shelf);
    const [packageByCell, setPackageByCell] = useState<string[][][]>([]);

    useEffect(() => {
        if (shelf) {
            console.log(shelf)
            let items: string[][][] = [];
            for (let i = 0; i < layers; i++) {
                items[i] = [];
                for (let j = 0; j < columns; j++) {
                    let elements: string[] = [''];
                    const shelfPackages: PackageShelf[] = shelf.packages.filter((ps: PackageShelf) => ((ps.layer === (i+1)) && (ps.column === (j+1))))
                    if (shelfPackages.length !== 0) {
                        elements = shelfPackages.map((ps: PackageShelf) => {return (ps.package as PackingList).case_number});
                    }
                    
                    items[i][j] = elements;
                }
            }
            setPackageByCell(items);
        }
      }, [shelf, columns, layers]);

    const cancelSend = () => {
        router.push(`/${locale}/wms/warehouses/${warehouse_id}/config`);
    };

    const formatBody = (layersValue: number, columnsValue: number): Shelf => {
        return {
            column_ammount: columnsValue,
            layers: layersValue,
            number_of_shelves: shelf.number_of_shelves,
            high_inventory: shelf.high_inventory,
            location_width: shelf.location_width,
            location_length: shelf.location_length,
            warehouse_id: shelf.warehouse_id,
            partition_table: shelf.partition_table
          };
    }
  
    const changeLayer = async(value: 1 | -1) => {
        if (!sendRequest && (value > 0 || (value < 0 && layers > 1))) {
            setSendRequest(true);
            const response: Response = await updateShelfById(id, formatBody(layers + value, columns));
            if (response.status >= 200 && response.status <= 299) {
                showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
                setLayers(layers + value);
                setShelfConfig({...shelfConfig, layers: layers + value});
                setSendRequest(false);
            } else {
                setSendRequest(false);
            }
        }
    };
  
    const changeColumn = async(value: 1 | -1) => {
        if (!sendRequest && (value > 0 || (value < 0 && columns > 1))) {
            setSendRequest(true);
            const response: Response = await updateShelfById(id, formatBody(layers, columns + value));
            if (response.status >= 200 && response.status <= 299) {
                showMsg(intl.formatMessage({ id: 'successfullyActionMsg' }), { type: "success" });
                setColumns(columns + value);
                setShelfConfig({...shelfConfig, column_ammount: columns + value});
                setSendRequest(false);
            } else {
                setSendRequest(false);
            }
        }
    };

    return (
        <div className='user-form-body shadow-small' style={{ paddingRight: '0px' }}>
            <div className='flex' style={{ paddingRight: '16px' }}>
              <h1 className="flex-1 text-xl font-semibold">
                {intl.formatMessage({ id: "shelf" })} { (warehouse && shelf) ? `(${warehouse.code}${String(shelf.partition_table).padStart(2, '0')}${String(shelf.number_of_shelves).padStart(2, '0')})` : '' }
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
                  <div className='w-full' style={{ paddingTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <Button
                      color="primary"
                      type="button"
                      className='px-4'
                      onClick={()=>changeLayer(1)}
                      isDisabled={sendRequest}
                    >
                      {intl.formatMessage({ id: 'add_layer' })}
                    </Button>
                    <Button
                      color="primary"
                      type="button"
                      className='px-4'
                      onClick={()=>changeColumn(1)}
                      isDisabled={sendRequest}
                    >
                      {intl.formatMessage({ id: 'add_column' })}
                    </Button>
                    <Button
                      color="primary"
                      type="button"
                      className='px-4'
                      onClick={()=>changeLayer(-1)}
                      isDisabled={sendRequest || (layers < 2)}
                    >
                      {intl.formatMessage({ id: 'remove_layer' })}
                    </Button>
                    <Button
                      color="primary"
                      type="button"
                      className='px-4'
                      onClick={()=>changeColumn(-1)}
                      isDisabled={sendRequest || (columns < 2)}
                    >
                      {intl.formatMessage({ id: 'remove_column' })}
                    </Button>
                    <Button
                      color="primary"
                      type="button"
                      className='px-4'
                      isDisabled={sendRequest}
                    >
                        <PDFDownloadLink document={<LocationLabelsPDF warehouse={warehouse} shelfs={[shelfConfig]} intl={intl} />} fileName="location_labels.pdf">
                          {({ blob, url, loading, error }) =>
                            intl.formatMessage({ id: "generate_location_tag" })
                          }
                        </PDFDownloadLink>
                    </Button>
                  </div>
                  <div className='w-full' style={{ padding: '16px 0 0' }}>
                    <div className='boxes-container'>
                        <div>
                            {
                                packageByCell.map((layer: string[][], layerIndex) => (
                                    <div key={layerIndex} style={{ paddingBottom: '10px' }} className='elements-row-start'>
                                    {
                                        layer.map((column: string[], columnIndex) => (
                                            <div key={columnIndex} style={{ marginRight: '10px', height: '250px', width: '250px', border: 'solid 1px #343b4f', borderRadius: '5px', background: '#070e24' }}>
                                                <div style={{ height: '30px',background: '#37446b', borderTopLeftRadius: '4px',borderTopRightRadius: '4px' }} className='elements-center'>
                                                    <span>{warehouse.code}{String(shelf.partition_table).padStart(2, '0')}{String(shelf.number_of_shelves).padStart(2, '0')}{String(layerIndex+1).padStart(2, '0')}{String(columnIndex+1).padStart(2, '0')}</span>
                                                </div>
                                                <div style={{ height: '220px', overflow: 'scroll', scrollbarWidth: 'thin', padding: '10px 10px 0' }}>
                                                    {
                                                        column.map((label: string, labelIndex) => (
                                                            <div key={labelIndex}>{ label }</div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    );
};
  
export default ShelfBody;