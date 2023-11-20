import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import { getStaffStates } from "../../../../src/services/api.staff";
import { getRoles } from "../../../../src/services/api.role";
import { getOrganizations } from "../../../../src/services/api.organization";
import { getWarehouses } from "../../../../src/services/api.warehouse";
import { GetServerSidePropsContext } from "next";
import { StaffFormProps } from "@/typeserege1992";
import LineFormBody from "@/app/components/wms/line_classification/LineFormBodyerege1992";

const InsertLine = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <LineFormBody/>
      </ProtectedRoute>
    </Layout>
  );
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const staffStatesObj = await getStaffStates(context);
//   const roles = await getRoles(context);
//   const organizations = await getOrganizations(context);
//   const affiliations = await getWarehouses(context);
//
//   const staffStates = staffStatesObj !== null ? Object.values(staffStatesObj) : null;
//   return {
//     props: {
//       staffStates,
//       roles,
//       organizations,
//       affiliations,
//     },
//   };
// }

export default InsertLine;
