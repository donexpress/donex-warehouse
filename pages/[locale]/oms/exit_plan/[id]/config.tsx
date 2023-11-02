import Head from "next/head";
import { useEffect, useState } from 'react';
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import { StoragePlanProps } from "../../../../../src/types/storage_plan";
import { getUsers } from "../../../../../src/services/api.users";
import { getWhs } from "../../../../../src/services/api.wh";
import { getStoragePlanById } from "../../../../../src/services/api.storage_plan";
import ExitPlanConfig from "../../../../../src/app/components/wms/exitPlan/ExiPlanConfig";
import { getExitPlanDestinationsAddresses, getExitPlansById } from "../../../../../src/services/api.exit_plan";
import { ExitPlan, ExitPlanProps } from "@/types/exit_planerege1992";
import { Loading } from '../../../../../src/app/components/common/Loading';

const Config = ({ id, users, warehouses,addresses }: ExitPlanProps) => {
  const [exitPlan, setExitPlan] = useState<ExitPlan | null>(null)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setup()
  },[])

  const setup = async () => {
    setLoading(true);
    const sPlan = await getExitPlansById(Number(id));
    setExitPlan(sPlan);
    setLoading(false);
  }
  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <Loading loading={loading}>
        <ExitPlanConfig
          id={id}
          exitPlan={exitPlan as ExitPlan}
          users={users}
          warehouses={warehouses}
          addresses={addresses}
          countries={[]}
        />
        </Loading>
      </Layout>
    </ProtectedRoute>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const users = await getUsers(context);
  const warehouses = await getWhs(context);
  //const exitPlan = await getExitPlansById(id)
  const addresses = await getExitPlanDestinationsAddresses(context)

  return {
    props: {
      warehouses,
      users,
      id,
      addresses
    },
  };
}

export default Config;
