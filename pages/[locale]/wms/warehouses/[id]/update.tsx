import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import WarehouseFormBody from '../../../../../src/app/components/wms/wh/warehouseFormBody';
import { WarehouseProps } from '../../../../../src/types/warehouse';
import { getWhById } from '../../../../../src/services/api.wh';
import { indexCountries } from '../../../../../src/services/api.countries';
const UpdateWarehouse = ({ countries, warehouse, id }: WarehouseProps) => {
    
    return (
    <ProtectedRoute>
        <Layout>
          <Head>
            <title>Don Express Warehouse</title>
            <link rel="icon" href="/logo_a2a56_favicon.png" />
          </Head>
          <WarehouseFormBody countries={countries ? countries : []} warehouse={warehouse} id={id} />
        </Layout>
      </ProtectedRoute>
      );
  };
  
  export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const warehouse = await getWhById(id, context);
    const countries = await indexCountries(context);
  
    return {
      props: {
        countries,
        warehouse,
        id
      }
    }
  }

export default UpdateWarehouse;