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
import { getDateFormat, getHourFormat, getLanguage } from "@/helpers/utilserege1992";
import { PackageShelf } from "@/types/package_shelferege1992";
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
    let locations = "";
    ep.output_plan &&
      ep.output_plan.packing_lists &&
      ep.output_plan.packing_lists.forEach((pl) => {
        locations += packageShelfFormat(pl.package_shelf);
      });
    return locations;
  };

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
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image
          src="https://dc0-bucket.oss-us-west-1.aliyuncs.com/8Y2QlTD9eyFgyWt773lwMUJXGN0xDNHT.png"
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
                      <Text key={index} style={styles.tableCell}>
                        {getLocation(oi)}
                      </Text>
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
