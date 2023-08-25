import React, { ChangeEvent } from 'react';
import GenericInput from './GenericInput';
import '../../../styles/wms/user.form.scss';
interface RowData {
    id: number;
    box_number: string;
    transfer_order_number: string;
    quantity: number;
    customer_weight: number;
    customer_length: number;
    customer_width: number;
    customer_height: number;
    product_name: string;
    english_product_name: string;
    declaration_unit_price: number;
    material: string;
    customs_code: string;
    fnscu: string;
}

interface RowStoragePlanProps {
  initialValues: RowData;
  onUpdate: (updatedValues: RowData) => void;
}

const RowStoragePlan: React.FC<RowStoragePlanProps> = ({ initialValues, onUpdate }) => {
  const handleRowChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onUpdate({
      ...initialValues,
      [name]: value,
    });
  };

  return (
    <div className='boxes-container__table'>
      <GenericInput
        type="text"
        name="box_number"
        value={initialValues.box_number}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="transfer_order_number"
        value={initialValues.transfer_order_number}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="quantity"
        value={initialValues.quantity}
        customClass="custom-input"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="customer_weight"
        value={initialValues.customer_weight}
        customClass="custom-input"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="customer_length"
        value={initialValues.customer_length}
        customClass="custom-input"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="customer_width"
        value={initialValues.customer_width}
        customClass="custom-input"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="customer_height"
        value={initialValues.customer_height}
        customClass="custom-input"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="product_name"
        value={initialValues.product_name}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="english_product_name"
        value={initialValues.english_product_name}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="declaration_unit_price"
        value={initialValues.declaration_unit_price}
        customClass="custom-input"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="material"
        value={initialValues.material}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="customs_code"
        value={initialValues.customs_code}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="fnscu"
        value={initialValues.fnscu}
        customClass="custom-input"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
    </div>
  );
};

export default RowStoragePlan;

