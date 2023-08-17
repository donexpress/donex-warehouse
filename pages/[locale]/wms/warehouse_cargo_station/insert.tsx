import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import CargoStationWarehouseFormBody from '../../../../src/app/components/wms/CargoStationWarehouseFormBody';
import { CargoStationWarehouseProps } from '../../../../src/types';
import { indexStateWarehouse } from '../../../../src/services/api.warehouse';
import { indexCountries } from '../../../../src/services/api.countries';
import { getRegionalDivision } from '../../../../src/services/api.regional_division';
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
  const receptionAreas = await getRegionalDivision(context);

  return {
    props: {
      states,
      countries,
      receptionAreas
    }
  }
}

export default InsertWarehouseCargoStation;