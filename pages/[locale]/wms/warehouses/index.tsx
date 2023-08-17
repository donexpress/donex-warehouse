import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { WHListProps} from '../../../../src/types/warehouse';
import { getWhs } from '../../../../src/services/api.wh';
import { GetServerSidePropsContext } from 'next';
import WhTable from '../../../../src/app/components/wms/wh/TableWh';

const WarehouseIndex = ({ warehouseList }: WHListProps) => {
  
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <WhTable warehouseList={warehouseList ? warehouseList : []} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //const warehouseList = await getWhs(context);
  const warehouseList: any = [];

  return {
    props: {
      warehouseList
    }
  }
}

export default WarehouseIndex;