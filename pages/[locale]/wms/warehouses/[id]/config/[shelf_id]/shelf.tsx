import Head from 'next/head';
import Layout from '../../../../../../../src/app/layout';
import ProtectedRoute from '../../../../../../../src/app/components/common/ProtectedRoute';
import ShelfBody from '../../../../../../../src/app/components/wms/wh/ShelfBody';
import { ShelfConfigProps } from '../../../../../../../src/types/shelf';
import { getShelfById } from '../../../../../../../src/services/api.shelf';
import { getWhById } from '../../../../../../../src/services/api.wh';

const ConfigWarehouse = ({ shelf, warehouse, id, warehouse_id }: ShelfConfigProps) => {
    
    return (
    <ProtectedRoute>
        <Layout>
          <Head>
            <title>Don Express Warehouse</title>
            <link rel="icon" href="/logo_a2a56_favicon.png" />
          </Head>
          <ShelfBody shelf={shelf} id={id} warehouse={warehouse} warehouse_id={warehouse_id} />
        </Layout>
      </ProtectedRoute>
      );
  };
  
  export async function getServerSideProps(context: any) {
    const { shelf_id, id } = context.params;
    const shelf = await getShelfById(shelf_id, context);
    const warehouse = await getWhById(id, context);
  
    return {
      props: {
        shelf,
        id: shelf_id,
        warehouse,
        warehouse_id: id,
      }
    }
  }

export default ConfigWarehouse;