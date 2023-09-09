import { useIntl } from 'react-intl';
import '../../../../styles/wms/user.table.scss'
import { User } from '@/types/usererege1992';
interface Props {
    user: User
}
const Info = ({ user }: Props) => {
    const intl = useIntl();
    return (
        <div className='wrapper'>
            <div className="content_wrapper">
                <div className="table_header">
                    <div className="table_row">
                        <div className="table_title">{intl.formatMessage({ id: 'user_info' })}</div>
                    </div>
                    <div className="table_row">
                        <div className="data">
                            <div className="column">
                                <div className="element">
                                    <div className="key">ID: </div>
                                    <div className="value">{user.id}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'username' })}: </div>
                                    <div className="value">{user.username}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'nickname' })}: </div>
                                    <div className="value">{user.nickname}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'label_code' })}: </div>
                                    <div className="value">{user.label_code}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'contact' })}: </div>
                                    <div className="value">{user.contact}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'company' })}: </div>
                                    <div className="value">{user.company}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'email' })}: </div>
                                    <div className="value">{user.email}</div>
                                </div>
                            </div>
                        </div>
                        <div className="data">
                            <div className="column">
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'client_service_representative' })}: </div>
                                    <div className="value">{user.client_service_representatives?.chinesse_name}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'sales_representative' })}: </div>
                                    <div className="value">{user.sales_representatives?.chinesse_name}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'sales_source' })}: </div>
                                    <div className="value">{user.sales_sources?.chinesse_name}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'email' })}: </div>
                                    <div className="value">{user.email}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'phone' })}: </div>
                                    <div className="value">{user.phone}</div>
                                </div>
                                <div className="element">
                                    <div className="key">QQ: </div>
                                    <div className="value">{user.qq}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'credits' })}: </div>
                                    <div className="value">{user.credits}</div>
                                </div>
                            </div>
                        </div>
                        <div className="data">
                            <div className="column">
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'observations' })}: </div>
                                    <div className="value">{user.observations}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'state' })}: </div>
                                    <div className="value">{user.state}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'finantial_representative' })}: </div>
                                    <div className="value">{user.finantial_representatives?.chinesse_name}: </div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'subsidiary' })}: </div>
                                    <div className="value">{user.subsidiaries?.name}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'regional_division' })}: </div>
                                    <div className="value">{user.regional_divisions?.name}</div>
                                </div>
                                <div className="element">
                                    <div className="key">{intl.formatMessage({ id: 'warehouse' })}: </div>
                                    <div className="value">{user.warehouses?.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info