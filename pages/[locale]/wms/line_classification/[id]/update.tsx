import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import LineFormBody from "../../../../../src/app/components/wms/line_classification/LineFormBody";
import {getLineById} from "../../../../../src/services/api.lines";
import {LineProps} from "../../../../../src/types/line";

const UpdateLine = ({ id, line }: LineProps) => {

  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <LineFormBody id={id} line={line} isFromDetails={false} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const line = await getLineById(id, context);

  return {
    props: {
        id,
        line
    }
  }
}

export default UpdateLine;
