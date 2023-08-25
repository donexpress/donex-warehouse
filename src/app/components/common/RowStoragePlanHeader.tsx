import React from 'react';
import '../../../styles/wms/user.form.scss';

const RowStoragePlanHeader: React.FC = () => {

  return (
    <div className='boxes-container__table' style={{ paddingBottom: '5px' }}>
        <div className='elements-center'>
          <span className='text-center'>Número de caja</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Número de orden</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Cantidad</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Peso del cliente</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Longitud del cliente</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Ancho del cliente</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Altura del cliente</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Nombre del producto</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Nombre del producto (inglés)</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Declaración precio unitario</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Material</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>Código aduanero</span>
        </div>
        <div className='elements-center'>
          <span className='text-center'>FNSCU</span>
        </div>
    </div>
  );
};

export default RowStoragePlanHeader;