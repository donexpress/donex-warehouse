import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import CargoStationWarehouseFormBody from '../../../../src/app/components/wms/CargoStationWarehouseFormBody';
import { CargoStationWarehouseProps } from '../../../../src/types';
import { indexStateWarehouse } from '../../../../src/services/api.warehouse';
import { indexCountries } from '../../../../src/services/api.countries';
import { GetServerSidePropsContext } from 'next';

const InsertWarehouseCargoStation = ({ states, countries, receptionAreas }: CargoStationWarehouseProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <CargoStationWarehouseFormBody states={states ? states : []} countries={countries ? countries : []} receptionAreas={receptionAreas}/>
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const states = await indexStateWarehouse(context);
  const countries = await indexCountries(context);
  const receptionAreas = [
      {
          value: 'Almacen 1',
          label: 'Almacen 1',
      },
      {
          value: 'Almacen 2',
          label: 'Almacen 2',
      }
  ];

  return {
    props: {
      states,
      countries,
      receptionAreas
    }
  }
}

export default InsertWarehouseCargoStation;