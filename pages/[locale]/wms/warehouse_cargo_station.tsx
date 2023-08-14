import Head from 'next/head';
import Layout from '../../../src/app/layout';
import ProtectedRoute from '../../../src/app/components/common/ProtectedRoute';
import { CargoStationWarehouseProps } from '../../../src/types';
import { indexStateWarehouse } from '../../../src/services/api.warehouse';

const WarehouseCargoStation = ({ states }: CargoStationWarehouseProps) => {
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <div></div>
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps() {
  const states = await indexStateWarehouse();

  return {
    props: {
      states
    }
  }
}

export default WarehouseCargoStation;