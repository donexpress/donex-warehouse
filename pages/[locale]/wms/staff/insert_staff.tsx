import Head from "next/head";
import Layout from "../../../../src/app/layout";
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute";
import { getStaffStates } from "../../../../src/services/api.staff";
import { getRoles } from "../../../../src/services/api.role";
import { getOrganizations } from "../../../../src/services/api.organization";
import { getWarehouses } from "../../../../src/services/api.warehouse";
import { GetServerSidePropsContext } from "next";
import { StaffFormProps } from "@/typeserege1992";
import StaffFormBody from "@/app/components/wms/staff/StaffFormBodyerege1992";

const InsertStaff = ({
  staffStates,
  roles,
  organizations,
  affiliations,
}: StaffFormProps) => {
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <StaffFormBody
          staffStates={staffStates ? staffStates : []}
          roles={roles ? roles : []}
          organizations={organizations ? organizations : []}
          affiliations={affiliations ? affiliations : []}
        />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const staffStatesObj = await getStaffStates(context);
  const roles = await getRoles(context);
  const organizations = await getOrganizations(context);
  const affiliations = await getWarehouses(context);

  // @ts-ignore
  const staffStates = staffStatesObj.states;
  return {
    props: {
      staffStates,
      roles,
      organizations,
      affiliations,
    },
  };
}

export default InsertStaff;
