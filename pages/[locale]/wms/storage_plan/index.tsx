import TableStoragePlan from "../../../../src/app/components/wms/storagePlan/TableStoragePlan";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import Layout from "../../../../src/app/layout";
import Head from "next/head";
import { getStoragePlansState } from '../../../../src/services/api.storage_plan';
import { GetServerSidePropsContext } from 'next';
import { StoragePlanListProps } from '../../../../src/types/storage_plan'

const StoragePlanIndex = ({ storagePlanStates }: StoragePlanListProps) => {console.log(storagePlanStates)
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableStoragePlan storagePlanStates={storagePlanStates ? storagePlanStates : []} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const storagePlanStates = await getStoragePlansState(context);

  return {
    props: {
      storagePlanStates: storagePlanStates ? storagePlanStates.states : [],
    }
  }
}

export default StoragePlanIndex;
