import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { StoragePlan, PackingList } from "../../../types/storage_plan";
import { PackageShelf } from "../../../types/package_shelf";
import { IntlShape } from 'react-intl';
import { getDateFromStr, getHourFromStr, getLocationPackages } from '../../../helpers'
import { getDateFormat, getHourFormat } from '../../../helpers/utils'
import { Selection } from "@nextui-org/react";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 10,
    marginTop: 15,
    textAlign: 'left',
    width: '100%',
    fontWeight: 'bold'
  },
  logo: {
    width: 100,
    height: 100,
  },
  table: {
    width: '100%',
    border: '1pt solid #080f25',
    borderWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    border: '1pt solid #cccccc',
    borderWidth: 1,
    padding: 5,
    textAlign: 'center',
    fontSize: 8,
    backgroundColor: '#f6f6f6',
    color: '#333333',
  },
  headerCell: {
    backgroundColor: '#37446b',
    color: '#aeb9e1',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    border: '1pt solid #37446b',
    borderWidth: 1,
    padding: 5,
    fontSize: 8,
  },
  minorCell: {
    flex: 2
  },
  majorCell: {
    flex: 3
  },
  image: {
    width: '100%',
    maxWidth: '100%',
    marginBottom: 10,
  },
  locationCell: {
    marginBottom: 5,
  },
});

interface Params {
  storagePlans: StoragePlan[];
  intl: IntlShape;
  selection: Selection;
}

type Element = {
  keyWord: string;
  value: string;
  sp?: StoragePlan;
}

