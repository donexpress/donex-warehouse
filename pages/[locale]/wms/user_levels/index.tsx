import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { UserLevelListProps } from '../../../../src/types/user_levels';
import { getUserLevels } from '../../../../src/services/api.user_level';
import { GetServerSidePropsContext } from 'next';
import UserLevelTable from '../../../../src/app/components/wms/userLevel/UserLevelTable';
import { indexServices } from '../../../../src/services/api.services';

const UserLevel = ({ userLevelList, servicesList }: UserLevelListProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <UserLevelTable userLevelList={userLevelList ? userLevelList : []} servicesList={servicesList} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userLevelList = await getUserLevels(context);
  const servicesList = await indexServices(context);

  return {
    props: {
        userLevelList,
        servicesList
    }
  }
}

export default UserLevel;