import React from 'react';
import '../../../styles/wms/user.form.scss';
import { useIntl } from 'react-intl';

interface RowStoragePlanHeaderProps {
  onlyReadly?: boolean;
  inWMS: boolean;
}
const RowStoragePlanHeader: React.FC<RowStoragePlanHeaderProps> = ({ onlyReadly = false, inWMS }) => {
  const intl = useIntl();

  return (
    <div className={!onlyReadly ? `${inWMS ? 'boxes-container__table': 'boxes-container__table-oms'} bg-default-100` :  `${inWMS ? 'boxes-container__table' : 'boxes-container__table-oms'} bg-default-100 ${inWMS ? 'boxes-container-table-only-readly' : 'boxes-container-table-only-readly-oms'}`} style={{ padding: '5px 0px 5px 0px', borderRadius: '5px 5px 0 0', marginRight: '16px' }}>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'box_number' })} {!onlyReadly ? '*' : ''}</span>
        </div>
      {
        onlyReadly && (
          <div className='elements-center'>
            <span className='text-center'>{intl.formatMessage({ id: 'expansion_box_number' })}</span>
          </div>
        )
      }
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'transfer_order_number' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'amount' })} {!onlyReadly ? '*' : ''}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'client_weight' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'client_length' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'client_width' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'client_height' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'product_name' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'english_product_name' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'price' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'material' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'customs_code' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'fnscu' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'client_image' })}</span>
        </div>
        {
          inWMS && (
            <div className='elements-center'>
              <span className='text-center'>{intl.formatMessage({ id: 'staff_image' })}</span>
            </div>
          )
        }
    </div>
  );
};

export default RowStoragePlanHeader;