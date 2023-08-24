import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import { StaffFormProps } from '@/typeserege1992';
import StaffFormBody from '@/app/components/wms/staff/StaffFormBodyerege1992';
import { getStaffById } from '@/services/api.stafferege1992';

const UpdateStaff = ({ staff, isFromShowStaff ,id }: StaffFormProps) => {
  return (
  <ProtectedRoute>
      <Layout>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/icon_favicon.png" />
        </Head>
        <StaffFormBody staff={staff} id={id} isFromShowStaff={true} />
      </Layout>
    </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const staff = await getStaffById(id, context);

  return {
    props: {
        id,
        staff
    }
  }
}

export default UpdateStaff;