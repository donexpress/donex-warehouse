import Head from "next/head";
import { useEffect, useState } from 'react';
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import {
  getExitPlanDestinations,
  getExitPlanDestinationsAddresses,
  getExitPlansById,
} from "../../../../../src/services/api.exit_plan";
import ExitPlanFormBody from "../../../../../src/app/components/wms/exitPlan/ExitPlanFormBody";
import { ExitPlanProps, ExitPlan } from "../../../../../src/types/exit_plan";
import { indexCountries } from "../../../../../src/services/api.countries";
import { getUsers } from "../../../../../src/services/api.users";
import { getWhs } from "../../../../../src/services/api.wh";
import { Loading } from '../../../../../src/app/components/common/Loading';

const UpdateExitPlan = ({
  id,
  countries,
  users,
  warehouses,
  destinations,
  addresses
}: ExitPlanProps) => {
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
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <Loading loading={loading}>
        <ExitPlanFormBody
          exitPlan={exitPlan as ExitPlan}
          id={id}
          isFromDetails={false}
          countries={countries}
          users={users}
          warehouses={warehouses}
          destinations={destinations}
          addresses={addresses}
        />
        </Loading>
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  //const exitPlan = await getExitPlansById(id, context);
  const users = await getUsers(context);
  const countries = await indexCountries(context);
  const warehouses = await getWhs(context);
  const destinations = await getExitPlanDestinations(context);
  const addresses = await getExitPlanDestinationsAddresses(context)
  return {
    props: {
      id,
      users,
      countries,
      warehouses,
      destinations,
      addresses
    },
  };
}

export default UpdateExitPlan;
