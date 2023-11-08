import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import ExitPlanFormBody from "../../../../src/app/components/wms/exitPlan/ExitPlanFormBody";
import { indexCountries } from "../../../../src/services/api.countries";
import { getUsers } from "../../../../src/services/api.users";
import { getWhs } from "../../../../src/services/api.wh";
import { ExitPlanProps } from "../../../../src/types/exit_plan";
import { getExitPlanDestinations, getExitPlanDestinationsAddresses } from "@/services/api.exit_planerege1992";
import { getSelf } from "@/services/api.stafferege1992";

const InsertExitPlan = ({
  countries,
  users,
  warehouses,
  destinations,
  addresses,
  userOwner
}: ExitPlanProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <ExitPlanFormBody
          countries={countries}
          users={users}
          warehouses={warehouses}
          destinations={destinations}
          addresses={addresses}
          userOwner={userOwner}
        />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const users = await getUsers(context);
  const countries = await indexCountries(context);
  const warehouses = await getWhs(context);
  const destinations = await getExitPlanDestinations(context);
  const addresses = await getExitPlanDestinationsAddresses(context)
  const userOwner = await getSelf(context)
  return {
    props: {
      users,
      countries,
      warehouses,
      destinations,
      addresses,
      userOwner
    },
  };
}

export default InsertExitPlan;
