import { Environment } from "src/config-global";

import { Api } from "../api/index";

interface IPeople {
    id: string;
    name: string;
    display_name: string;
    about: string;
    types_id: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    peopleImages: unknown[];
}

interface Pagination {
    total: number;
    current_page: number;
    next_page: number | null;
    last_page: number;
    per_page: number;
    has_more_page: boolean;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: IPeople[],
    pagination: Pagination;
}

interface ApiResponseDetail {
    success: boolean;
    message: string;
    data: IPeople[];
    pagination: Pagination;
}

const getAll = async (filter: string, page = 1): Promise<ApiResponse | Error> => {
    try {
        const urlRelative = `/erp/private/people/peoples/v1?per_page=${Environment.LIMITE_DE_LINHAS}${page}&name=${filter}&include=peopleImages`;
        const { data } = await Api.get(urlRelative);
        return data;
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id: string): Promise<ApiResponseDetail | Error> => {
    try {
        const { data } = await Api.get(`/erp/private/people/peoples/v1/${id}`);

        if (data) {
            return data;
        }
        return new Error('Erro ao consultar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.')
    };
};

const create = async (dados: Omit<IPeople, 'id'>): Promise<string | Error> => {
    try {
        const { data } = await Api.post<IPeople>('/erp/private/people/peoples/v1', dados);

        if (data && data.id) {
            return String(data.id);
        }
        return new Error('Erro ao criar o registro.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao criar o registro.')
    }
};

const updateById = async (id: string, dados: IPeople): Promise<void | Error> => {
    try {

        await Api.put(`/erp/private/people/peoples/v1/${id}?include=peopleDocuments,peopleContacts`, dados);

    } catch (error) {
        console.error(error);
        console.error(new Error((error as { message: string }).message || 'Erro ao atualizar o registro.'));
    }
};

const deleteById = async (id: string): Promise<void | Error> => {
    try {
        await Api.delete(`/erp/private/people/peoples/v1/${id}`);
        return undefined;
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
};

export const PeopleService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};