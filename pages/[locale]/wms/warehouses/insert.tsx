import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import WarehouseFormBody from '../../../../src/app/components/wms/wh/warehouseFormBody';
import { WarehouseProps } from '../../../../src/types/warehouse';
import { indexCountries } from '../../../../src/services/api.countries';
import { GetServerSidePropsContext } from 'next';

const InsertWarehouse = ({ countries }: WarehouseProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <WarehouseFormBody countries={countries ? countries : []}/>
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const countries = await indexCountries(context);

  return {
    props: {
      countries,
    }
  }
}

export default InsertWarehouse;