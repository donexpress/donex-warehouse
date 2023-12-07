import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import ExitPlanAppendix from "@/app/components/wms/exitPlan/ExitPlanAppendixerege1992";
import { getOperationInstructionsById } from "@/services/api.operation_instructionerege1992";
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import { User } from "@/types/usererege1992";
import { getUserById } from "@/services/api.userserege1992";
import "../../../../../src/styles/wms/exit.plan.config.scss";
import { useEffect, useState } from 'react';
import { Loading } from '../../../../../src/app/components/common/Loading';

interface Props {
  operationInstruction: OperationInstruction;
  id: number;
  user: User
}

const Config = ({ id }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [operationInstruction, setOperationInstruction] = useState<OperationInstruction | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setup()
  },[])

  const setup = async () => {
    setLoading(true);
    const oi = await getOperationInstructionsById(Number(id));
    setOperationInstruction(oi);
    if (oi) {
      const userData = await getUserById(oi.user_id);
      setUser(userData);
    }
    setLoading(false);
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>A2A56 Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <Loading loading={loading}>
          <ExitPlanAppendix
            owner={user as User}
            operationInstruction={operationInstruction}
          />
        </Loading>
      </Layout>
    </ProtectedRoute>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  //const operationInstruction: OperationInstruction = await getOperationInstructionsById(id, context);
  //const user = await getUserById(operationInstruction.user_id, context)

  return {
    props: {
      id,
    },
  };
}

export default Config;
