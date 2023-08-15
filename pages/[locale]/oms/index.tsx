import Head from 'next/head';
import Layout from '../../../src/app/layout';
import ProtectedRoute from '../../../src/app/components/common/ProtectedRoute';

const RootOMS = () => {
  
  return (
  <ProtectedRoute>
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <div>
      </div>
    </Layout>
  </ProtectedRoute>
  );
};

export default RootOMS;
