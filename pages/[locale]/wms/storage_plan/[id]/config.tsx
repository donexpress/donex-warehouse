import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import StoragePlanConfig from '../../../../../src/app/components/wms/storagePlan/StoragePlanConfig';
import { StoragePlanConfigProps } from '../../../../../src/types/storage_plan';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';

const ConfigStoragePlan = ({ id, storagePlan }: StoragePlanConfigProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <StoragePlanConfig storagePlan={storagePlan} id={id} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  let storagePlan = await getStoragePlanById(id, context);

  return {
    props: {
        storagePlan,
        id,
    }
  }
}

export default ConfigStoragePlan;