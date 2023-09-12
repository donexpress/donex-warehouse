import Head from 'next/head';
import Layout from '../../../src/app/layout';
import ProtectedRoute from '../../../src/app/components/common/ProtectedRoute';
import DashboardCard from '@/app/components/wms/DashboardCarderege1992';
import { useEffect, useState } from 'react';
import { countUsers } from '@/services/api.userserege1992';
import { FaSackXmark, FaTruckFront, FaUser } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { countUserLevel } from '@/services/api.user_levelerege1992';
import { FaCreditCard, FaLandmark, FaServicestack, FaTruckLoading, FaUniversalAccess, FaUserTag, FaUserTie, FaWarehouse } from 'react-icons/fa';
import { countStaff } from '@/services/api.stafferege1992';
import { countPaymentMethod } from '@/services/api.payment_methoderege1992';
import { countRole } from '@/services/api.roleerege1992';
import { countOrganization } from '@/services/api.organizationerege1992';
import { countWarehouse } from '@/services/api.warehouseerege1992';
import { countService } from '@/services/api.serviceerege1992';
import { useIntl } from 'react-intl';
import { countExitPlans } from '@/services/api.exit_planerege1992';

const RootWMS = () => {
  const [user, setUser] = useState<number>(0)
  const [userLevel, setUserLevel] = useState<number>(0)
  const [staff, setStaff] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<number>(0)
  const [role, setRole] = useState<number>(0)
  const [organization, setOrganization] = useState<number>(0)
  const [warehouse, setWarehouse] = useState<number>(0)
  const [service, setService] = useState<number>(0)
  const [suppliers, setSuppliers] = useState<number>(0)
  const [line, setLine] = useState<number>(0)
  const [exitPLans, setExitPlans] = useState<number>(0)
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
  useEffect(() => {
    setup()
  },[])

  const setup = async () => {
    countUsers().then(user => setUser(user.count))
    countUserLevel().then(userLevel => setUserLevel(userLevel.count))
    countStaff().then(staff => setStaff(staff.count))
    countPaymentMethod().then(paymentMethod => setPaymentMethod(paymentMethod.count))
    countRole().then(role => setRole(role.count))
    countOrganization().then(organization => setOrganization(organization.count))
    countWarehouse().then(warehouse => setWarehouse(warehouse.count))
    countService().then(service => setService(service.count))
    countExitPlans().then(exitPLan => setExitPlans(exitPLan.count))
  }

  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <div className='card_section'>
          <DashboardCard ammount={user} text={intl.formatMessage({ id: 'users' })} Icon={FaUser} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={userLevel} text={intl.formatMessage({ id: 'user_levels' })} Icon={FaUserTag} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={staff} text={intl.formatMessage({ id: 'staff' })} Icon={FaUniversalAccess} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={paymentMethod} text={intl.formatMessage({ id: 'payment_methods' })} Icon={FaCreditCard} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={role} text={intl.formatMessage({ id: 'roles' })} Icon={FaUserTie} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={organization} text={intl.formatMessage({ id: 'departments' })} Icon={FaLandmark} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={warehouse} text={intl.formatMessage({ id: 'warehouses' })} Icon={FaWarehouse} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={service} text={intl.formatMessage({ id: 'services' })} Icon={FaServicestack} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={suppliers} text={intl.formatMessage({ id: 'suppliers' })} Icon={FaTruckFront} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={line} text={intl.formatMessage({ id: 'lineClassification' })} Icon={FaSackXmark} url={`/${locale}/wms/users`}/>
          <DashboardCard ammount={exitPLans} text={intl.formatMessage({ id: 'exitPlans' })} Icon={FaTruckLoading} url={`/${locale}/wms/exit_plan`}/>
        </div>
      </Layout>
    </ProtectedRoute>
    );
};

export default RootWMS;