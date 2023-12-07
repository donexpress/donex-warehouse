import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import ExitPlanTable from "@/app/components/wms/exitPlan/ExitPlanTableerege1992";
import Layout from "@/app/layouterege1992";
import Head from "next/head";

const Index = () => {
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <ExitPlanTable />
      </ProtectedRoute>
    </Layout>
  );
};

export default Index;
