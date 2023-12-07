import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import { WarehouseListProps } from "../../../../src/types";
import TableWarehouse from "../../../../src/app/components/wms/warehouse/TableWarehouse";
import { indexStateWarehouse } from "../../../../src/services/api.warehouse";
import { GetServerSidePropsContext } from "next";

const WarehouseCargoStation = ({
  states,
}: WarehouseListProps) => {
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableWarehouse states={states}/>
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const statesObj = await indexStateWarehouse(context);
  
  // @ts-ignore
  const states = statesObj.states ? statesObj.states : [];
  return {
    props: {
      states
    },
  };
}

export default WarehouseCargoStation;
