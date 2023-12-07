import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import PaymentMethodTable from "../../../../src/app/components/wms/paymentMethod/PaymentMethodTable";

const PaymentMethod = () => {
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <PaymentMethodTable/>
      </ProtectedRoute>
    </Layout>
  );
};

export default PaymentMethod;
