import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import CargoStationWarehouseFormBody from '../../../../../src/app/components/wms/CargoStationWarehouseFormBody';
import { CargoStationWarehouseProps } from '../../../../../src/types';
import { indexStateWarehouse } from '../../../../../src/services/api.warehouse';
import { indexCountries } from '../../../../../src/services/api.countries';
import { GetServerSidePropsContext } from 'next';

const UpdateWarehouseCargoStation = ({ states, countries }: CargoStationWarehouseProps) => {
    
    return (
    <ProtectedRoute>
        <Layout>
          <Head>
            <title>Don Express Warehouse</title>
            <link rel="icon" href="/icon_favicon.png" />
          </Head>
          <CargoStationWarehouseFormBody states={states} countries={countries}/>
        </Layout>
      </ProtectedRoute>
      );
  };
  
  export async function getServerSideProps(context: GetServerSidePropsContext) {
    const states = await indexStateWarehouse(context);
    const countries = await indexCountries(context);
  
    return {
      props: {
        states,
        countries
      }
    }
  }
  
  export default UpdateWarehouseCargoStation;