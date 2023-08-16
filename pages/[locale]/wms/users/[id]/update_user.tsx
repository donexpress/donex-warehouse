import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992"
import UserFormBody from "@/app/components/wms/UserFormBodyerege1992"
import Layout from "@/app/layouterege1992"
import Head from "next/head"
import { getUserById } from '../../../../../src/services/api.users';
import { UserFormProps } from '../../../../../src/types';
import { getStaff } from '@/services/api.stafferege1992';
import { getSubsidiary } from '@/services/api.subsidiaryerege1992';
import { getRegionalDivision } from '@/services/api.regional_divisionerege1992';
import { getWarehouses } from '@/services/api.warehouseerege1992';
import { getPaymentMethods, getUserLevels, getUserStates } from '../../../../../src/services/api.users';

const UpdateUser = ({ user, id, staffList, subsidiarieList, regionalDivisionList, warehouseList, userLevelList, paymentMethodList, userStateList }: UserFormProps) => {
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                <UserFormBody id={Number(id)} user={user} staffList={staffList} subsidiarieList={subsidiarieList} regionalDivisionList={regionalDivisionList} warehouseList={warehouseList} userLevelList={userLevelList} paymentMethodList={paymentMethodList} userStateList={userStateList} />
            </Layout>
        </ProtectedRoute>
    )
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const user = await getUserById(id, context);
  const staffList = await getStaff();
  const subsidiarieList = await getSubsidiary();
  const regionalDivisionList = await getRegionalDivision();
  const warehouseList = await getWarehouses(context);
  const userLevelList = await getUserLevels(context);
  const paymentMethodList = await getPaymentMethods(context);
  const userStateList = await getUserStates(context);

  return {
    props: {
        user,
        id,
        staffList,
        subsidiarieList,
        regionalDivisionList,
        warehouseList,
        userLevelList,
        paymentMethodList
    }
  }
}

export default UpdateUser