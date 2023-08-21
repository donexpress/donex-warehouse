import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { WarehouseListProps } from '../../../../src/types';
import { getWarehouses } from '../../../../src/services/api.warehouse';
import { GetServerSidePropsContext } from 'next';
import TableWarehouse from '../../../../src/app/components/wms/warehouse/TableWarehouse';
import { indexStateWarehouse } from '../../../../src/services/api.warehouse';
import { indexCountries } from '../../../../src/services/api.countries';
import { getRegionalDivision } from '../../../../src/services/api.regional_division';

const WarehouseCargoStation = ({ warehouseList, states, countries, receptionAreas }: WarehouseListProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <TableWarehouse warehouseList={warehouseList ? warehouseList : []}  states={states ? states : []} countries={countries ? countries : []} receptionAreas={receptionAreas}/>
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const warehouseList = await getWarehouses(context);
  const states = await indexStateWarehouse(context);
  const countries = await indexCountries(context);
  const receptionAreas = await getRegionalDivision(context);

  return {
    props: {
      warehouseList,
      states,
      countries,
      receptionAreas
    }
  }
}

export default WarehouseCargoStation;