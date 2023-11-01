import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import ManifestFormBody from "../../../../../src/app/components/wms/manifest/ManifestFormBody";
import { getLineById } from "../../../../../src/services/api.lines";
import { LineProps } from "../../../../../src/types/line";

const UpdateLine = ({ id, line }: LineProps) => {

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <ManifestFormBody id={id} line={line} isFromDetails={false} />
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
