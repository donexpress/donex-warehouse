import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import PaymentMethodFormBody from "../../../../src/app/components/wms/paymentMethod/PaymentMethodFormBody";

const InsertPaymentMethod = () => {
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <PaymentMethodFormBody />
      </ProtectedRoute>
    </Layout>
  );
};

export default InsertPaymentMethod;
