import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import Layout from "@/app/layouterege1992";
import Head from "next/head";
import AirGuideTable from "@/app/components/wms/air_guide/Tableerege1992";

const Index = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <AirGuideTable />
      </ProtectedRoute>
    </Layout>
  );
};
export default Index;
