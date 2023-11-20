import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import ExitPlanTable from "../../../../src/app/components/wms/exitPlan/ExitPlanTable";

const ExitPlan = () => {
    return (
        <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <ExitPlanTable/>
      </ProtectedRoute>
    </Layout>
    )
}

export default ExitPlan