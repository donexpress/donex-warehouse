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
import { getLanguage } from "@/helpers/utilserege1992";
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
  console.log(data);
  const getType = (data: any[]): string[] => {
    const result: string[] = [];
    data.forEach((el) => {
      result.push(el[getLanguage(intl)]);
    });
    return result;
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