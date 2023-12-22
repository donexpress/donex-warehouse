import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../../src/app/layout';
import ProtectedRoute from '../../../src/app/components/common/ProtectedRoute';
import { countExitPlans } from '@/services/api.exit_planerege1992';
import { storagePlanCount } from '@/services/api.storage_planerege1992';
import { FaTruckLoading, FaTruckMoving } from 'react-icons/fa';
import DashboardCard from '@/app/components/wms/DashboardCarderege1992';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

const RootOMS = () => {
  const [storagePlan, setStoragePlan] = useState<number>(0)
  const [exitPLans, setExitPlans] = useState<number>(0)
  const router = useRouter();
  const { locale } = router.query;
  const intl = useIntl();
 
  useEffect(() => {
    setup()
  },[])

  const setup = async () => {
    storagePlanCount().then(sPlan => {
      if (sPlan !== null) {
        setStoragePlan(sPlan.to_be_storage + sPlan.into_warehouse + sPlan.stocked + sPlan.cancelled);
      }
    })
    countExitPlans().then(ePLan => {
      if (ePLan !== null) {
        setExitPlans(ePLan.pending + ePLan.to_be_processed + ePLan.processing + ePLan.dispatched + ePLan.cancelled);
      }
    })
  }
  return (
  <ProtectedRoute>
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <div className='card_section'>
          <DashboardCard ammount={storagePlan} text={intl.formatMessage({ id: 'storage_plans' })} Icon={FaTruckLoading} url={`/${locale}/oms/storage_plan`}/>
          <DashboardCard ammount={exitPLans} text={intl.formatMessage({ id: 'exitPlans' })} Icon={FaTruckMoving} url={`/${locale}/oms/exit_plan`}/>
          <div></div>
          <div></div>
      </div>
    </Layout>
  </ProtectedRoute>
  );
};

export default RootOMS;
