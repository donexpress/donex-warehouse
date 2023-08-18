import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import UserLevelFormBody from '../../../../src/app/components/wms/userLevel/UserLevelFormBody';
import { indexServices } from '../../../../src/services/api.services';
import { GetServerSidePropsContext } from 'next';
import { UserLevelProps } from '../../../../src/types/user_levels';

const InsertUserLevel = ({ services }: UserLevelProps) => {
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <UserLevelFormBody services={services} />
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

export default InsertUserLevel;