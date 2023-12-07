import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import WhTable from '../../../../src/app/components/wms/wh/TableWh';

const WarehouseIndex = () => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>A2A56 Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <WhTable />
      </Layout>
    </ProtectedRoute>
    );
};

export default WarehouseIndex;