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
import { Guide, ManifestResponse } from "@/types/guideerege1992";
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
    "paid",
    "carrier"
];

const INITIAL_VISIBLE_COLUMNS_NOT_FOUND = [
    "tracking_number",
    "shipping_cost",
    "invoice_weight"
];

interface Params {
    close: () => any;
    content: ManifestResponse;
    title: string;
}

const ManifestTableDialog = ({ title, close, content }: Params) => {
    const intl = useIntl();
    const [loading, setLoading] = useState<boolean>(true);
    const [statusSelected, setStatusSelected] = useState<'repeated' | 'guides_not_found' | 'supplier_invoice'>('repeated');
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const filteredItems = React.useMemo(() => {
        let filteredGuides: Guide[] = [];
        if (statusSelected === 'repeated') {
            filteredGuides = [...content.manifest_charged]
        } else if (statusSelected === 'guides_not_found') {
            filteredGuides = [...content.unrecorded_manifests]
        }
        return filteredGuides;
    }, [content, statusSelected]);

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
                name: intl.formatMessage({ id: "invoice_weight" }),
                uid: "invoice_weight",
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
                    return cellValue ? cellValue : '';
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
        if (statusSelected === 'repeated' || statusSelected === 'guides_not_found') {
            manifestPaidDataToExcel(
                statusSelected === 'repeated' ? content.manifest_charged : content.unrecorded_manifests,
                intl,
                getVisibleColumns(),
                statusSelected === 'guides_not_found'
            );
        } else if (statusSelected === 'supplier_invoice' && content.manifests_bill_code && (content.manifests_bill_code.length > 0)) {
            window.open(content.manifests_bill_code[0].url, '_blank');
        }
    };

    const changeTab = (tab: 'repeated' | 'guides_not_found' | 'supplier_invoice') => {
        setStatusSelected(tab);
        if (tab === 'repeated') {
            setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS))
        } else if (tab === 'guides_not_found') {
            setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS_NOT_FOUND))
        }
    }

    const topContent = React.useMemo(() => {
        return (
            <div>
                <div style={{ width: '100%' }}>
                    <div className="bg-gray-200 pt-1">
                      <div className="overflow-x-auto tab-system-table bg-content1">
                        <ul className="flex space-x-4">
                              <li className="whitespace-nowrap">
                                <button className={ statusSelected === 'repeated' ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                                  onClick={() => changeTab('repeated')}
                                >
                                  {intl.formatMessage({ id: "repeated" })}
                                </button>
                              </li>
                              <li className="whitespace-nowrap">
                                <button className={ statusSelected === 'guides_not_found' ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                                  onClick={() => changeTab('guides_not_found')}
                                >
                                  {intl.formatMessage({ id: "guides_not_found" })}
                                </button>
                              </li>
                              <li className="whitespace-nowrap">
                                <button className={ statusSelected === 'supplier_invoice' ? "px-4 py-3 tab-selected" : "px-4 py-3 tab-default" }
                                  onClick={() => changeTab('supplier_invoice')}
                                >
                                  {intl.formatMessage({ id: "supplier_invoice" })}
                                </button>
                              </li>
                        </ul>
                      </div>
                    </div>
                </div>
                <div className="py-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="confirmation_card_header" style={{ color: '#aeb9e1' }}>
                        <div style={{ fontSize: 16 }}>
                            {statusSelected === 'repeated' && (
                                <strong>{title}</strong>
                            )}
                            {statusSelected === 'guides_not_found' && (
                                <strong>{intl.formatMessage({ id: "guides_not_found" })}</strong>
                            )}
                            {statusSelected === 'supplier_invoice' && (
                                <strong>{(content.manifests_bill_code && (content.manifests_bill_code.length > 0)) ? content.manifests_bill_code[0].name : ''}</strong>
                            )}
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
            </div>
        );
    }, [intl, statusSelected]);

    const bottomContent = React.useMemo(() => {
        return (
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: '5px' }}>
                <Button onClick={close} type="button" className="bg-secundary px-4">
                    {intl.formatMessage({ id: "close_modal" })}
                </Button>
            </div>
        );
    }, [close, intl]);

    return (
      <div>
        <div className="table_dialog">
            <div className="confirmation_card dialog-table-background-manifest">
                {topContent}
                <div style={{ 'display': (statusSelected === 'repeated' || statusSelected === 'guides_not_found') ? 'flex' : 'none' }}>
                    <Table
                        aria-label="GUIDE"
                        isHeaderSticky
                        classNames={{
                            base: "max-h-[420px] overflow-hidden",
                            table: "min-h-[250px]",
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
                            emptyContent={`${intl.formatMessage({ id: "there_are_no_items_to_display" })}`}
                            items={filteredItems}
                        >
                            {(item) => (
                                <TableRow key={item.id ? item.id : item.tracking_number}>
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {statusSelected === 'supplier_invoice' && (
                    <div style={{ height: '80px' }}></div>
                )}
                {bottomContent}
            </div>
        </div >
      </div>
    );
};
export default ManifestTableDialog;