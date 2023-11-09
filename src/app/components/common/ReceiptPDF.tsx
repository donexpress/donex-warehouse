import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { StoragePlan, PackingList } from "../../../types/storage_plan";
import { PackageShelf } from "../../../types/package_shelf";
import { IntlShape } from 'react-intl';
import { getDateFromStr, getHourFromStr } from '../../../helpers';
import { getDateFormat, getHourFormat } from '../../../helpers/utils';

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

const ReceiptPDF = ({ storagePlan, intl }: Params) => {

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

  const getPackingListWithOperatorPicture = (packingListItems: PackingList[] | undefined): PackingList[] => {
    if (packingListItems !== undefined) {
      return packingListItems.filter((pl: PackingList) => !!pl.operator_picture);
    }
    return [];
  }

  const getSecureUrl = (url: string): string => {
    if (url.startsWith('http://')) {
      return `https://${url.slice(7)}`;
    }
    return url;
  };

  return (
    <Document>
        <Page size="A4" orientation='landscape' style={styles.page}>
          <Image src="https://dc0-bucket.oss-us-west-1.aliyuncs.com/8Y2QlTD9eyFgyWt773lwMUJXGN0xDNHT.png" style={styles.logo} />
  
          <Text style={styles.title}>{intl.formatMessage({ id: 'entry_plan_inventory' })}</Text>
          <Text style={styles.subtitle}>{intl.formatMessage({ id: 'entry_plan_data' })}</Text>
  
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'warehouse_order_number' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'customer_order_number' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'storage' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'number_of_boxes' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'dispatched_boxes' })}</Text>
              <Text style={[styles.headerCell]}>{intl.formatMessage({ id: 'pr_number' })}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{storagePlan.order_number ? storagePlan.order_number : ''}</Text>
              <Text style={styles.tableCell}>{ storagePlan.customer_order_number }</Text>
              <Text style={styles.tableCell}>{ storagePlan.warehouse ? (`${storagePlan.warehouse.name} (${storagePlan.warehouse.code})`) : '' }</Text>
              <Text style={styles.tableCell}>{ storagePlan.box_amount }</Text>
              <Text style={styles.tableCell}>{ 
                storagePlan.packing_list && storagePlan.packing_list.length > 0
                  ? (storagePlan.packing_list.filter((pl: PackingList) => pl.dispatched).length.toString())
                  : "0" 
                  }
              </Text>
              <Text style={styles.tableCell}>{ storagePlan.pr_number ? storagePlan.pr_number : '--' }</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>{intl.formatMessage({ id: 'packing_list' })}</Text>
  
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.headerCell, styles.majorCell]}>{intl.formatMessage({ id: 'box_number' })}</Text>
              <Text style={[styles.headerCell, styles.majorCell]}>{intl.formatMessage({ id: 'expansion_box_number' })}</Text>
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'location' })}</Text>
              {
                storagePlan && storagePlan.state === 'stocked' && (
                  <Text style={[styles.headerCell, styles.majorCell]}>{intl.formatMessage({ id: 'outgoing_order' })}</Text>
                )
              }
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'storage_time' })}</Text>
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'delivery_time' })}</Text>
              <Text style={[styles.headerCell, styles.minorCell]}>{intl.formatMessage({ id: 'dispatch_date' })}</Text>
            </View>
            {
              storagePlan.packing_list?.map((pl: PackingList, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.majorCell]}>{ pl.box_number }</Text>
                  <Text style={[styles.tableCell, styles.majorCell]}>{ pl.case_number }</Text>
                  <Text style={[styles.tableCell, styles.minorCell]}>{ packageShelfFormat(pl.package_shelf) }</Text>
                  {
                    storagePlan && storagePlan.state === 'stocked' && (
                      <Text style={[styles.tableCell, styles.majorCell]}>{ pl.output_plan_delivered_number ? pl.output_plan_delivered_number : '--' }</Text>
                    )
                  }
                  <Text style={[styles.tableCell, styles.minorCell]}>{ '--' }</Text>
                  <Text style={[styles.tableCell, styles.minorCell]}>{ storagePlan.delivered_time ? `${getDateFormat(storagePlan.delivered_time)}, ${getHourFormat(storagePlan.delivered_time)}` : '' }</Text>
                  <Text style={[styles.tableCell, styles.minorCell]}>{ pl.dispatched_time ? `${getDateFormat(pl.dispatched_time)}, ${getHourFormat(pl.dispatched_time)}` : '' }</Text>
                </View>
              ))
            }
          </View>
        </Page>

        {atLeastOneHasOperatorPicture(storagePlan.packing_list) &&
          <Page size="A4" orientation='landscape' style={styles.page}>
            <Text style={styles.subtitle}>{intl.formatMessage({ id: 'entry_plan_proof' })}</Text>
            {getPackingListWithOperatorPicture(storagePlan.packing_list).map((pl: PackingList, index) => (
              <Image
                key={index}
                src={getSecureUrl(pl.operator_picture ? pl.operator_picture : '')}
                style={styles.image}
              />
            ))
            }
          </Page>
        }
        
      </Document>
  );
};
export default ReceiptPDF;
