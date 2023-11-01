import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import { getStaffStates } from "../../../../src/services/api.staff";
import { getRoles } from "../../../../src/services/api.role";
import { getOrganizations } from "../../../../src/services/api.organization";
import { getWarehouses } from "../../../../src/services/api.warehouse";
import { GetServerSidePropsContext } from "next";
import { StaffFormProps } from "@/typeserege1992";
import ManifestFormBody from "@/app/components/wms/manifest/ManifestFormBodyerege1992";

const InsertGuide = () => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <ManifestFormBody />
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

export default InsertGuide;
