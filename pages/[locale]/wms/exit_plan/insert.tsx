import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import ExitPlanFormBody from "../../../../src/app/components/wms/exitPlan/ExitPlanFormBody";
import { indexCountries } from "../../../../src/services/api.countries";
import { getUsers } from "../../../../src/services/api.users";
import { getWhs } from "../../../../src/services/api.wh";
import { ExitPlanProps } from "../../../../src/types/exit_plan";

const InsertExitPlan = ({ countries, users, warehouses }: ExitPlanProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <ExitPlanFormBody countries={countries} users={users} warehouses={warehouses}/>
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const users = await getUsers(context);
    const countries = await indexCountries(context);
    const warehouses = await getWhs(context);
    return {
      props: {
        users,
        countries,
        warehouses,
      },
    };
  }

export default InsertExitPlan;