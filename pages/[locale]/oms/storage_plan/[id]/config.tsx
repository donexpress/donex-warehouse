import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import StoragePlanConfig from '../../../../../src/app/components/wms/storagePlan/StoragePlanConfig';
import { StoragePlanConfigProps } from '../../../../../src/types/storage_plan';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';

const ConfigStoragePlan = ({ id, inWMS = false }: StoragePlanConfigProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>A2A56 Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <StoragePlanConfig id={id} inWMS={ inWMS } />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  //let storagePlan = await getStoragePlanById(id, context);

  return {
    props: {
        id,
    }
  }
}

export default ConfigStoragePlan;