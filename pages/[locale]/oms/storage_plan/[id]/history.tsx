import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import StoragePlanHistory from '../../../../../src/app/components/wms/storagePlan/StoragePlanHistory';
import { HistoryStoragePlanProps } from '../../../../../src/types/storage_plan';
import { getUsers } from '../../../../../src/services/api.users';
import { getWhs } from '../../../../../src/services/api.wh';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';

const HistoryStoragePlan = ({ id, storagePlan, warehouses, users, inWMS = false }: HistoryStoragePlanProps) => {console.log(storagePlan)
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <StoragePlanHistory inWMS={ inWMS } storagePlan={storagePlan} id={id} warehouses={warehouses ? warehouses : []} users={users ? users : []} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const storagePlan = await getStoragePlanById(id, context);
  const users = await getUsers(context);
  const warehouses = await getWhs(context);

  return {
    props: {
        warehouses,
        users,
        storagePlan,
        id,
    }
  }
}

export default HistoryStoragePlan;