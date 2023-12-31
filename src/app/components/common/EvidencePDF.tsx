import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { StoragePlan, PackingList } from "../../../types/storage_plan";
import { PackageShelf } from "../../../types/package_shelf";
import { IntlShape } from 'react-intl';
import { getDateFromStr, getHourFromStr } from '../../../helpers'

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
  storagePlan: StoragePlan;
  intl: IntlShape;
}

const EvidencePDF = ({ storagePlan, intl }: Params) => {

  const packageShelfFormat = (packageShelfs: PackageShelf[] | undefined) => {
    if (packageShelfs && (packageShelfs.length > 0)) {
      const packageShelf: PackageShelf = packageShelfs[0];
      return `${intl.formatMessage({ id: 'partition' })}: ${packageShelf.shelf?.partition_table}
      ${intl.formatMessage({ id: 'shelf' })}: ${packageShelf.shelf?.number_of_shelves}
      ${intl.formatMessage({ id: 'layer' })}: ${packageShelf.layer}
      ${intl.formatMessage({ id: 'column' })}: ${packageShelf.column}`;
    }
    return '';
  }
      
  const atLeastOneHasOperatorPicture = (packingListItems: PackingList[] | undefined): boolean => {
    if (packingListItems !== undefined) {
      return packingListItems.some((item) => (!!item.operator_picture));
    }
    return false;
  };

  const getSecureUrl = (url: string): string => {
    if (url.startsWith('http://')) {
      return `https://${url.slice(7)}`;
    }
    return url;
  };

  return (
    <Document>
        <Page size="A4" style={styles.page}>
          <Image src="https://dc0-bucket.oss-us-west-1.aliyuncs.com/8Y2QlTD9eyFgyWt773lwMUJXGN0xDNHT.png" style={styles.logo} />
  
          <Text style={styles.title}>{intl.formatMessage({ id: 'entry_plan_receipt' })}</Text>
          <Text style={styles.subtitle}>{intl.formatMessage({ id: 'entry_plan_data' })}</Text>
  
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'warehouse_order_number' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'customer_order_number' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'storage' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'number_of_boxes' })}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{storagePlan.order_number ? storagePlan.order_number : ''}</Text>
              <Text style={styles.tableCell}>{ storagePlan.customer_order_number }</Text>
              <Text style={styles.tableCell}>{ storagePlan.warehouse ? (`${storagePlan.warehouse.name} (${storagePlan.warehouse.code})`) : '' }</Text>
              <Text style={styles.tableCell}>{ storagePlan.box_amount }</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>{intl.formatMessage({ id: 'packing_list' })}</Text>
  
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.headerCell, styles.majorCell]}>{intl.formatMessage({ id: 'box_number' })}</Text>
              <Text style={[styles.headerCell, styles.majorCell]}>{intl.formatMessage({ id: 'expansion_box_number' })}</Text>
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'location' })}</Text>
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'storage_time' })}</Text>
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'delivery_time' })}</Text>
            </View>
            {
              storagePlan.packing_list?.map((pl: PackingList, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.majorCell]}>{ pl.box_number }</Text>
                  <Text style={[styles.tableCell, styles.majorCell]}>{ pl.case_number }</Text>
                  <Text style={[styles.tableCell, styles.minorCell]}>{ packageShelfFormat(pl.package_shelf) }</Text>
                  <Text style={[styles.tableCell, styles.minorCell]}>{ '--' }</Text>
                  <Text style={[styles.tableCell, styles.minorCell]}>{ getDateFromStr(storagePlan.delivered_time ? storagePlan.delivered_time : undefined) }{ ' ' }{ getHourFromStr(storagePlan.delivered_time ? storagePlan.delivered_time : undefined) }</Text>
                </View>
              ))
            }
          </View>
        </Page>

        {storagePlan.images && storagePlan.images.length !== 0 &&
          <Page size="A4" style={styles.page}>
            <Text style={styles.subtitle}>{intl.formatMessage({ id: 'evidence_generated' })}</Text>
            {storagePlan.images.map((image: string, index) => (
              <Image
                key={index}
                src={getSecureUrl(image)}
                style={styles.image}
              />
            ))
            }
          </Page>
        }
        
      </Document>
  );
};
export default EvidencePDF;