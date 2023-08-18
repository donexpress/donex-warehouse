import UserTable from "@/app/components/wms/user/Tableerege1992"
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute"
import Layout from "../../../../src/app/layout"
import Head from "next/head"
import { UsersProps } from '../../../../src/types';
import { getUsers } from '../../../../src/services/api.users';
import { GetServerSidePropsContext } from 'next';

const Index = ({ userList }: UsersProps) => {console.log(userList)
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                <UserTable userList={userList}/>
            </Layout>
        </ProtectedRoute>
    )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userList = await getUsers(context);

  return {
    props: {
        userList
    }
  }
}

export default Index