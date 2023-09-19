import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import StoragePlanConfig from '../../../../../src/app/components/wms/storagePlan/StoragePlanConfig';
import { StoragePlanProps, History } from '../../../../../src/types/storage_plan';
import { getUsers } from '../../../../../src/services/api.users';
import { getWhs } from '../../../../../src/services/api.wh';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';
import { Warehouse } from '@/types/warehouseerege1992';

const ConfigStoragePlan = ({ warehouses, users, id, storagePlan }: StoragePlanProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <StoragePlanConfig warehouses={warehouses ? warehouses : []} users={users ? users : []} storagePlan={storagePlan} id={id} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  let storagePlan = await getStoragePlanById(id, context);
  if (storagePlan && storagePlan?.history) {
    storagePlan.history = [] as History[];
  }
  const users = await getUsers(context);
  const warehouses = [] as Warehouse[];

  return {
    props: {
        warehouses,
        users,
        storagePlan,
        id,
    }
  }
}

export default ConfigStoragePlan;