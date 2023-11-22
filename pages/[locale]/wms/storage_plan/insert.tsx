import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import StoragePlanFormBody from '../../../../src/app/components/wms/storagePlan/StoragePlanFormBody';
import { StoragePlanProps } from '../../../../src/types/storage_plan';
import { getUsers } from '../../../../src/services/api.users';
import { getWhs } from '../../../../src/services/api.wh';
import { GetServerSidePropsContext } from 'next';

const InsertStoragePlan = ({ warehouses, users, inWMS = true }: StoragePlanProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>A2A56 Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <StoragePlanFormBody inWMS={inWMS} warehouses={warehouses ? warehouses : []} users={users ? users : []} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const users = await getUsers(context);
  const warehouses = await getWhs(context);

  return {
    props: {
        warehouses,
        users,
    }
  }
}

export default InsertStoragePlan;