const ExportStoragePlansPDF = ({ storagePlans, intl, selection }: Params) => {
  const getTitles = (): string[] => {
    let titles: string[] = [];
    const key1: string = intl.formatMessage({ id: 'warehouse_order_number' });
    const key2: string = intl.formatMessage({ id: 'customer_order_number' });
    const key3: string = intl.formatMessage({ id: 'user' });
    const key4: string = intl.formatMessage({ id: 'storage' });
    const key5: string = intl.formatMessage({ id: 'number_of_boxes_entered' });
    const key6: string = intl.formatMessage({ id: 'number_of_boxes_stored' });
    const key6_1: string = intl.formatMessage({ id: "location" });
    const key7: string = intl.formatMessage({ id: 'evidence' });
    const key8: string = intl.formatMessage({ id: 'reference_number' });
    const key9: string = intl.formatMessage({ id: 'pr_number' });
    const key10: string = intl.formatMessage({ id: 'state' });
    const key11: string = intl.formatMessage({ id: 'delivery_time' });
    const key11_1: string = intl.formatMessage({ id: "dispatched_boxes" });
    const key12: string = intl.formatMessage({ id: 'observations' });
    const key13: string = intl.formatMessage({ id: "created_at" });
    const key14: string = intl.formatMessage({ id: "updated_at" });
    
    if (selection === "all" || selection.has("order_number")) {
        titles.push(key1);
    }
    if (selection === "all" || selection.has("customer_order_number")) {
        titles.push(key2);
    }
    if (selection === "all" || selection.has("user_id")) {
        titles.push(key3);
    }
    if (selection === "all" || selection.has("warehouse_id")) {
        titles.push(key4);
    }
    if (selection === "all" || selection.has("box_amount")) {
        titles.push(key5);
    }
    if (selection === "all" || selection.has("number_of_boxes_stored")) {
        titles.push(key6);
    }
    if (selection === "all" || selection.has("location")) {
        titles.push(key6_1);
    }
    if (selection === "all" || selection.has("dispatched_boxes")) {
        titles.push(key11_1);
    }
    if (selection === "all" || selection.has("evidence")) {
        titles.push(key7);
    }
    if (selection === "all" || selection.has("reference_number")) {
        titles.push(key8);
    }
    if (selection === "all" || selection.has("pr_number")) {
        titles.push(key9);
    }
    if (selection === "all" || selection.has("state")) {
        titles.push(key10);
    }
    if (selection === "all" || selection.has("delivered_time")) {
        titles.push(key11);      
    }
    if (selection === "all" || selection.has("observations")) {
        titles.push(key12);
    }
    if (selection === "all" || selection.has("created_at")) {
        titles.push(key13);
    }
    if (selection === "all" || selection.has("updated_at")) {
        titles.push(key14);
    }
    return titles;
  }

  const getValues = (): Element[][] => {
    let values: Element[][] = [];

    storagePlans.forEach((sp: StoragePlan, index: number) => {
        values[index] = [];
        let i = 0;
        
        if (selection === "all" || selection.has("order_number")) {
          const keyWord: string = "order_number";
          const value: string = sp.order_number ? sp.order_number : '';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("customer_order_number")) {
          const keyWord: string = "customer_order_number";
          const value: string = sp.customer_order_number;
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("user_id")) {
          const keyWord: string = "user_id";
          const value: string = sp.user ? sp.user.username : '';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("warehouse_id")) {
          const keyWord: string = "warehouse_id";
          const value: string = sp.warehouse ? (`${sp.warehouse.name} (${sp.warehouse.code})`) : '';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("box_amount")) {
          const keyWord: string = "box_amount";
          const value: string = sp.box_amount.toString();
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("number_of_boxes_stored")) {
          const keyWord: string = "number_of_boxes_stored";
          const value: string = sp.packing_list && sp.packing_list.length > 0 ? ((sp.packing_list.filter((pl: PackingList) => pl.package_shelf && pl.package_shelf.length > 0).length) - (sp.packing_list.filter((pl: PackingList) => pl.dispatched).length)).toString() : '0';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("location")) {
          const keyWord: string = "location";
          const value: string = getLocationPackages(sp, intl, true);
          values[index][i] = {
            keyWord,
            value,
            sp
          };
          i++;
        }
        if (selection === "all" || selection.has("dispatched_boxes")) {
          const keyWord: string = "dispatched_boxes";
          const value: string = sp.packing_list && sp.packing_list.length > 0
          ? sp.packing_list.filter((pl: PackingList) => pl.dispatched).length.toString()
          : "0";
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("evidence")) {
          const keyWord: string = "evidence";
          const value: string = sp.images ? (sp.images.length.toString()) : '0';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("reference_number")) {
          const keyWord: string = "reference_number";
          const value: string = sp.reference_number ? sp.reference_number: '';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("pr_number")) {
          const keyWord: string = "pr_number";
          const value: string = sp.pr_number ? sp.pr_number: '';
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("state")) {
          const keyWord: string = "state";
          const value: string = sp.rejected_boxes ? intl.formatMessage({ id: "rejected_boxes" }) : (sp.return ? intl.formatMessage({ id: "return" }) : intl.formatMessage({ id: "normal" }));
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("delivered_time")) {
          const keyWord: string = "delivered_time";
          const value: string = `${sp.delivered_time ? getDateFormat(sp.delivered_time) : ''} ${sp.delivered_time ? getHourFormat(sp.delivered_time) : ''}`;
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("observations")) {
          const keyWord: string = "observations";
          const value: string = sp.observations;
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("created_at")) {
          const keyWord: string = "created_at";
          const value: string = `${sp.created_at ? getDateFormat(sp.created_at) : ''} ${sp.created_at ? getHourFormat(sp.created_at) : ''}`;
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
        if (selection === "all" || selection.has("updated_at")) {
          const keyWord: string = "updated_at";
          const value: string = `${sp.updated_at ? getDateFormat(sp.updated_at) : ''} ${sp.updated_at ? getHourFormat(sp.updated_at) : ''}`;
          values[index][i] = {
            keyWord,
            value
          };
          i++;
        }
    });

    return values;
  }

  const getLocations = (value: string): string[] => {
    return value.split("\n\n");
  }

  return (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
          <Image src="https://dc0-bucket.oss-us-west-1.aliyuncs.com/8Y2QlTD9eyFgyWt773lwMUJXGN0xDNHT.png" style={styles.logo} />
  
          <Text style={styles.title}>{intl.formatMessage({ id: 'entry_plan_information' })}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
                {
                  getTitles().map((title: string, index: number) => (
                    <Text key={index} style={[styles.headerCell, styles.minorCell]}>{ title }</Text>
                  ))
                }
            </View>
            {
              getValues().map((elements: Element[], i: number) => (
                <View key={i} style={styles.tableRow}>
                    {
                        elements.map((element: Element, j: number) => (
                          <View key={j} style={[styles.tableCell, styles.minorCell]}>
                            {
                              element.keyWord !== "location" && (
                                <Text>{ element.value }</Text>
                              )
                            }
                            {
                              element.keyWord === "location" && (
                                getLocations(element.value).map((pos: string, k: number) => (
                                  <Text key={k} style={styles.locationCell}>{ pos }</Text>
                                ))
                              )
                            }
                          </View>
                        ))
                    }
                </View>
              ))
            }
          </View>
        </Page>
      </Document>
  );
};
export default ExportStoragePlansPDF;
