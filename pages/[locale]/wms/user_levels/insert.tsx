import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import UserLevelFormBody from "../../../../src/app/components/wms/userLevel/UserLevelFormBody";
import { indexServices } from "../../../../src/services/api.services";
import { GetServerSidePropsContext } from "next";
import { UserLevelProps } from "../../../../src/types/user_levels";

const InsertUserLevel = ({ services }: UserLevelProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <UserLevelFormBody services={services} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const services = await indexServices(context);

  return {
    props: {
      services,
    },
  };
}

export default InsertUserLevel;
