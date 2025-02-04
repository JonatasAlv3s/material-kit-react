import { Api } from "../../../../../services/api/index";

import type { IPeople, ApiResponse, ApiResponseDetail } from "./Interface.js";


const getAll = async (filter: string, per_page: number = 5, page: number = 0): Promise<ApiResponse | Error> => {
    try {
        const urlRelative = `/erp/private/people/peoples/v1?per_page=${per_page}&name=${filter}&page=${page + 1}&include=peopleImages`;
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
        console.log("Enviando dados para API (create):", dados);
        const { data } = await Api.post<IPeople>('/erp/private/people/peoples/v1', dados);
        console.log("Resposta da API (create):", data);

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