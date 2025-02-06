import { Api } from "src/services/api";

import type { ICity, ICities } from "./Interface";



const getAll = async (page: number = 1, filter: string = ''): Promise<ICities | Error> => {
    try {

        const per_page = 10;
        const urlRelativa = `/erp/private/people/cities/v1?per_page=${per_page}&page=${page}&search=${filter}&include=state`;
        const { data } = await Api.get(urlRelativa);

        return data;

    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id: number): Promise<ICity | Error> => {

    try {

        const { data } = await Api.get<ICity>(`/cities/${id}`);
        return data;

    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
};

export const CityService = {
    getAll,
    getById,
};