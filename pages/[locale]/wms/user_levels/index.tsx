import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import UserLevelTable from "../../../../src/app/components/wms/userLevel/UserLevelTable";

const UserLevel = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <UserLevelTable/>
      </ProtectedRoute>
    </Layout>
  );
};

export default UserLevel;
