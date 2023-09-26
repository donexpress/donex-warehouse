import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import { getExitPlanDestinations, getExitPlansById } from "../../../../../src/services/api.exit_plan";
import ExitPlanFormBody from "../../../../../src/app/components/wms/exitPlan/ExitPlanFormBody";
import { ExitPlanProps } from "../../../../../src/types/exit_plan";
import { indexCountries } from "../../../../../src/services/api.countries";
import { getUsers } from "../../../../../src/services/api.users";
import { getWhs } from "../../../../../src/services/api.wh";

const UpdateExitPlan = ({ exitPlan, id, countries, users, warehouses, destinations }: ExitPlanProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <ExitPlanFormBody exitPlan={exitPlan} id={id} isFromDetails={false} countries={countries} users={users} warehouses={warehouses} destinations={destinations} />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const exitPlan = await getExitPlansById(id, context);
  const users = await getUsers(context);
  const countries = await indexCountries(context);
  const warehouses = await getWhs(context);
  const destinations = await getExitPlanDestinations(context)
  return {
    props: {
      exitPlan,
      id,
      users,
      countries,
      warehouses,
      destinations
    },
  };
}

export default UpdateExitPlan;
