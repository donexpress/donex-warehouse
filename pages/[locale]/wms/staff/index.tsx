import ProtectedRoute from "@/app/components/common/ProtectedRouteerege1992";
import Layout from "@/app/layouterege1992";
import Head from "next/head";
import { GetServerSidePropsContext } from 'next';
import { getStaff } from '../../../../src/services/api.staff';
import { StaffProps } from "@/typeserege1992";
import StaffTable from "@/app/components/wms/staff/Tableerege1992";

const Index = ({ staffList }: StaffProps) => {console.log(staffList)
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png" />
                </Head>
                <StaffTable staffList={staffList} />
            </Layout>
        </ProtectedRoute>
    )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const staffList = await getStaff(context);
  
    return {
      props: {
        staffList
      }
    }
  }
export default Index;