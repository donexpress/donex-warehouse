import Head from 'next/head';
import Layout from '../../../../../../src/app/layout';
import ProtectedRoute from '../../../../../../src/app/components/common/ProtectedRoute';
import WarehouseConfig from '../../../../../../src/app/components/wms/wh/WarehouseConfg';
import { WarehouseConfigProps } from '../../../../../../src/types/warehouse';
import { getWhById } from '../../../../../../src/services/api.wh';

const ConfigWarehouse = ({ warehouse, id }: WarehouseConfigProps) => {
    
    return (
    <ProtectedRoute>
        <Layout>
          <Head>
            <title>Don Express Warehouse</title>
            <link rel="icon" href="/icon_favicon.png" />
          </Head>
          <WarehouseConfig warehouse={warehouse} id={id} />
        </Layout>
      </ProtectedRoute>
      );
  };
  
  export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const warehouse = await getWhById(id, context);
  
    return {
      props: {
        warehouse,
        id
      }
    }
  }

export default ConfigWarehouse;