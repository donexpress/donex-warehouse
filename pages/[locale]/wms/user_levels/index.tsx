import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import UserLevelTable from "../../../../src/app/components/wms/userLevel/UserLevelTable";

const UserLevel = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <UserLevelTable/>
      </ProtectedRoute>
    </Layout>
  );
};

export default UserLevel;
