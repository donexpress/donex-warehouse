import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import Layout from "@/app/layouterege1992";
import Head from "next/head";
import TableRegionalDivision from "../../../../src/app/components/wms/regional_division/TableRegionalDivision";
import {useIntl} from "react-intl";

const Index = () => {
  const intl = useIntl();
  const regionalDivisionsTypes = [{value: 1, label: intl.formatMessage({ id: "reception_area" })}, {value: 2, label: intl.formatMessage({ id: "delivery_area" })}];
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableRegionalDivision regionalDivisionsTypes={regionalDivisionsTypes ? regionalDivisionsTypes : []} />
      </ProtectedRoute>
    </Layout>
  );
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const divisionsCount = await countDivision(context);
//
//     return {
//         props: {
//             divisionsCount
//         }
//     }
// }
export default Index;
