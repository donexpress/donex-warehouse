import React from 'react';
import '../../../styles/wms/user.form.scss';
import { useIntl } from 'react-intl';

const RowStoragePlanHeader: React.FC = () => {
  const intl = useIntl();

  return (
    <div className='boxes-container__table' style={{ paddingBottom: '5px' }}>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'box_number' })} *</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'case_number' })}</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>{intl.formatMessage({ id: 'amount' })}</span>
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
    </div>
  );
};

export default RowStoragePlanHeader;