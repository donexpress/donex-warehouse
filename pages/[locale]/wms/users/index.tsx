import UserTable from "@/app/components/wms/user/Tableerege1992"
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute"
import Layout from "../../../../src/app/layout"
import Head from "next/head"
import { UsersProps } from '../../../../src/types';
import { getUsers } from '../../../../src/services/api.users';
import { GetServerSidePropsContext } from 'next';
import { getPaymentMethods, getUserStates } from '../../../../src/services/api.users';

const Index = ({ userList, paymentMethodList, userStateList }: UsersProps) => {
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                <UserTable userList={userList} paymentMethodList={paymentMethodList} userStateList={userStateList} />
            </Layout>
        </ProtectedRoute>
    )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userList = await getUsers(context);
  const paymentMethodList = await getPaymentMethods(context);
  const userStateList = await getUserStates(context);

  return {
    props: {
        userList,
        paymentMethodList,
        userStateList
    }
  }
}

export default Index