import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import GenericInput from './GenericInput';
import ImageUploader from './ImageUploader';
import '../../../styles/wms/user.form.scss';
import { useIntl } from 'react-intl';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

interface RowData {
  id?: number,
  box_number: string,
  case_number: string,
  client_weight: number,
  client_length: number,
  client_width: number,
  client_height: number,
  product_sku?: any,
  amount: number,
  product_name: string,
  english_product_name: string,
  price: number,
  material: string,
  customs_code: string,
  fnscu: string,
  custome_picture?: string,
  operator_picture?: string,
  storage_plan_id?: number,
  order_transfer_number?: string,
}

interface RowStoragePlanProps {
  initialValues: RowData;
  onUpdate: (updatedValues: RowData) => void;
  onlyReadly?: boolean;
  inWMS: boolean;
  prefixBoxNumber?: string;
  rejectedBoxes?: boolean;
}

const RowStoragePlan: React.FC<RowStoragePlanProps> = ({ initialValues, onUpdate, onlyReadly = false, inWMS, prefixBoxNumber = '', rejectedBoxes = false }) => {
  const intl = useIntl();
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageToShow, setImageToShow] = useState<string>('');
  const lightboxRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [isLoadImage, setIsLoadImage] = useState(false);

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

  const handleRowChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if ((name !== 'box_number') || (name === 'box_number' && value.startsWith(prefixBoxNumber + (rejectedBoxes ? 'UR' : 'U'))))
    onUpdate({
      ...initialValues,
      [name]: changeNumberValue(name, value),
    });
  };

  const changeNumberValue = (name: string, value: any) => {
    switch(name) {
      case 'amount': return (value && !isNaN(value) && Number(value) >= 0) ? Number(value) : 0;
      case 'client_weight': return (value && !isNaN(value) && Number(value) >= 0) ? Number(value) : 0;
      case 'client_length': return (value && !isNaN(value) && Number(value) >= 0) ? Number(value) : 0;
      case 'client_width': return (value && !isNaN(value) && Number(value) >= 0) ? Number(value) : 0;
      case 'client_height': return (value && !isNaN(value) && Number(value) >= 0) ? Number(value) : 0;
      case 'price': return (value && !isNaN(value) && Number(value) >= 0) ? Number(value) : 0;
    }
    return value;
  };

  const closeImageZoom = () => {
    setZoomed(false);
    setShowImage(false);
    setIsLoadImage(false);
  }

  const handleImageLoad = () => {
    setIsLoadImage(true);
  };

  const uploadImageClient = (imagePath: string) => {
    
    onUpdate({
      ...initialValues,
      ['custome_picture']: imagePath,
    });
  }

  const uploadImageStaff = (imagePath: string) => {
    
    onUpdate({
      ...initialValues,
      ['operator_picture']: imagePath,
    });
  }

  const zoomImage = async (image: string) => {
    await setImageToShow(image);
    await setShowImage(true);
  }

  return (
    <div className={!onlyReadly ? `${inWMS ? 'boxes-container__table' : 'boxes-container__table-oms'}` :  `${inWMS ? 'boxes-container__table boxes-container-table-only-readly' : 'boxes-container__table-oms boxes-container-table-only-readly-oms'}`}>
      <GenericInput
        type="text"
        name="box_number"
        value={initialValues.box_number}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      {
        onlyReadly && (
          <GenericInput
            type="text"
            name="case_number"
            value={initialValues.case_number}
            customClass="custom-input input-table"
            hideErrorContent={true}
            onChangeFunction={handleRowChange}
            disabled={onlyReadly}
          />
        )
      }
      {/* <GenericInput
        type="text"
        name="order_transfer_number"
        value={initialValues.order_transfer_number}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      /> */}
      <GenericInput
        type="number"
        name="amount"
        value={initialValues.amount}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={0}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="number"
        name="client_weight"
        value={initialValues.client_weight}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={0}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="number"
        name="client_length"
        value={initialValues.client_length}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={0}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="number"
        name="client_width"
        value={initialValues.client_width}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={0}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="number"
        name="client_height"
        value={initialValues.client_height}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={0}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="text"
        name="product_name"
        value={initialValues.product_name}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="text"
        name="english_product_name"
        value={initialValues.english_product_name}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="number"
        name="price"
        value={initialValues.price}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={0}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="text"
        name="material"
        value={initialValues.material}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="text"
        name="customs_code"
        value={initialValues.customs_code}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <GenericInput
        type="text"
        name="fnscu"
        value={initialValues.fnscu}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
        disabled={onlyReadly}
      />
      <div className='upload-filed-container'>
        <div className='elements-row-center'>
          {
            initialValues.custome_picture && (initialValues.custome_picture !== '') &&
            <div onClick={() => zoomImage(String(initialValues.custome_picture))} className='upload_button' style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'View' })}</div>
          }
          {
            !onlyReadly &&
            <ImageUploader onImageUpload={uploadImageClient}>
              <div className='upload_button'>{intl.formatMessage({ id: (initialValues.custome_picture && (initialValues.custome_picture !== '')) ? 'modify' : 'upload' })}</div>
            </ImageUploader>
          }
        </div>
      </div>
      {
        inWMS && (
          <div className='upload-filed-container'>
            <div className='elements-row-center'>
              {
                initialValues.operator_picture && (initialValues.operator_picture !== '') &&
                <div onClick={() => zoomImage(String(initialValues.operator_picture))} className='upload_button' style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'View' })}</div>
              }
              {
                !onlyReadly &&
                <ImageUploader onImageUpload={uploadImageStaff}>
                  <div className='upload_button'>{intl.formatMessage({ id: (initialValues.operator_picture && (initialValues.operator_picture !== '')) ? 'modify' : 'upload' })}</div>
                </ImageUploader>
              }
            </div>
          </div>
        )
      }
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

export default RowStoragePlan;

