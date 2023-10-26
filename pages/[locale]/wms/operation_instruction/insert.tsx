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

interface Props {
    types: State[],
    warehouses: Warehouse[],
    exitPlans: ExitPlan[],
    users: User[]
}

const Insert = ({types, warehouses, exitPlans, users}: Props) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <OperationInstructionFormBody types={types} warehouses={warehouses} exitPlans={exitPlans} users={users}/>
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const operationInstructionTypes = await getOperationInstructionType(context);
  const exitPlans = await getCleanExitPlans(context)
  const warehouses = await getWhs(context)
  const users = await getUsers(context)
  const types: State[] = [];
  for (const [key, value] of Object.entries(operationInstructionTypes)) {
    if (key !== "status") {
      // @ts-ignore
      types.push(value);
    }
  }
  return {
    props: {
      types,
      warehouses,
      exitPlans,
      users
    },
  };
}

export default Insert;
