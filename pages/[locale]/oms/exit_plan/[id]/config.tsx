import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import { StoragePlanProps } from "../../../../../src/types/storage_plan";
import { getUsers } from "../../../../../src/services/api.users";
import { getWhs } from "../../../../../src/services/api.wh";
import { getStoragePlanById } from "../../../../../src/services/api.storage_plan";
import ExitPlanConfig from "../../../../../src/app/components/wms/exitPlan/ExiPlanConfig";
import { getExitPlanDestinationsAddresses, getExitPlansById } from "../../../../../src/services/api.exit_plan";
import { ExitPlan, ExitPlanProps } from "@/types/exit_planerege1992";

const Config = ({ id, exitPlan, users, warehouses,addresses }: ExitPlanProps) => {
  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <ExitPlanConfig
          id={id}
          exitPlan={exitPlan}
          users={users}
          warehouses={warehouses}
          addresses={addresses}
          countries={[]}
        />
      </Layout>
    </ProtectedRoute>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const storagePlan = await getStoragePlanById(id, context);
  const users = await getUsers(context);
  const warehouses = await getWhs(context);
  const exitPlan = await getExitPlansById(id)
  const addresses = await getExitPlanDestinationsAddresses(context)

  return {
    props: {
      warehouses,
      users,
      storagePlan,
      exitPlan,
      id,
      addresses
    },
  };
}

export default Config;
