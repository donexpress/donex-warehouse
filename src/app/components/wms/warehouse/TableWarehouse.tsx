import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import '../../../../styles/wms/user.table.scss'
import { FaSearch, FaEye, FaPen } from 'react-icons/fa';
import { FaCirclePlus, FaTrashCan } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { getWarehouses, removeWarehouseById } from '../../../../services/api.warehouse';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { WarehouseListProps, CargoStationWarehouseForm } from '../../../../types';

const WarehouseTable = ({ warehouseList }: WarehouseListProps) => {
    const intl = useIntl();
    const router = useRouter();
    const { locale } = router.query;
    const [warehouses, setWarehouses] = useState<CargoStationWarehouseForm[]>([])
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [deleteElement, setDeleteElemtent] = useState<number>(-1)

    useEffect(() => {
        setWarehouses(warehouseList);
    }, [])

    const loadWarehouses = async () => {
        const whs = await getWarehouses();
        setWarehouses(whs ? whs : []);
    }

    const handleDelete = (id: number) => {
        setShowConfirm(true)
        setDeleteElemtent(id)
    }

    const handleEdit = (id: number) => {
        router.push(`/${locale}/wms/warehouse_cargo_station/${id}/update`)
    }

    const handleShow = (id: number) => {
        router.push(`/${locale}/wms/warehouse_cargo_station/${id}/show`)
    }

    const close = () => {
        setShowConfirm(false)
        setDeleteElemtent(-1)
    }

    const confirm = async() => {
        const reponse = await removeWarehouseById(deleteElement)
        close()
        await loadWarehouses()
    }

    return (
        <div className='wrapper'>
            <div className="content_wrapper">
                <div className="table_header">
                    <div className="table_row">
                        <div className="table_title">Terminales de carga</div>
                    </div>
                    <div className="table_row table_menu" style={{ marginTop: '10px', justifyContent: 'space-between' }}>
                        <div className="search">
                            <input type="text" />
                            <button className='table_search_button'><FaSearch /></button>
                        </div>
                        <div className="table_actions">
                            <a href={`/${locale}/wms/warehouse_cargo_station/insert`} className='accent_button' style={{display: 'flex', width: '120px', justifyContent: 'space-around', alignItems: 'center'}}>
                               <FaCirclePlus /> {intl.formatMessage({ id: 'create' })}
                            </a>
                        </div>

                    </div>
                </div>
                <div className="table_body">
                    <div className="table_body_header table_columns">
                        <span>{intl.formatMessage({ id: 'name' })}</span>
                        <span>{intl.formatMessage({ id: 'principal' })}</span>
                        <span>{intl.formatMessage({ id: 'receiving_area' })}</span>
                        <span>{intl.formatMessage({ id: 'state' })}</span>
                        <span>{intl.formatMessage({ id: 'country' })}</span>
                        <span>{intl.formatMessage({ id: 'actions' })}</span>
                    </div>
                    { warehouses.map((el, index) => (
                        <div className={`${(index %2 === 0) ? '' : 'table_stripe'} table_columns`} key={index} style={{marginTop: '5px'}}>
                            <span className='table_data'>{el.name}</span>
                            <span className='table_data'>{el.principal}</span>
                            <span className='table_data'>{el.receiving_area}</span>
                            <span className='table_data'>{el.state_id}</span>
                            <span className='table_data'>{el.country}</span>
                            <div className='table_data table_action_container'>
                                <button className='table_action_button' style={{color: '#ff7811'}} onClick={() => handleShow(Number(el.id))}><FaEye /></button>
                                <button className='table_action_button' style={{color: '#ff7811'}} onClick={()=> handleEdit(Number(el.id))}><FaPen /></button>
                                <button className='table_action_button' style={{color: '#f3412f'}} onClick={() => handleDelete(Number(el.id))}><FaTrashCan /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showConfirm && (
                <ConfirmationDialog close={close} confirm={confirm} />
            )}
        </div>
    )
}

export default WarehouseTable