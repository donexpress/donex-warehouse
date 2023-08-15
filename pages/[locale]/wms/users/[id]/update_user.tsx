import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992"
import UserFormBody from "@/app/components/wms/UserFormBodyerege1992"
import Layout from "@/app/layouterege1992"
import Head from "next/head"
import { useRouter } from "next/router"

const UpdateUser = () => {
  const router = useRouter();
  const { id } = router.query;
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                <UserFormBody id={Number(id)} />
            </Layout>
        </ProtectedRoute>
    )
}

export default UpdateUser