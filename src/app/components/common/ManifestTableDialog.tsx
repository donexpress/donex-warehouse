import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Selection,
    SortDescriptor,
    Button,
} from "@nextui-org/react";
import { useIntl } from "react-intl";
import '../../../styles/generic.dialog.scss';
import { Guide } from "@/types/guideerege1992";
import { Loading } from "./Loading";
import { FaFileDownload } from "react-icons/fa";
import { manifestPaidDataToExcel } from "@/helperserege1992";

const INITIAL_VISIBLE_COLUMNS = [
    "waybill_id",
    "tracking_number",
    "weigth",
    "total_declare",
    "currency",
    "shipping_cost",
    "sale_price",
    "invoice_weight",
    "paid",
    "carrier"
];

interface Params {
    close: () => any;
    content: Guide[];
}

const ManifestTableDialog = ({ close, content }: Params) => {
    const intl = useIntl();
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const [page, setPage] = useState(1);

    const [guides, setGuides] = useState<Guide[]>(content);

    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "id",
        direction: "descending",
    });
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const filteredItems = React.useMemo(() => {
        let filteredGuides = [...guides];
        return filteredGuides;
    }, [guides]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [intl]);

    const getColumns = React.useMemo(() => {
        const columns = [
            { name: "ID", uid: "id", sortable: true },
            { name: intl.formatMessage({ id: "waybill_id" }), uid: "waybill_id", sortable: true },
            {
                name: intl.formatMessage({ id: "tracking_number" }),
                uid: "tracking_number",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "weigth" }),
                uid: "weigth",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "total_declare" }),
                uid: "total_declare",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "currency" }),
                uid: "currency",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "shipping_cost" }),
                uid: "shipping_cost",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "sale_price" }),
                uid: "sale_price",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "paid" }),
                uid: "paid",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "carrier" }),
                uid: "carrier",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "bag_code" }),
                uid: "bag_code",
                sortable: true,
            },
            {
                name: intl.formatMessage({ id: "clientReference" }),
                uid: "client_reference",
                sortable: true,
            },
            { name: intl.formatMessage({ id: "actions" }), uid: "actions" },
        ];

        return columns;
    }, [intl]);

    const renderCell = React.useCallback(
        (guide: any, columnKey: React.Key) => {
            const cellValue = guide[columnKey];
            switch (columnKey) {
                case "paid":
                    return (
                        cellValue ? "Pagados" : "No pagados"
                    );
                default:
                    return cellValue;
            }
        },
        [intl]
    );

    const headerColumns = React.useMemo(() => {
        const columns = getColumns;
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns, intl]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Guide, b: Guide) => {
            const first = a[sortDescriptor.column as keyof Guide] as number;
            const second = b[sortDescriptor.column as keyof Guide] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const getVisibleColumns = (): string[] => {
        const t = Array.from(visibleColumns) as string[];
        return t.filter((el) => el !== "actions");
    };

    const handleExportExcel = () => {
        manifestPaidDataToExcel(
            content,
            intl,
            getVisibleColumns()
        );
    };

    const topContent = React.useMemo(() => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                    className="upload_button_evidence"
                    onClick={() => handleExportExcel()}
                >
                    <span>
                        {intl.formatMessage({ id: "export" })}
                    </span>
                    <FaFileDownload style={{ fontSize: '16px', color: 'white' }} />
                </div>
            </div>
        );
    }, []);

    const bottomContent = React.useMemo(() => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={close} type="button" className="bg-secundary px-4">
                    {intl.formatMessage({ id: "cancel" })}
                </Button>
            </div>
        );
    }, []);

    return (
        <div className="table_dialog">
            <div className="confirmation_card dialog-table-background">
                <Table
                    aria-label="GUIDE"
                    topContent={topContent}
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
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

                        emptyContent={`${intl.formatMessage({ id: "no_results_found" })}`}
                        items={sortedItems}
                    >
                        {(item) => (
                            <TableRow key={item.waybill_id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div >
    );
};
export default ManifestTableDialog;