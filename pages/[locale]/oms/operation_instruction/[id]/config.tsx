import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import ExitPlanAppendix from "@/app/components/wms/exitPlan/ExitPlanAppendixerege1992";
import { getOperationInstructionsById } from "@/services/api.operation_instructionerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { User } from "@/types/usererege1992";
import { getUserById } from "@/services/api.userserege1992";
import "../../../../../src/styles/wms/exit.plan.config.scss";
import { isWMS } from "@/helperserege1992";
import { getSelf, getStaffById } from "@/services/api.stafferege1992";
import { Staff } from "@/types/stafferege1992";

interface Props {
  operationInstruction: OperationInstruction;
  id: number;
  user: User
}

const Config = ({ id, operationInstruction, user }: Props) => {
  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <ExitPlanAppendix
          owner={user}
          operationInstruction={operationInstruction}
        />
      </Layout>
    </ProtectedRoute>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const operationInstruction: OperationInstruction = await getOperationInstructionsById(id, context);
  let user: User | Staff | null = null
  user = await getSelf(context)

  // if(isWMS()) {
  // } else {
  //   user = await getUserById(operationInstruction.user_id, context)
  // }

  return {
    props: {
      operationInstruction,
      user,
      id,
    },
  };
}

export default Config;
