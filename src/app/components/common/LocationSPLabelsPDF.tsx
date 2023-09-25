import React from 'react';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { PackingList } from "../../../types/storage_plan";
import { PackageShelf } from "../../../types/package_shelf";
import { IntlShape } from 'react-intl';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 50,
    textAlign: 'left',
    width: '100%',
  },
  subtitle: {
    fontSize: 50,
    marginTop: 40,
    textAlign: 'left',
    width: '100%',
  },
});

interface Params {
  warehouseCode: string;
  orderNumber: string;
  packingLists: PackingList[];
  intl: IntlShape;
}

type LocationSPLabel = {
  location: string;
  partition: string;
  shelf: string;
  row: string;
  column: string;
}

const LocationSPLabelsPDF = ({ warehouseCode, orderNumber, packingLists, intl }: Params) => {

  const getLabelsFormat = (): LocationSPLabel[] => {
    const pls = packingLists.filter((pl) => (pl.package_shelf && (pl.package_shelf.length > 0)));
    
    const uniqueCombinationSet = new Set<string>();
    const uniqueArray: {
        partition_table: number;
        number_of_shelves: number;
        layer: number;
        column: number;
    }[] = [];

    for (const pl of pls) {
        const combinationKey = `${Number((pl.package_shelf as PackageShelf[])[0].shelf?.partition_table)}_${Number((pl.package_shelf as PackageShelf[])[0].shelf?.number_of_shelves)}_${(pl.package_shelf as PackageShelf[])[0].layer}_${(pl.package_shelf as PackageShelf[])[0].column}`;

        if (!uniqueCombinationSet.has(combinationKey)) {
            uniqueCombinationSet.add(combinationKey);

            uniqueArray.push({
                partition_table: Number((pl.package_shelf as PackageShelf[])[0].shelf?.partition_table),
                number_of_shelves: Number((pl.package_shelf as PackageShelf[])[0].shelf?.number_of_shelves),
                layer: (pl.package_shelf as PackageShelf[])[0].layer,
                column: (pl.package_shelf as PackageShelf[])[0].column,
            });
        }
    }

    const filteredArray = uniqueArray.filter((item) =>
        item.partition_table !== undefined &&
        item.number_of_shelves !== undefined
    );

    const sortedArray = filteredArray.sort((a, b) => {
        if (a.partition_table !== b.partition_table) {
            return a.partition_table - b.partition_table;
        } else if (a.number_of_shelves !== b.number_of_shelves) {
            return a.number_of_shelves - b.number_of_shelves;
        } else if (a.layer !== b.layer) {
            return a.layer - b.layer;
        } else {
            return a.column - b.column;
        }
    });

    let labels: LocationSPLabel[] = [];
    sortedArray.forEach((element) => {
        labels.push({
            location: `${warehouseCode}-${String(element.partition_table).padStart(2, '0')}-${String(element.number_of_shelves).padStart(2, '0')}-${String(element.layer).padStart(2, '0')}-${String(element.column).padStart(2, '0')}`,
            partition: `${intl.formatMessage({ id: 'partition' })}: ${element.partition_table}`,
            shelf: `${intl.formatMessage({ id: 'shelf' })}: ${element.number_of_shelves}`,
            row: `${intl.formatMessage({ id: 'layer' })}: ${element.layer}`,
            column: `${intl.formatMessage({ id: 'column' })}: ${element.column}`
        });
    })
    
    return labels;
  }

  return (
    <Document>
        {getLabelsFormat().map((lspl: LocationSPLabel, index: number) => (
            <Page key={index} size="A4" orientation='landscape' style={styles.page}>
              <Text style={styles.header}>{ orderNumber }</Text>
              <Text style={styles.title}>{ lspl.location }</Text>
              <Text style={styles.subtitle}>{ lspl.partition }</Text>
              <Text style={styles.subtitle}>{ lspl.shelf }</Text>
              <Text style={styles.subtitle}>{ lspl.row }</Text>
              <Text style={styles.subtitle}>{ lspl.column }</Text>
            </Page>
        ))}
        
    </Document>
  );
};
export default LocationSPLabelsPDF;