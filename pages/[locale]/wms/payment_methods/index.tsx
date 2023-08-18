import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { PaymentMethodListProps } from '../../../../src/types/payment_methods';
import { getPaymentMethods } from '../../../../src/services/api.payment_method';
import { GetServerSidePropsContext } from 'next';
import PaymentMethodTable from '../../../../src/app/components/wms/paymentMethod/PaymentMethodTable';

const PaymentMethod = ({ paymentMethodList }: PaymentMethodListProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <PaymentMethodTable paymentMethodList={paymentMethodList ? paymentMethodList : []} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const paymentMethodList = await getPaymentMethods(context);

  return {
    props: {
        paymentMethodList
    }
  }
}

export default PaymentMethod;