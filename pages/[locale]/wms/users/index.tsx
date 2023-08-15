import UserTable from "@/app/components/wms/user/Tableerege1992"
import ProtectedRoute from "../../../../src/app/components/common/ProtectedRoute"
import Layout from "../../../../src/app/layout"
import Head from "next/head"

const Index = () => {
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                <UserTable />
            </Layout>
        </ProtectedRoute>
    )
}

export default Index