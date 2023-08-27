import UserTable from "@/app/components/wms/user/Tableerege1992";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import Layout from "../../../../src/app/layout";
import Head from "next/head";

const Index = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <UserTable />
      </ProtectedRoute>
    </Layout>
  );
};

export default Index;
