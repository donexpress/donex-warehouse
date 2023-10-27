import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import OperationInstructionFormBody from "@/app/components/wms/operationInstruction/OperationInstructionFormBodyerege1992";
import Layout from "@/app/layouterege1992";
import { getCleanExitPlans, getExitPlans } from "@/services/api.exit_planerege1992";
import {
  getOperationInstructionType,
  getOperationInstructionsById,
} from "@/services/api.operation_instructionerege1992";
import { getUsers } from "@/services/api.userserege1992";
import { getWhs } from "@/services/api.wherege1992";
import { ExitPlan, State } from "@/types/exit_planerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { User } from "@/types/usererege1992";
import { Warehouse } from "@/types/warehouseerege1992";
import Head from "next/head";

interface Props {
  types: State[];
  warehouses: Warehouse[];
  exitPlans: ExitPlan[];
  users: User[];
  id?: number;
  operationInstruction?: OperationInstruction;
}

const Update = ({
  types,
  warehouses,
  exitPlans,
  users,
  id,
  operationInstruction,
}: Props) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <OperationInstructionFormBody
          exitPlans={exitPlans}
          types={types}
          users={users}
          warehouses={warehouses}
          isModify
          id={id}
          operationInstruction={operationInstruction}
        />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const operationInstructionTypes = await getOperationInstructionType(context);
  const exitPlans = await getCleanExitPlans(context);
  const warehouses = await getWhs(context);
  const users = await getUsers(context);
  const operationInstruction = await getOperationInstructionsById(id);
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
      users,
      id,
      operationInstruction,
    },
  };
}

export default Update;
