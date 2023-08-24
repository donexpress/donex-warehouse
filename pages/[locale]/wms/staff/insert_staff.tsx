import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { indexServices } from '../../../../src/services/api.services';
import { GetServerSidePropsContext } from 'next';
import { StaffFormProps } from '@/typeserege1992';
import StaffFormBody from '@/app/components/wms/staff/StaffFormBodyerege1992';

const InsertStaff = ({ }: StaffFormProps) => {
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <StaffFormBody/>
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const services = await indexServices(context);

  return {
    props: {
      services
    }
  }
}

export default InsertStaff;