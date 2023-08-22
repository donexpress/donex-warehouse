import { useIntl } from 'react-intl';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Selection,
    SortDescriptor
  } from "@nextui-org/react";
import { useRouter } from 'next/router';
import './../../../../styles/generic.input.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getUserLevels, removeUserLevelById } from '../../../../services/api.user_level';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { UserLevel, UserLevelListProps } from '../../../../types/user_levels';

import {PlusIcon} from "./../../common/PlusIcon";
import {VerticalDotsIcon} from "./../../common/VerticalDotsIcon";
import {SearchIcon} from "./../../common/SearchIcon";
import PaginationTable from '../../common/Pagination';

const UserLevelTable = ({ userLevelList }: UserLevelListProps) => {
    const intl = useIntl();
    const router = useRouter();
    const { locale } = router.query;
    const [userLevels, setUserLevels] = useState<UserLevel[]>([])
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [deleteElement, setDeleteElemtent] = useState<number>(-1)

    /** start*/
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    const [page, setPage] = useState(1);

    const columns = [
        {name: intl.formatMessage({ id: 'name' }), uid: "name", sortable: true},
        {name: intl.formatMessage({ id: 'designated_service' }), uid: "service_id", sortable: true},
        {name: intl.formatMessage({ id: 'actions' }), uid: "actions"},
    ];

    
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        return columns;
    }, []);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...userLevels];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase())
                || (user.service_id?.toString())?.toLowerCase()?.includes(filterValue.toLowerCase()),
            );
        }
        return filteredUsers;
    }, [userLevels, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: UserLevel, b: UserLevel) => {
        const first = a[sortDescriptor.column as keyof UserLevel] as number;
        const second = b[sortDescriptor.column as keyof UserLevel] as number;
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
        case "actions":
            return (
            <div className="relative flex justify-end items-center gap-2">
                <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    <DropdownItem onClick={() => handleShow(user['id'])}>View</DropdownItem>
                    <DropdownItem onClick={()=> handleEdit(user['id'])}>Edit</DropdownItem>
                    <DropdownItem onClick={()=> handleDelete(user['id'])}>Delete</DropdownItem>
                </DropdownMenu>
                </Dropdown>
            </div>
            );
        default:
            return cellValue;
        }
    }, []);

    const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
        setFilterValue(value);
        setPage(1);
        } else {
        setFilterValue("");
        }
    }, []);

    const onClear = useCallback(()=>{
        setFilterValue("")
        setPage(1)
    }, [])
    
    const topContent = React.useMemo(() => {
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
              <Input
                isClearable
                className="w-full sm:max-w-[33%] search-input"
                placeholder=""
                startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
              />
              <div className="flex gap-3">
                <Button color="primary" endContent={<PlusIcon />} onClick={() => handleAdd()}>
                    {intl.formatMessage({ id: 'create' })}
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">Total {userLevels.length} users</span>
              <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                  className="outline-none text-default-400 text-small m-1"
                  onChange={onRowsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </label>
            </div>
          </div>
        );
      }, [
        filterValue,
        statusFilter,
        onSearchChange,
        onRowsPerPageChange,
        userLevels.length,
        hasSearchFilter,
      ]);
    
      const bottomContent = React.useMemo(() => {
        return (
          <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-400">
              {selectedKeys === "all"
                ? "All items selected"
                : `${selectedKeys.size} of ${filteredItems.length} selected`}
            </span>
            <PaginationTable totalRecords={100} pageLimit={5} pageNeighbours={1} onPageChanged={() => { }} />
          </div>
        );
      }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
    /** end*/

    useEffect(() => {
        setUserLevels(userLevelList);
    }, [])

    const loadWarehouses = async () => {
        const pms = await getUserLevels();
        setUserLevels(pms ? pms : []);
    }

    const handleAdd = () => {
        router.push(`/${locale}/wms/user_levels/insert`)
    }

    const handleDelete = (id: number) => {
        setShowConfirm(true)
        setDeleteElemtent(id)
    }

    const handleEdit = (id: number) => {
        router.push(`/${locale}/wms/user_levels/${id}/update`)
    }

    const handleShow = (id: number) => {
        router.push(`/${locale}/wms/user_levels/${id}/show`)
    }

    const close = () => {
        setShowConfirm(false)
        setDeleteElemtent(-1)
    }

    const confirm = async() => {
        const reponse = await removeUserLevelById(deleteElement)
        close()
        await loadWarehouses()
    }

    return (
        <>
            <Table
                aria-label="USER-LEVEL"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
                >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid == "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No level found"} items={sortedItems}>
                    {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                    )}
                </TableBody>
            </Table>
            {showConfirm && (
                <ConfirmationDialog close={close} confirm={confirm} />
            )}
        </>
    )
}

export default UserLevelTable