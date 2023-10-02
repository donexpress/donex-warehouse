import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import PackingListForm from '../../../../../src/app/components/wms/storagePlan/PackingListForm';
import { PackingListProps } from '../../../../../src/types/storage_plan';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';

const AddPackingList = ({ id, storagePlan, inWMS = false }: PackingListProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <PackingListForm storagePlan={storagePlan} id={id} isFromAddPackingList={true} inWMS={inWMS} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const storagePlan = await getStoragePlanById(id, context);

  return {
    props: {
        storagePlan,
        id,
    }
  }
}

export default AddPackingList;