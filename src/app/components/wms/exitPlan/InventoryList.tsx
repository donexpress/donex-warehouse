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
import { ExitPlan } from "@/types/exit_planerege1992";
import { PackingList } from "@/types/storage_planerege1992";
import {
  getDateFormat,
  getHourFormat,
  getLanguage,
} from "@/helpers/utilserege1992";
import { PackageShelf } from "../../../../types/package_shelf";

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
  exitPlan: ExitPlan;
  boxes: PackingList[];
}

const InventoryList = ({ intl, exitPlan, boxes }: Props) => {
  console.log(boxes)
  const packageShelfFormat = (
    packageShelfs: PackageShelf[] | PackageShelf | undefined
  ): string => {
    if (packageShelfs && ((!!Array.isArray(packageShelfs) && packageShelfs.length > 0) || !Array.isArray(packageShelfs))) {
      const packageShelf: PackageShelf = !!Array.isArray(packageShelfs) ? packageShelfs[0] : packageShelfs;
      return `${intl.formatMessage({ id: "partition" })}: ${
        packageShelf.shelf?.partition_table
      }
        ${intl.formatMessage({ id: "shelf" })}: ${
        packageShelf.shelf?.number_of_shelves
      }
        ${intl.formatMessage({ id: "layer" })}: ${packageShelf.layer}
        ${intl.formatMessage({ id: "column" })}: ${packageShelf.column}`;
    }
    return "--";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Image
          src="https://dc0-bucket.oss-us-west-1.aliyuncs.com/8Y2QlTD9eyFgyWt773lwMUJXGN0xDNHT.png"
          style={styles.logo}
        />
        <Text style={styles.title}>
          {intl.formatMessage({ id: "exit_plan_receipt" })}
        </Text>
        <Text style={styles.subtitle}>
          {intl.formatMessage({ id: "exit_plan_data" })}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "delivery_number" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "user" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "warehouse" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "box_numbers" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "destination" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "address" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "observations" })}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {exitPlan.output_number ? exitPlan.output_number : ""}
            </Text>
            <Text style={styles.tableCell}>
              {exitPlan.user ? exitPlan.user.username : ""}
            </Text>
            <Text style={styles.tableCell}>
              {exitPlan.warehouse
                ? `${exitPlan.warehouse.name} (${exitPlan.warehouse.code})`
                : ""}
            </Text>
            <Text style={styles.tableCell}>{exitPlan.box_amount}</Text>
            <View style={styles.tableCell}>
              {!!exitPlan.destination_ref && (
                <Text>{exitPlan.destination_ref[getLanguage(intl)]}</Text>
              )}
              {!exitPlan.destination_ref && <Text>{exitPlan.destination}</Text>}
            </View>
            <Text style={styles.tableCell}>{exitPlan.address}</Text>
            <Text style={styles.tableCell}>{exitPlan.observations}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          {intl.formatMessage({ id: "exit_plan_boxes" })}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "box_number" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "case_number" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "location" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "storage_time" })}
            </Text>
            <Text style={[styles.headerCell]}>
              {intl.formatMessage({ id: "delivery_time" })}
            </Text>
          </View>
          {boxes.map((box, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{box.box_number}</Text>
              <Text style={styles.tableCell}>{box.case_number}</Text>
              <Text style={styles.tableCell}>
                {packageShelfFormat(box.package_shelf)}
              </Text>
              <Text style={styles.tableCell}>
                {/* @ts-ignore */}
                {box.storage_time} {intl.formatMessage({ id: "days" })}
              </Text>
              <Text style={styles.tableCell}>
                {exitPlan.delivered_time
                  ? `${getDateFormat(exitPlan.delivered_time)}, ${getHourFormat(
                      exitPlan.delivered_time
                    )}`
                  : "--"}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default InventoryList;
