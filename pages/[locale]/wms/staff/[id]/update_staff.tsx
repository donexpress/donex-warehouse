import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import { getStaffStates, getManifestCustomers } from "../../../../../src/services/api.staff";
import { getRoles } from "../../../../../src/services/api.role";
import { getOrganizations } from "../../../../../src/services/api.organization";
import { getWarehouses } from "../../../../../src/services/api.warehouse";
import { StaffFormProps } from "@/typeserege1992";
import StaffFormBody from "@/app/components/wms/staff/StaffFormBodyerege1992";
import { getStaffById } from "@/services/api.stafferege1992";

const UpdateStaff = ({
  staff,
  id,
  staffStates,
  roles,
  organizations,
  affiliations,
  customers,
}: StaffFormProps) => {
  return (
    <Layout>
      <Head>
        <title>Don Express Warehouse</title>
        <link rel="icon" href="/icon_favicon.png" />
      </Head>
      <ProtectedRoute>
        <StaffFormBody
          staff={staff}
          id={id}
          staffStates={staffStates ? staffStates : []}
          roles={roles ? roles : []}
          organizations={organizations ? organizations : []}
          affiliations={affiliations ? affiliations : []}
          customers={customers ? customers : []}
        />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const staff = await getStaffById(id, context);
  const staffStatesObj = await getStaffStates(context);
  const roles = await getRoles(context);
  const organizations = await getOrganizations(context);
  const affiliations = await getWarehouses(context);
  const customers = await getManifestCustomers(context);

  // @ts-ignore
  const staffStates = staffStatesObj.states;
  return {
    props: {
      id,
      staff,
      staffStates,
      roles,
      organizations,
      affiliations,
      customers,
    },
  };
}

export default UpdateStaff;
