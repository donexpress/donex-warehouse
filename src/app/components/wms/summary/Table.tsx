import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { getDateFormat, getHourFormat } from "../../../../helpers/utils";
import { useIntl } from "react-intl";
import "../../../../styles/wms/user.table.scss";
import "./../../../../styles/generic.input.scss";
import { Loading } from "../../common/Loading";
import { Summary } from "@/types/summaryerege1992";
import { getSummary } from "@/services/api.summaryerege1992";

const SummaryTable = () => {
  const intl = useIntl();
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);

  const [page, setPage] = useState(1);

  const getColumns = React.useMemo(() => {
    const columns = [
      { name: intl.formatMessage({ id: "waybill_id" }), uid: "MWB", sortable: true },
      {
        name: intl.formatMessage({ id: "quantity_package" }),
        uid: "quantity_package",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "quantity_kilograms" }),
        uid: "quantity_kilograms",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "quantity_shipping_cost" }),
        uid: "quantity_shipping_cost",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "quantity_sale_price" }),
        uid: "quantity_sale_price",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "earnings" }),
        uid: "earnings",
        sortable: true,
      },
      {
        name: intl.formatMessage({ id: "date" }),
        uid: "created_at",
        sortable: true,
      },
      // { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
    ];

    return columns;
  }, [intl]);

  const headerColumns = React.useMemo(() => {
    const columns = getColumns;
    return columns;
  }, [getColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredsummary = [...summary];
    return filteredsummary;
  }, [summary]);

  const renderCell = React.useCallback(
    (summary: any, columnKey: React.Key) => {
      const cellValue = summary[columnKey];
      switch (columnKey) {
        case "created_at":
          return cellValue !== null ? (<span>{getDateFormat(cellValue)}, {getHourFormat(cellValue)}</span>) : '';
        default:
          return cellValue;
      }
    },
    []
  );

  useEffect(() => {
    loadsummary();
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [intl]);

  const loadsummary = async () => {
    setLoading(true);
    const _summary = await getSummary(1, 25);
    setSummary(_summary);
    setLoading(false);
  };

  return (
    <>
      <Loading loading={loading}>
        <Table
          aria-label="SUMMARY"
          isHeaderSticky
          classNames={{
            wrapper: "max-h-[auto]",
          }}
          selectionMode="none"
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={`${loadingItems ? intl.formatMessage({ id: "loading_items" }) : intl.formatMessage({ id: "no_results_found" })}`}
            items={loadingItems ? [] : filteredItems}
          >
            {(item) => (
              <TableRow key={item.MWB}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Loading>
    </>
  );
};
export default SummaryTable;
