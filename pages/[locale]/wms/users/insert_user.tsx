import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import UserFormBody from '../../../../src/app/components/wms/UserFormBody';

const InsertUser = () => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <UserFormBody/>
      </Layout>
    </ProtectedRoute>
    );
};

export default InsertUser;