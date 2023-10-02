import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import Layout from "@/app/layouterege1992";
import Head from "next/head";
import StaffTable from "@/app/components/wms/staff/Tableerege1992";
import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { isWMS } from '../../../../src/helpers';
import { ProfileAdmin } from '../../../../src/types/profile';
import { StaffListProps } from '../../../../src/types/staff';
import { getStaffStates } from "../../../../src/services/api.staff";

const Index = ({ role, staffStates }: StaffListProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <StaffTable role={ role } staffStates={staffStates ? staffStates : []} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const staffStatesObj = await getStaffStates(context);
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
  
  // @ts-ignore
  const staffStates = staffStatesObj.states;
  return {
    props: {
      role,
      staffStates,
    }
  }
}
export default Index;
