import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import WhTable from '../../../../src/app/components/wms/wh/TableWh';

const WarehouseIndex = () => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <WhTable />
      </Layout>
    </ProtectedRoute>
    );
};

export default WarehouseIndex;