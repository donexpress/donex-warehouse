import React, { ChangeEvent } from 'react';
import GenericInput from './GenericInput';
import '../../../styles/wms/user.form.scss';
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
  meta?: any
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
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="case_number"
        value={initialValues.case_number}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="amount"
        value={initialValues.amount}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="client_weight"
        value={initialValues.client_weight}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="client_length"
        value={initialValues.client_length}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="client_width"
        value={initialValues.client_width}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="client_height"
        value={initialValues.client_height}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="product_name"
        value={initialValues.product_name}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="english_product_name"
        value={initialValues.english_product_name}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="number"
        name="price"
        value={initialValues.price}
        customClass="custom-input input-table"
        hideErrorContent={true}
        minValue={1}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="material"
        value={initialValues.material}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="customs_code"
        value={initialValues.customs_code}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
      <GenericInput
        type="text"
        name="fnscu"
        value={initialValues.fnscu}
        customClass="custom-input input-table"
        hideErrorContent={true}
        onChangeFunction={handleRowChange}
      />
    </div>
  );
};

export default RowStoragePlan;

