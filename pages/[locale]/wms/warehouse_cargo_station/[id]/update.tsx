import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import CargoStationWarehouseFormBody from '../../../../../src/app/components/wms/CargoStationWarehouseFormBody';
import { CargoStationWarehouseProps } from '../../../../../src/types';
import { indexStateWarehouse, getWarehouseById } from '../../../../../src/services/api.warehouse';
import { indexCountries } from '../../../../../src/services/api.countries';
import { GetServerSidePropsContext } from 'next';

const UpdateWarehouseCargoStation = ({ states, countries, receptionAreas, warehouse, id }: CargoStationWarehouseProps) => {
    console.log(warehouse)
    return (
    <ProtectedRoute>
        <Layout>
          <Head>
            <title>Don Express Warehouse</title>
            <link rel="icon" href="/icon_favicon.png" />
          </Head>
          <CargoStationWarehouseFormBody states={states ? states : []} countries={countries ? countries : []} receptionAreas={receptionAreas} warehouse={warehouse} id={id} />
        </Layout>
      </ProtectedRoute>
      );
  };
  
  export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const warehouse = await getWarehouseById(id, context);
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
        receptionAreas,
        warehouse,
        id
      }
    }
  }
  
  export default UpdateWarehouseCargoStation;