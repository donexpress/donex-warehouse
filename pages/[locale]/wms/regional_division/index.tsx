import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import Layout from "@/app/layouterege1992";
import Head from "next/head";
import TableRegionalDivision from "../../../../src/app/components/wms/regional_division/TableRegionalDivision";
import {GetServerSidePropsContext} from "next";
import {useIntl} from "react-intl";
import {countDivision} from "../../../../src/services/api.regional_division";

const Index = ({divisionsCount}) => {
  const intl = useIntl();
  const regionalDivisionsTypes = [{value: 1, label: intl.formatMessage({ id: "reception_area" })}, {value: 2, label: intl.formatMessage({ id: "delivery_area" })}];
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <TableRegionalDivision regionalDivisionsTypes={regionalDivisionsTypes ? regionalDivisionsTypes : []} divisionsCount={divisionsCount}/>
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const divisionsCount = await countDivision(context);

    return {
        props: {
            divisionsCount
        }
    }
}
export default Index;
