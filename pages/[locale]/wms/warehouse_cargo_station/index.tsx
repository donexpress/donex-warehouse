import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import { WarehouseListProps } from "../../../../src/types";
import TableWarehouse from "../../../../src/app/components/wms/warehouse/TableWarehouse";

const WarehouseCargoStation = ({
  warehouseList,
  states,
  countries,
  receptionAreas,
}: WarehouseListProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableWarehouse/>
      </ProtectedRoute>
    </Layout>
  );
};

export default WarehouseCargoStation;
