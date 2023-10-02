import TableStoragePlan from "../../../../src/app/components/wms/storagePlan/TableStoragePlan";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import Layout from "../../../../src/app/layout";
import Head from "next/head";
import { getStoragePlansState, storagePlanCount } from '../../../../src/services/api.storage_plan';
import { GetServerSidePropsContext } from 'next';
import { StoragePlanListProps } from '../../../../src/types/storage_plan'

const StoragePlanIndex = ({ storagePlanStates, storagePCount, inWMS = false }: StoragePlanListProps) => {console.log(storagePlanStates)
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableStoragePlan storagePlanStates={storagePlanStates ? storagePlanStates : []} storagePCount={storagePCount} inWMS={inWMS} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const storagePlanStates = await getStoragePlansState(context);
  const storagePCount = await storagePlanCount(context);

  return {
    props: {
      storagePlanStates: storagePlanStates ? storagePlanStates.states : [],
      storagePCount
    }
  }
}

export default StoragePlanIndex;
