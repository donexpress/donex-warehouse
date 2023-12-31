import Head from 'next/head';
import Layout from '../../../../../src/app/layout';
import ProtectedRoute from '../../../../../src/app/components/common/ProtectedRoute';
import {getLineById} from "../../../../../src/services/api.lines";
import {LineProps} from "../../../../../src/types/line";
import DivisionFormBody from "../../../../../src/app/components/wms/regional_division/DivisionFormBody";
import {useIntl} from "react-intl";
import {getDivisionById} from "../../../../../src/services/api.regional_division";
import { RegionalDivisionProps} from "../../../../../src/types/regional_division";

const UpdateLine = ({id, regionalDivision}: RegionalDivisionProps) => {
    const intl = useIntl();
    const regionalDivisionsTypes = [{value: 1, label: intl.formatMessage({id: "reception_area"})}, {
        value: 2,
        label: intl.formatMessage({id: "delivery_area"})
    }];
    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Don Express Warehouse</title>
                    <link rel="icon" href="/icon_favicon.png"/>
                </Head>
                <DivisionFormBody id={id} regionalDivision={regionalDivision} isFromDetails={false}
                                  regionalDivisionsTypes={regionalDivisionsTypes ? regionalDivisionsTypes : []}/>
            </Layout>
        </ProtectedRoute>
    );
};

export async function getServerSideProps(context: any) {
    const {id} = context.params;
    const regionalDivision = await getDivisionById(id, context);

    return {
        props: {
            id,
            regionalDivision
        }
    }
}

export default UpdateLine;
