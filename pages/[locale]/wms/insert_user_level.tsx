import Head from 'next/head';
import Layout from '../../../src/app/layout';
import ProtectedRoute from '../../../src/app/components/common/ProtectedRoute';
import UserLevelFormBody from '../../../src/app/components/wms/UserLevelFormBody';

const InsertUserLevel = () => {
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <UserLevelFormBody />
      </Layout>
    </ProtectedRoute>
    );
};

export default InsertUserLevel;