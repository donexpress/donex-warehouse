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
import { OperationInstruction } from "@/types/operation_instructionerege1992";
import {
  getDateFormat,
  getHourFormat,
  getLanguage,
} from "@/helpers/utilserege1992";
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
    width: 110,
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
    marginBottom: 7,
  },
});

interface Props {
  intl: IntlShape;
  columns: string[];
  data: OperationInstruction[];
}

const ExportTable = ({ intl, columns, data }: Props) => {
  const getType = (data: any[]): string[] => {
    const result: string[] = [];
    data.forEach((el) => {
      result.push(el[getLanguage(intl)]);
    });
    return result;
  };
  const getLocation = (ep: OperationInstruction): string => {
    const locations: string[] = [];
    ep.output_plan &&
      ep.output_plan.packing_lists &&
      ep.output_plan.packing_lists.forEach((pl) => {
        const l = packageShelfFormat(pl.package_shelf)
        if(locations.find(el => el === l) === undefined) {
          locations.push(l)
        }
      });
    return locations.join('\n');
  };

  const packageShelfFormat = (packageShelfs: any): string => {
    if (packageShelfs) {
      let packageShelf: PackageShelf | null = null;
      if (packageShelfs.length > 0) {
        packageShelf = packageShelfs[0];
      } else {
        packageShelf = packageShelfs;
      }
      if (packageShelf) {
        return `${intl.formatMessage({ id: "partition" })}: ${
          packageShelf.shelf?.partition_table
        }
      ${intl.formatMessage({ id: "shelf" })}: ${
          packageShelf.shelf?.number_of_shelves
        }
      ${intl.formatMessage({ id: "layer" })}: ${packageShelf.layer}
      ${intl.formatMessage({ id: "column" })}: ${packageShelf.column}`;
      }
    }
    return "";
  };

  const getPLUnique = (packingLists: PackingList[]): PackingList[] => {
    const pls = packingLists.filter(
      (pl) => pl.package_shelf
    );

    const uniqueCombinationSet = new Set<string>();
    const uniqueArray: PackingList[] = [];

    for (const pl of pls) {
      if (pl.package_shelf) {
        let packageShelf: PackageShelf | null = null;
        if (pl.package_shelf.length > 0) {
          packageShelf = pl.package_shelf[0];
        } else {
          // @ts-ignore
          packageShelf = pl.package_shelf;
        }

        if (packageShelf) {
          const combinationKey = `${Number(
            packageShelf.shelf?.partition_table
          )}_${Number(
            packageShelf.shelf?.number_of_shelves
          )}_${packageShelf.layer}_${
            packageShelf.column
          }`;
    
          if (!uniqueCombinationSet.has(combinationKey)) {
            uniqueCombinationSet.add(combinationKey);
    
            uniqueArray.push(pl);
          }
        }
      }
    }

    return uniqueArray;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image
          src="https://warehouse-stg.oss-us-west-1.aliyuncs.com/JPb4ZMeIOa2ne88yRZM6kZHjqxQGH6Bb.png"
          style={styles.logo}
        />
        <Text style={styles.title}>
          {intl.formatMessage({ id: "operation_instructions" })}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns.map((column, index) => (
              <Text style={[styles.headerCell]} key={index}>
                {intl.formatMessage({ id: column })}
              </Text>
            ))}
          </View>
          {data.map((oi, index) => (
            <View style={styles.tableRow} key={index}>
              {columns.map((column, index) => {
                switch (column) {
                  case "operation_instruction_type":
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {getType(
                          // @ts-ignore
                          oi.operation_instruction_type.instruction_type
                        ).join(", ")}
                      </Text>
                    );
                  case "warehouse_id":
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {oi.warehouse?.name} - {oi.warehouse?.code}
                      </Text>
                    );
                  case "output_plan_id":
                    return (
                      <Text key={index} style={styles.tableCell}>
                        {oi.output_plan?.output_number}
                      </Text>
                    );
                  case "location":
                    return (
                      <View key={index} style={styles.tableCell}>
                        {getPLUnique(
                          (oi.output_plan && oi.output_plan.packing_lists && (oi.output_plan.packing_lists.length > 0)) ? oi.output_plan.packing_lists : []
                        ).map((pl, plIndex) =>
                          pl.package_shelf ? (
                            <Text key={plIndex} style={styles.locationCell}>
                              {packageShelfFormat(pl.package_shelf)}
                            </Text>
                          ) : (
                            ""
                          )
                        )}
                      </View>
                    );
                  case "updated_at":
                  case "created_at":
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
                      <Text key={index} style={styles.tableCell}>
                        --
                      </Text>;
                    }
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

export default ExportTable;
