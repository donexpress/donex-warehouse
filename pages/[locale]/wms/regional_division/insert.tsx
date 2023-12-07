import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import DivisionFormBody from "../../../../src/app/components/wms/regional_division/DivisionFormBody";
import {useIntl} from "react-intl";

const InsertLine = () => {
    const intl = useIntl();
    const regionalDivisionsTypes = [{value: 1, label: intl.formatMessage({ id: "reception_area" })}, {value: 2, label: intl.formatMessage({ id: "delivery_area" })}];
    return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <DivisionFormBody regionalDivisionsTypes={regionalDivisionsTypes ? regionalDivisionsTypes : []}/>
      </ProtectedRoute>
    </Layout>
  );
};

export default InsertLine;
