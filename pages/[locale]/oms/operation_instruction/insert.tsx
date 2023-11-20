import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import OperationInstructionFormBody from "@/app/components/wms/operationInstruction/OperationInstructionFormBodyerege1992";
import Layout from "@/app/layouterege1992";
import { getCleanExitPlans, getExitPlans } from "@/services/api.exit_planerege1992";
import { getOperationInstructionType } from "@/services/api.operation_instructionerege1992";
import { getUsers } from "@/services/api.userserege1992";
import { getWhs } from "@/services/api.wherege1992";
import { ExitPlan, State } from "@/types/exit_planerege1992";
import { User } from "@/types/usererege1992";
import { Warehouse } from "@/types/warehouseerege1992";
import Head from "next/head";
import { useEffect, useState } from 'react';
import { Loading } from '../../../../src/app/components/common/Loading';
import { getSelf } from "@/services/api.stafferege1992";
import { isOMS } from "@/helperserege1992";

interface Props {
    types: State[],
    warehouses: Warehouse[],
    exitPlans: ExitPlan[],
    users: User[],
    userOwner: User,
}

const Insert = ({types, warehouses, users, userOwner}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [exitPlans, setExitPlans] = useState<ExitPlan[]>([])

  useEffect(() => {
    setup()
  },[])

  const setup = async () => {
    setLoading(true);
    const ePlans = await getCleanExitPlans();
    setExitPlans(ePlans ? ePlans : []);
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
          <OperationInstructionFormBody types={types} warehouses={warehouses} exitPlans={exitPlans} users={users} userOwner={userOwner}/>
        </Loading>
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const operationInstructionTypes = await getOperationInstructionType(context);
  const warehouses = await getWhs(context)
  //const users = await getUsers(context)
  let users: User[] = [];
  if (isOMS(context)) {
    const cookie = JSON.parse(context.req.cookies.profileOMS)
    users.push(cookie)
  }
  const types: State[] = [];
  for (const [key, value] of Object.entries(operationInstructionTypes)) {
    if (key !== "status") {
      // @ts-ignore
      types.push(value);
    }
  }
  const userOwner = await getSelf(context);
  return {
    props: {
      types,
      warehouses,
      users,
      userOwner,
    },
  };
}

export default Insert;
