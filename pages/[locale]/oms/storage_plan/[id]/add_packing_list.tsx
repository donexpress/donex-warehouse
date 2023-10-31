import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import PackingListForm from '../../../../../src/app/components/wms/storagePlan/PackingListForm';
import { PackingListProps, StoragePlan } from '../../../../../src/types/storage_plan';
import { getStoragePlanById } from '../../../../../src/services/api.storage_plan';
import { Loading } from '../../../../../src/app/components/common/Loading';

const AddPackingList = ({ id, inWMS = false }: PackingListProps) => {
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
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <Loading loading={loading}>
          <PackingListForm storagePlan={storagePlan} loading={loading} id={id} isFromAddPackingList={true} inWMS={inWMS} />
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

export default AddPackingList;