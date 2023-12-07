import Head from "next/head";
import Layout from "../../../../../src/app/layout";
import ProtectedRoute from "../../../../../src/app/components/common/ProtectedRoute";
import CargoStationWarehouseFormBody from "../../../../../src/app/components/wms/warehouse/CargoStationWarehouseFormBody";
import { CargoStationWarehouseProps } from "../../../../../src/types";
import {
  indexStateWarehouse,
  getWarehouseById,
} from "../../../../../src/services/api.warehouse";
import { indexCountries } from "../../../../../src/services/api.countries";
import { getRegionalDivision } from "../../../../../src/services/api.regional_division";
import { GetServerSidePropsContext } from "next";

const ShowWarehouseCargoStation = ({
  states,
  countries,
  receptionAreas,
  warehouse,
  id,
}: CargoStationWarehouseProps) => {
  return (
    <Layout>
      <Head>
        <title>A2A56 Warehouse</title>
        <link rel="icon" href="/logo_a2a56_favicon.png" />
      </Head>
      <ProtectedRoute>
        <CargoStationWarehouseFormBody
          states={states ? states : []}
          countries={countries ? countries : []}
          receptionAreas={receptionAreas}
          warehouse={warehouse}
          id={id}
          isFromDetails={true}
        />
      </ProtectedRoute>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const warehouse = await getWarehouseById(id, context);
  const statesObj = await indexStateWarehouse(context);
  const countries = await indexCountries(context);
  const receptionAreas = await getRegionalDivision(context);

  // @ts-ignore
  const states = statesObj.states;
  return {
    props: {
      states,
      countries,
      receptionAreas,
      warehouse,
      id,
    },
  };
}

export default ShowWarehouseCargoStation;
