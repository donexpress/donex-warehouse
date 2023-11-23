import { useRef, useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { History as HistorySP, StoragePlan, PackingList } from "../../../types/storage_plan";
import { User } from '../../../types/user';
import { Warehouse } from '../../../types/warehouse';
import { PackageShelf } from '../../../types/package_shelf';
import '../../../styles/generic.dialog.scss';
import '../../../styles/wms/user.form.scss';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

interface Params {
  close: () => any;
  title: string;
  historySP: HistorySP | null;
  users: User[];
  warehouses: Warehouse[];
}

const PackingListDialog = ({ close, historySP, title, users, warehouses }: Params) => {
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageToShow, setImageToShow] = useState<string>('');
  const lightboxRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [isLoadImage, setIsLoadImage] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (showImage && lightboxRef.current && !zoomed && isLoadImage) {
      setTimeout(()=>{
        // @ts-ignore
        lightboxRef.current.setState({
          zoomLevel: 1.1, // Ajusta el nivel de zoom según lo necesario
        });
      }, 100)
      setZoomed(true);
    }
  }, [showImage, zoomed, isLoadImage]);

  const closeImageZoom = () => {
    setZoomed(false);
    setShowImage(false);
    setIsLoadImage(false);
  }

  const handleImageLoad = () => {
    setIsLoadImage(true);
  };

  const zoomImage = async (image: string) => {
    await setImageToShow(image);
    await setShowImage(true);
  }

  const getUserLabel = (userId: number): string | number => {
    const response: User[] = users.filter((user) => user.id === userId);
    if (response && response.length > 0) {
      return response[0].customer_number + ' - ' +  response[0].username;
    }
    return userId;
  };

  const getWarehouseLabel = (warehouseId: number): string | number => {
    const response: Warehouse[] = warehouses.filter((warehouse) => warehouse.id === warehouseId);
    if (response && response.length > 0) {
      return response[0].name + ` (${response[0].code})`;
    }
    return warehouseId;
  };

  return (
    <div className="confirmation_container">
      <div className="confirmation_backdrop" onClick={close}></div>
      <div className="confirmation_card dialog-background">
        <div className="confirmation_card_header" style={{ color: 'white' }}>
          <strong>{ title }</strong>
        </div>
        <div className="flex justify-center my-4 elements-center">
            {
              historySP !== null && (
                <div style={{ width: '400px', maxWidth: '85vw' }}>
                  <div>
                    <div style={{ marginBottom: '15px', color: 'white' }}>
                      <b>{intl.formatMessage({ id: "type" })}:</b>&nbsp;&nbsp;
                      {historySP.type === 'packing_list' ? intl.formatMessage({ id: "packing_list_item" }) : ''}
                      {historySP.type === 'storage_plan' ? intl.formatMessage({ id: "storagePlan" }) : ''}
                      {historySP.type === 'shelf_package' ? intl.formatMessage({ id: "package_location_on_shelf" }) : ''}
                    </div>
                    {historySP.type === 'shelf_package' &&
                      <div className='w-full'>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "box_number" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.box_number : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "expansion_box_number" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.case_number : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "location" })}:</div>
                          <div>
                          {`${intl.formatMessage({ id: 'partition' })}: ${((historySP.data) as PackageShelf).shelf ? ((historySP.data) as PackageShelf).shelf?.partition_table : ''}
                                                        ${intl.formatMessage({ id: 'shelf' })}: ${((historySP.data) as PackageShelf).shelf ? ((historySP.data) as PackageShelf).shelf?.number_of_shelves : ''}
                                                        ${intl.formatMessage({ id: 'layer' })}: ${((historySP.data) as PackageShelf).layer}
                                                        ${intl.formatMessage({ id: 'column' })}: ${((historySP.data) as PackageShelf).column}`}
                          </div>
                        </div>
                        {/* <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "transfer_order_number" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.order_transfer_number : '' }
                          </div>
                        </div> */}
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "amount" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.amount : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_weight" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.client_weight : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_length" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.client_length : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_width" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.client_width : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_height" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.client_height : '' }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "price" })}:</div>
                          <div>
                            { ((historySP.data) as PackageShelf).package ? ((historySP.data) as PackageShelf).package?.price : '' }
                          </div>
                        </div>
                      </div>
                    }
                    {historySP.type === 'packing_list' &&
                      <div className='w-full'>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "box_number" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).box_number }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "expansion_box_number" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).case_number }
                          </div>
                        </div>
                        {/* <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "transfer_order_number" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).order_transfer_number }
                          </div>
                        </div> */}
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "amount" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).amount }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_weight" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).client_weight }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_length" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).client_length }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_width" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).client_width }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_height" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).client_height }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "price" })}:</div>
                          <div>
                            { ((historySP.data) as PackingList).price }
                          </div>
                        </div>
                        {
                          (((historySP.data) as PackingList).custome_picture && ((historySP.data) as PackingList).custome_picture !== '') &&
                          <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                            <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_image" })}:</div>
                            <div>
                              <div onClick={() => zoomImage(String(((historySP.data) as PackingList).custome_picture))} className='upload_button' style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'View' })}</div>
                            </div>
                          </div>
                        }
                        {
                          (((historySP.data) as PackingList).operator_picture && ((historySP.data) as PackingList).operator_picture !== '') &&
                          <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                            <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "staff_image" })}:</div>
                            <div>
                              <div onClick={() => zoomImage(String(((historySP.data) as PackingList).operator_picture))} className='upload_button' style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'View' })}</div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                    {historySP.type === 'storage_plan' &&
                      <div className='w-full'>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "customer_order_number" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).customer_order_number }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "warehouse_order_number" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).order_number }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "user" })}:</div>
                          <div>
                            { getUserLabel(Number(((historySP.data) as StoragePlan).user_id)) }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "storage" })}:</div>
                          <div>
                            { getWarehouseLabel(Number(((historySP.data) as StoragePlan).warehouse_id)) }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "number_of_boxes" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).box_amount }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "country" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).country }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "reference_number" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).reference_number }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "pr_number" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).pr_number }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_weight" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).weight }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "client_volume" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).volume }
                          </div>
                        </div>
                        <div className='w-full' style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns:'1fr 1fr' }}>
                          <div style={{ color: 'white', fontWeight: '600' }}>{intl.formatMessage({ id: "observations" })}:</div>
                          <div>
                            { ((historySP.data) as StoragePlan).observations }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              )
            }
        </div>
        <div className="elements-row-end">
          <Button onClick={close} type="button" className="bg-secundary px-4">
            {intl.formatMessage({ id: "cancel" })}
          </Button>
        </div>
      </div>
      {showImage && (
        <Lightbox
          mainSrc={imageToShow}
          onCloseRequest={() => closeImageZoom()}
          ref={lightboxRef}
          onImageLoad={() => { handleImageLoad() }}
        />
      )}
    </div>
  );
};

export default PackingListDialog;