import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import UserLevelFormBody from "../../../../../src/app/components/wms/userLevel/UserLevelFormBody";
import { indexServices } from "../../../../../src/services/api.services";
import { UserLevelProps } from "../../../../../src/types/user_levels";
import { getUserLevelById } from "../../../../../src/services/api.user_level";

const UpdateUserLevel = ({ services, userLevel, id }: UserLevelProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <UserLevelFormBody services={services} userLevel={userLevel} id={id} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const userLevel = await getUserLevelById(id, context);
  const services = await indexServices(context);

  return {
    props: {
      userLevel,
      id,
      services,
    },
  };
}

export default UpdateUserLevel;
