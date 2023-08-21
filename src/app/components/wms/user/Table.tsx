import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import '../../../../styles/wms/user.table.scss'
import { FaSearch, FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { FaCirclePlus, FaTrashCan } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { getUsers, removeUser } from '@/services/api.userserege1992';
import { User } from '@/types/usererege1992';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { UsersProps } from '../../../../types';
const UserTable = ({ userList, paymentMethodList, userStateList }: UsersProps) => {
    const intl = useIntl();
    const router = useRouter();
    const { locale } = router.query;
    const [users, setUsers] = useState<User[]>([])
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [deleteElement, setDeleteElemtent] = useState<number>(-1)

    useEffect(() => {
        setUsers(userList);
    }, [])

    const loadUsers = async () => {
        const users = await getUsers();
        setUsers(users);
    }

    const getPaymentMethodLabel = (paymentMethodId: number | null) => {
        if (paymentMethodId !== null && paymentMethodList.length > 0) {
            const filter = paymentMethodList.filter(paymentMethod => paymentMethod.id === paymentMethodId);
            if (filter.length > 0) {
                return filter[0].name;
            }
        }
        return paymentMethodId;
    }

    const getUserStateLabel = (userStateId: number | null) => {
        if (userStateId !== null && userStateList.length > 0) {
            const filter = userStateList.filter(userState => userState.id === userStateId);
            if (filter.length > 0) {
                return filter[0].name;
            }
        }
        return userStateId;
    }

    const handleDelete = (id: number) => {
        setShowConfirm(true)
        setDeleteElemtent(id)
    }

    const handleEdit = (id: number) => {
        router.push(`/${locale}/wms/users/${id}/update_user`)
    }

    const handleShow = (id: number) => {
        router.push(`/${locale}/wms/users/${id}/show_user`)
    }

    const close = () => {
        setShowConfirm(false)
        setDeleteElemtent(-1)
    }

    const confirm = async() => {
        const reponse = await removeUser(deleteElement)
        close()
        await loadUsers()
    }

    return (
        <div className='list-elements scrollable-hidden'>
            <div className="content_wrapper">
                <div className="table_header">
                    <div className="table_row">
                        <div className="table_title">Usuarios</div>
                    </div>
                    <div className="table_row table_menu" style={{ marginTop: '10px', justifyContent: 'space-between' }}>
                        <div className="search">
                            <input type="text" />
                            <button className='table_search_button'><FaSearch /></button>
                        </div>
                        <div className="table_actions">
                            <a href={`/${locale}/wms/users/insert_user`} className='accent_button' style={{display: 'flex', width: '120px', justifyContent: 'space-around', alignItems: 'center'}}>
                               <FaCirclePlus /> {intl.formatMessage({ id: 'create' })}
                            </a>
                        </div>

                    </div>
                </div>
                <div className="table_body">
                    <div className="table_body_header table_columns">
                        <span>{intl.formatMessage({ id: 'customer_number' })}</span>
                        <span>{intl.formatMessage({ id: 'username' })}</span>
                        <span>{intl.formatMessage({ id: 'contact' })}</span>
                        <span>{intl.formatMessage({ id: 'payment_method' })}</span>
                        <span>{intl.formatMessage({ id: 'state' })}</span>
                        <span>{intl.formatMessage({ id: 'actions' })}</span>
                    </div>
                    { users.map((el, index) => (
                        <div className={`${(index %2 === 0) ? '' : 'table_stripe'} table_columns`} key={index} style={{marginTop: '5px'}}>
                            <span className='table_data'>{el.customer_number}</span>
                            <span className='table_data'>{el.username}</span>
                            <span className='table_data'>{el.contact}</span>
                            <span className='table_data'>{getPaymentMethodLabel(el.payment_method_id)}</span>
                            <span className='table_data'>{getUserStateLabel(el.state_id)}</span>
                            <div className='table_data table_action_container'>
                                <button className='table_action_button' style={{color: '#ff7811'}} onClick={() => handleShow(el.id)}><FaEye /></button>
                                <button className='table_action_button' style={{color: '#ff7811'}} onClick={()=> handleEdit(el.id)}><FaPen /></button>
                                {/* <button className='table_action_button' style={{color: '#f3412f'}} onClick={() => handleDelete(el.id)}><FaTrashCan /></button> */}
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

export default UserTable