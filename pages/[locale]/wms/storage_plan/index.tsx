import TableStoragePlan from "../../../../src/app/components/wms/storagePlan/TableStoragePlan";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import Layout from "../../../../src/app/layout";
import Head from "next/head";

const StoragePlanIndex = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableStoragePlan />
      </ProtectedRoute>
    </Layout>
  );
};

export default StoragePlanIndex;
