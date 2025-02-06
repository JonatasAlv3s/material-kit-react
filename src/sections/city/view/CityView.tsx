import type { ICity, ICities } from "src/repositories/erp/private/people/cities/Interface";

import { useState, useEffect, useCallback } from "react";

import { Box, Card, Table, TableBody, Typography, TableContainer, TablePagination } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { CityService } from "src/repositories/erp/private/people/cities/CityService";

import { Scrollbar } from "src/components/scrollbar";

import { TableNoData } from "src/sections/user/table-no-data";
import { UserTableRow } from "src/sections/user/user-table-row";
import { UserTableHead } from "src/sections/user/user-table-head";
import { UserTableToolbar } from "src/sections/user/user-table-toolbar";

export const CityPage = () => {
    const table = useTable();
    const [filterName, setFilterName] = useState('');
    const [cities, setCities] = useState<ICity[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<ICities['pagination'] | null>(null);
    const notFound = !loading && cities.length === 0;

    const fetchCities = useCallback(async () => {
        setLoading(true);

        const response = await CityService.getAll(table.page + 1, filterName);

        if (response instanceof Error) {
            console.error(response.message);
        } else {
            setCities(response.data);
            setPagination(response.pagination);
        }
        setLoading(false);
    }, [filterName, table.page]);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Cidades
                </Typography>
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
                                rowCount={cities.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        cities.map((city) => city.id)
                                    )
                                }
                                headLabel={[
                                    { id: 'id', label: 'ID' },
                                    { id: 'name', label: 'Cidade' },
                                    { id: 'states_id', label: 'ID do Estado' },
                                    { id: 'state', label: 'Estado' },
                                    { id: 'ibge', label: 'Código IBGE' },
                                    { id: 'slug', label: 'Slug' },
                                ]}
                            />
                            <TableBody>
                                {loading ? (
                                    <Typography align="center" sx={{ width: '100%', py: 2 }}>
                                        Carregando...
                                    </Typography>
                                ) : (
                                    cities.map((city) => (
                                        <UserTableRow
                                            key={city.id}
                                            row={{
                                                ...city,
                                                state: city.state
                                            }}
                                            selected={table.selected.includes(city.id)}
                                            onSelectRow={() => table.onSelectRow(city.id)}
                                            onEdit={() => {/* handle edit */ }}
                                            onDelete={() => {/* handle delete */ }}
                                        />
                                    ))
                                )}

                                {notFound && <TableNoData searchQuery={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={pagination ? pagination.current_page - 1 : 0}
                    count={pagination ? pagination.total : 0}
                    rowsPerPage={pagination ? pagination.per_page : table.rowsPerPage}
                    onPageChange={(_, newPage) => table.onChangePage(_, newPage)}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
        </DashboardContent>
    );
};

//-----------------------------------------------------------------------------------------------
export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback((id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    }, [order, orderBy]);

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        setSelected(checked ? newSelecteds : []);
    }, []);

    const onSelectRow = useCallback((id: string) => {
        setSelected((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((value) => value !== id)
                : [...prevSelected, id]
        );
    }, []);

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        onResetPage();
    }, [onResetPage]);

    return {
        page,
        order,
        orderBy,
        rowsPerPage,
        selected,
        onSort,
        onSelectRow,
        onSelectAllRows,
        onChangePage,
        onChangeRowsPerPage,
        onResetPage,
    };
}
