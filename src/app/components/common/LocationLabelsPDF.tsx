import React from 'react';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { Warehouse } from "../../../types/warehouse";
import { ShelfConfig, Shelf } from "../../../types/shelf";
import { IntlShape } from 'react-intl';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 60,
    textAlign: 'left',
    width: '100%',
  },
  subtitle: {
    fontSize: 60,
    marginTop: 40,
    textAlign: 'left',
    width: '100%',
  },
});

interface Params {
  warehouse: Warehouse;
  shelfs: ShelfConfig[] | Shelf[];
  intl: IntlShape;
}

type LocationLabel = {
  shelf_code: string;
  location_code: string;
  row: string;
  column: string;
}

const LocationLabelsPDF = ({ warehouse, shelfs, intl }: Params) => {

  const getLabelsFormat = (): LocationLabel[] => {
    let labels: LocationLabel[] = [];
    for (let i = 0; i < shelfs.length; i++) {
        const shelf = shelfs[i];
        for (let row = 1; row <= shelf.layers; row++) {
            for (let column = 1; column <= shelf.column_ammount; column++) {
                labels.push({
                    shelf_code: `${warehouse.code}${String(shelf.partition_table).padStart(2, '0')}${String(shelf.number_of_shelves).padStart(2, '0')}`,
                    location_code: `${warehouse.code}-${String(shelf.partition_table).padStart(2, '0')}-${String(shelf.number_of_shelves).padStart(2, '0')}-${String(row).padStart(2, '0')}-${String(column).padStart(2, '0')}`,
                    row: `${intl.formatMessage({ id: 'layer' })}: ${row}`,
                    column: `${intl.formatMessage({ id: 'column' })}: ${column}`
                })
            }
        }
    }
    return labels;
  }

  return (
    <Document>
        {getLabelsFormat().map((ll: LocationLabel, index: number) => (
            <Page key={index} size="A4" orientation='landscape' style={styles.page}>
              <Text style={styles.title}>{ ll.shelf_code }</Text>
              <Text style={styles.subtitle}>{ ll.location_code }</Text>
              <Text style={styles.subtitle}>{ ll.row }</Text>
              <Text style={styles.subtitle}>{ ll.column }</Text>
            </Page>
        ))}
        
    </Document>
  );
};
export default LocationLabelsPDF;