import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { StoragePlan, PackingList } from "../../../types/storage_plan";
import { PackageShelf } from "../../../types/package_shelf";
import { IntlShape } from 'react-intl';
import { getDateFromStr, getHourFromStr } from '../../../helpers'
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
});

interface Params {
  storagePlans: StoragePlan[];
  intl: IntlShape;
  selection: Selection;
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
    const key7: string = intl.formatMessage({ id: 'evidence' });
    const key8: string = intl.formatMessage({ id: 'reference_number' });
    const key9: string = intl.formatMessage({ id: 'pr_number' });
    const key10: string = intl.formatMessage({ id: 'state' });
    const key11: string = intl.formatMessage({ id: 'delivery_time' });
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

  const getValues = (): string[][] => {
    let values: string[][] = [];

    storagePlans.forEach((sp: StoragePlan, index: number) => {
        values[index] = [];
        let i = 0;
        
        if (selection === "all" || selection.has("order_number")) {
          values[index][i] = sp.order_number ? sp.order_number : '';
          i++;
        }
        if (selection === "all" || selection.has("customer_order_number")) {
          values[index][i] = sp.customer_order_number;
          i++;
        }
        if (selection === "all" || selection.has("user_id")) {
          values[index][i] = sp.user ? sp.user.username : '';
          i++;
        }
        if (selection === "all" || selection.has("warehouse_id")) {
          values[index][i] = sp.warehouse ? (`${sp.warehouse.name} (${sp.warehouse.code})`) : '';
          i++;
        }
        if (selection === "all" || selection.has("box_amount")) {
          values[index][i] = sp.box_amount.toString();
          i++;
        }
        if (selection === "all" || selection.has("number_of_boxes_stored")) {
          values[index][i] = sp.packing_list && sp.packing_list.length > 0 ? (sp.packing_list.filter((pl: PackingList) => pl.package_shelf && pl.package_shelf.length > 0).length.toString()) : '0';
          i++;
        }
        if (selection === "all" || selection.has("evidence")) {
          values[index][i] = sp.images ? (sp.images.length.toString()) : '0';
          i++;
        }
        if (selection === "all" || selection.has("reference_number")) {
          values[index][i] = sp.reference_number ? sp.reference_number: '';
          i++;
        }
        if (selection === "all" || selection.has("pr_number")) {
          values[index][i] = sp.pr_number ? sp.pr_number: '';
          i++;
        }
        if (selection === "all" || selection.has("state")) {
          values[index][i] = sp.rejected_boxes ? intl.formatMessage({ id: "rejected_boxes" }) : (sp.return ? intl.formatMessage({ id: "return" }) : intl.formatMessage({ id: "normal" }));
          i++;
        }
        if (selection === "all" || selection.has("delivered_time")) {
          values[index][i] = `${sp.delivered_time ? getDateFormat(sp.delivered_time) : ''} ${sp.delivered_time ? getHourFormat(sp.delivered_time) : ''}`;
          i++;
        }
        if (selection === "all" || selection.has("observations")) {
          values[index][i] = sp.observations;
          i++;
        }
        if (selection === "all" || selection.has("created_at")) {
          values[index][i] = `${sp.created_at ? getDateFormat(sp.created_at) : ''} ${sp.created_at ? getHourFormat(sp.created_at) : ''}`;
          i++;
        }
        if (selection === "all" || selection.has("updated_at")) {
          values[index][i] = `${sp.updated_at ? getDateFormat(sp.updated_at) : ''} ${sp.updated_at ? getHourFormat(sp.updated_at) : ''}`;
          i++;
        }
    });

    return values;
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
              getValues().map((elements: string[], i: number) => (
                <View key={i} style={styles.tableRow}>
                    {
                        elements.map((element: string, j: number) => (
                            <Text key={j} style={[styles.tableCell, styles.minorCell]}>{ element }</Text>
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
