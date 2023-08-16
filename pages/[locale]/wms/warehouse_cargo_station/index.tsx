import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { WarehouseListProps } from '../../../../src/types';
import { getWarehouses } from '../../../../src/services/api.warehouse';
import { GetServerSidePropsContext } from 'next';

const WarehouseCargoStation = ({ warehouseList }: WarehouseListProps) => {
  console.log(warehouseList)
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const warehouseList = await getWarehouses(context);

  return {
    props: {
      warehouseList
    }
  }
}

export default WarehouseCargoStation;