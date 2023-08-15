import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import Info from "@/app/components/wms/user/Infoerege1992";
import Layout from "@/app/layouterege1992";
import { getUserById } from "@/services/api.userserege1992";
import { User } from "@/types/usererege1992";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ShowUser = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        setup()
    }, [])

    const setup = async () => {
        const user = await getUserById(Number(id))
        setUser(user)
    }
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                {user && (
                    <Info user={user}/>
                )}
            </Layout>
        </ProtectedRoute>
    )
}

export default ShowUser;