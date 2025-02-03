import type { IPeople, Pagination } from 'src/repositories/erp/private/people/peoples/Interface';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { applyFilter, getComparator } from '../utils';
import { UserTableToolbar } from '../user-table-toolbar';
import { PeopleService } from '../../../repositories/erp/private/people/peoples/PeopleService';


// ----------------------------------------------------------------------

export function PeopleView() {
    const table = useTable();
    const [filterName, setFilterName] = useState('');
    const [user, setUsers] = useState<IPeople[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            const response = await PeopleService.getAll(filterName, table.rowsPerPage, table.page);

            if (response instanceof Error) {
                console.error(response.message);
            } else {
                setUsers(response.data);
                setPagination(response.pagination);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [filterName, table.rowsPerPage, table.page]);

    const handleAddUser = () => {
        navigate(`/add-user`);
    };

    const dataFiltered: IPeople[] = applyFilter({
        inputData: user,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
    });


    const notFound = !dataFiltered.length && !!filterName;


    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Usuários
                </Typography>
                <Button onClick={handleAddUser} variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
                    Novo usuário
                </Button>
            </Box>

            <Card>
                <UserTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterName(event.target.value);
                        table.onResetPage();
                    }}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={user.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(checked, user.map((u) => u.id).filter((id): id is string => id !== undefined))
                                }
                                headLabel={[
                                    { id: 'name', label: 'Nome' },
                                    { id: 'display_name', label: 'Display Name' },
                                    { id: 'about', label: 'Sobre' },
                                    { id: 'is_public', label: 'Public', align: 'center' },
                                    { id: 'created_at', label: 'Criado em' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {loading ? (
                                    <Typography align="center" sx={{ width: '100%', py: 2 }}>
                                        Loading...
                                    </Typography>
                                ) : (
                                    dataFiltered
                                        .slice(0, 10)
                                        .map((row) => (
                                            <UserTableRow
                                                key={row.id}
                                                row={row}
                                                selected={row.id ? table.selected.includes(row.id) : false}
                                                onSelectRow={() => row.id && table.onSelectRow(row.id)}
                                                onEdit={() => console.log(`Edit user ${row.id}`)}
                                                onDelete={() => console.log(`Delete user ${row.id}`)}
                                            />
                                        ))
                                )}

                                {/* <TableEmptyRows height={68} emptyRows={emptyRows(table.page, table.rowsPerPage, user.length)} /> */}

                                {notFound && <TableNoData searchQuery={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={table.page}
                    count={pagination?.total ? pagination.total : 0}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
        </DashboardContent>
    );
}
// ----------------------------------------------------------------------

export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback((inputValue: string) => {
        const newSelected = selected.includes(inputValue)
            ? selected.filter((value) => value !== inputValue)
            : [...selected, inputValue];
        setSelected(newSelected);
    }, [selected]);

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        onResetPage();
    }, [onResetPage]);

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
    };
}
