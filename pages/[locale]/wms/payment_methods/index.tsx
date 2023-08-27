import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import PaymentMethodTable from "../../../../src/app/components/wms/paymentMethod/PaymentMethodTable";

const PaymentMethod = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <PaymentMethodTable/>
      </ProtectedRoute>
    </Layout>
  );
};

export default PaymentMethod;
