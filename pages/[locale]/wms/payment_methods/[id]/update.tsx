import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import PaymentMethodFormBody from "../../../../../src/app/components/wms/paymentMethod/PaymentMethodFormBody";
import { getPaymentMethodById } from "../../../../../src/services/api.payment_method";
import { PaymentMethodProps } from "../../../../../src/types/payment_methods";

const UpdatePaymentMethod = ({ paymentMethod, id }: PaymentMethodProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <PaymentMethodFormBody paymentMethod={paymentMethod} id={id} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const paymentMethod = await getPaymentMethodById(id, context);

  return {
    props: {
      paymentMethod,
      id,
    },
  };
}

export default UpdatePaymentMethod;
