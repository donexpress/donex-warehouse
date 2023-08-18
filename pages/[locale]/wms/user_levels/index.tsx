import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { UserLevelListProps } from '../../../../src/types/user_levels';
import { getUserLevels } from '../../../../src/services/api.user_level';
import { GetServerSidePropsContext } from 'next';
import UserLevelTable from '../../../../src/app/components/wms/userLevel/UserLevelTable';

const UserLevel = ({ userLevelList }: UserLevelListProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <UserLevelTable userLevelList={userLevelList ? userLevelList : []} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userLevelList = await getUserLevels(context);

  return {
    props: {
        userLevelList
    }
  }
}

export default UserLevel;