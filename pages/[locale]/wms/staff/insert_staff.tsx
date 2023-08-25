import Head from 'next/head';
import Layout from '../../../../src/app/layout';
import ProtectedRoute from '../../../../src/app/components/common/ProtectedRoute';
import { getStaffStates } from '../../../../src/services/api.staff';
import { getRoles } from '../../../../src/services/api.role';
import { getOrganizations } from '../../../../src/services/api.organization';
import { getWarehouses } from '../../../../src/services/api.warehouse';
import { GetServerSidePropsContext } from 'next';
import { StaffFormProps } from '@/typeserege1992';
import StaffFormBody from '@/app/components/wms/staff/StaffFormBodyerege1992';

const InsertStaff = ({ staffStates, roles, organizations, affiliations }: StaffFormProps) => {
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <StaffFormBody staffStates={staffStates} roles={roles} organizations={organizations} affiliations={affiliations} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const staffStates = await getStaffStates(context);
  const roles = await getRoles(context);
  const organizations = await getOrganizations(context);
  const affiliations = await getWarehouses(context);

  return {
    props: {
      staffStates,
      roles,
      organizations,
      affiliations
    }
  }
}

export default InsertStaff;