import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { IntlShape } from "react-intl";
import {
  getDateFormat,
  getHourFormat,
  getLanguage,
} from "@/helpers/utilserege1992";
import { ExitPlan } from "@/types/exit_planerege1992";
import { PackageShelf } from "@/types/package_shelferege1992";
import { PackingList } from "@/types/storage_planerege1992";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 10,
    marginTop: 15,
    textAlign: "left",
    width: "100%",
    fontWeight: "bold",
  },
  logo: {
    width: 100,
    height: 100,
  },
  table: {
    width: "100%",
    border: "1pt solid #080f25",
    borderWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    border: "1pt solid #cccccc",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 8,
    backgroundColor: "#f6f6f6",
    color: "#333333",
  },
  headerCell: {
    backgroundColor: "#37446b",
    color: "#aeb9e1",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    border: "1pt solid #37446b",
    borderWidth: 1,
    padding: 5,
    fontSize: 8,
  },
  minorCell: {
    flex: 2,
  },
  majorCell: {
    flex: 3,
  },
  image: {
    width: "100%",
    maxWidth: "100%",
    marginBottom: 10,
  },
  locationCell: {
    marginBottom: 5,
  }
});

interface Props {
  intl: IntlShape;
  columns: string[];
  data: ExitPlan[];
}

const ExportExitPlanTable = ({ intl, columns, data }: Props) => {
  const packageShelfFormat = (
    packageShelfs: PackageShelf[] | undefined
  ): string => {
    if (packageShelfs && packageShelfs.length > 0) {
      const packageShelf: PackageShelf = packageShelfs[0];
      return `${intl.formatMessage({ id: "partition" })}: ${
        packageShelf.shelf?.partition_table
      }
        ${intl.formatMessage({ id: "shelf" })}: ${
        packageShelf.shelf?.number_of_shelves
      }
        ${intl.formatMessage({ id: "layer" })}: ${packageShelf.layer}
        ${intl.formatMessage({ id: "column" })}: ${packageShelf.column}`;
    }
    return "";
  };
  const getLocation = (ep: ExitPlan): string => {
    let locations = "";
    ep.packing_lists?.forEach((pl) => {
      locations += packageShelfFormat(pl.package_shelf);
    });
    return locations;
  };

  const getPLUnique = (packingLists: PackingList[]): PackingList[] => {
    const pls = packingLists.filter((pl) => (pl.package_shelf && (pl.package_shelf.length > 0)));
    
    const uniqueCombinationSet = new Set<string>();
    const uniqueArray: PackingList[] = [];

    for (const pl of pls) {
        const combinationKey = `${Number((pl.package_shelf as PackageShelf[])[0].shelf?.partition_table)}_${Number((pl.package_shelf as PackageShelf[])[0].shelf?.number_of_shelves)}_${(pl.package_shelf as PackageShelf[])[0].layer}_${(pl.package_shelf as PackageShelf[])[0].column}`;

        if (!uniqueCombinationSet.has(combinationKey)) {
            uniqueCombinationSet.add(combinationKey);

            uniqueArray.push(pl);
        }
    }
    
    return uniqueArray;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image
          src="https://dc0-bucket.oss-us-west-1.aliyuncs.com/8Y2QlTD9eyFgyWt773lwMUJXGN0xDNHT.png"
          style={styles.logo}
        />
        <Text style={styles.title}>
          {intl.formatMessage({ id: "exit_plan_information" })}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns.map((column, index) => (
              <Text style={ column === "output_number" ? [styles.headerCell, styles.minorCell] : [styles.headerCell]} key={index}>
                {intl.formatMessage({ id: column })}
              </Text>
            ))}
          </View>
          {data.map((oi, index) => (
            <View style={styles.tableRow} key={index}>
              {columns.map((column, index) => {
                switch (column) {
                  case "warehouse":
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {oi.warehouse?.name} - {oi.warehouse?.code}
                      </Text>
                    );
                  case "user":
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {oi.user?.username}
                      </Text>
                    );
                  case "destination": {
                    if (oi.destination_ref) {
                      return (
                        <Text key={index} style={styles.tableCell}>
                          {oi.destination_ref[getLanguage(intl)]}
                        </Text>
                      );
                    }
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {oi.destination}
                      </Text>
                    );
                  }
                  case "address": {
                    if (oi.address_ref) {
                      return (
                        <Text key={index} style={styles.tableCell}>
                          {oi.address_ref[getLanguage(intl)]}
                        </Text>
                      );
                    }
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {oi.address_ref}
                      </Text>
                    );
                  }
                  case "location":
                    return (
                      <View key={index} style={styles.tableCell}>
                        {getPLUnique(oi.packing_lists ? oi.packing_lists : []).map((pl, plIndex) => (
                          pl.package_shelf ?
                          <Text key={plIndex} style={styles.locationCell}>
                            {packageShelfFormat(pl.package_shelf)}
                          </Text>
                          : ''
                        ))}
                      </View>
                    );
                  case "delivered_time":
                  case "updated_at":
                  case "created_at":{
                    // @ts-ignore
                    if (oi[column] && oi[column] !== "") {
                      return (
                        <Text key={index} style={styles.tableCell}>
                          {/* @ts-ignore */}
                          {getDateFormat(oi[column])},{/* @ts-ignore */}
                          {getHourFormat(oi[column])}
                        </Text>
                      );
                    } else {
                      return (
                      <Text key={index} style={styles.tableCell}>
                        --
                      </Text>
                      );
                    }
                  }
                  case "output_number":
                    return (
                      <Text key={index} style={[styles.tableCell, styles.minorCell]}>
                        {/* @ts-ignore */}
                        {oi[column]}
                      </Text>
                    );
                  default:
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {/* @ts-ignore */}
                        {oi[column]}
                      </Text>
                    );
                }
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ExportExitPlanTable;
