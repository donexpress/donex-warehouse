import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import PackingListForm from '../../../../../src/app/components/wms/storagePlan/PackingListForm';
import { Loading } from '../../../../../src/app/components/common/Loading';
import { PackingListProps, StoragePlan } from '../../../../../src/types/storage_plan';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';

const ModifyPackingList = ({ id, inWMS = true }: PackingListProps) => {
  const [storagePlan, setStoragePlan] = useState<StoragePlan | null>(null)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setup()
  },[])

  const setup = async () => {
    setLoading(true);
    const sPlan = await getStoragePlanById(id);
    setStoragePlan(sPlan);
    setLoading(false);
  }
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <Loading loading={loading}>
          <PackingListForm storagePlan={storagePlan} loading={loading} id={id} isFromModifyPackingList={true} inWMS={inWMS} />
        </Loading>
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  //const storagePlan = await getStoragePlanById(id, context);

  return {
    props: {
        id,
    }
  }
}

export default ModifyPackingList;