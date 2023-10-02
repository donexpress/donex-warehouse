import UserTable from "@/app/components/wms/user/Tableerege1992";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import Layout from "../../../../src/app/layout";
import Head from "next/head";
import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { isWMS } from '../../../../src/helpers';
import { ProfileAdmin } from '../../../../src/types/profile';
import { UserListProps } from '../../../../src/types/user';
import {
  getUserStates,
} from "../../../../src/services/api.users";

const Index = ({ role, userStateList }: UserListProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <UserTable role={role} userStateList={userStateList} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const inWMS = isWMS(context);
  let role = '';
  if (inWMS) {
    const { req } = context;
    const cookies = parse(req.headers.cookie || '');
    const profileWMS = cookies.profileWMS || '';
    if (profileWMS !== '') {
      const profile: ProfileAdmin = JSON.parse(profileWMS);
      role = (profile && profile.role && profile.role.type) ? profile.role.type : role;
    }
  }
  const userStateListObj = await getUserStates(context);

  // @ts-ignore
  const userStateList = (userStateListObj && (userStateListObj !== null)) ? userStateListObj.states : [];
  
  return {
    props: {
      role,
      userStateList,
    }
  }
}

export default Index;
