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
    "weight",
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
    title: string;
}

const ManifestTableDialog = ({ title, close, content }: Params) => {
    const intl = useIntl();
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const filteredItems = React.useMemo(() => {
        let filteredGuides = [...content];
        return filteredGuides;
    }, [content]);

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
                name: intl.formatMessage({ id: "weight" }),
                uid: "weight",
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
                        cellValue ? intl.formatMessage({ id: "paid" }) : intl.formatMessage({ id: "no_paid" })
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
    }, [getColumns, visibleColumns]);

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="confirmation_card_header" style={{ color: '#aeb9e1' }}>
                    <div style={{ fontSize: 16 }}>
                        <strong>{title}</strong>
                    </div>
                </div>
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
    }, [intl]);

    const bottomContent = React.useMemo(() => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={close} type="button" className="bg-secundary px-4">
                    {intl.formatMessage({ id: "cancel" })}
                </Button>
            </div>
        );
    }, [close, intl]);

    return (
        <div className="table_dialog">
            <div className="confirmation_card dialog-table-background">
                <div>
                    <Table
                        aria-label="GUIDE"
                        isHeaderSticky
                        topContentPlacement="outside"
                        topContent={topContent}
                        bottomContentPlacement="outside"
                        bottomContent={bottomContent}
                        classNames={{
                            base: "max-h-[420px] overflow-hidden",
                            table: "min-h-[420px]",
                        }}
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
                            className="table-manifest-body"
                            emptyContent={`${intl.formatMessage({ id: "no_results_found" })}`}
                            items={filteredItems}
                        >
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div >
    );
};
export default ManifestTableDialog;