export interface IState {
    id: string;
    name: string;
    slug: string;
    initials: string;
}
export interface ICity {
    id: string;
    states_id: string;
    ibge: string;
    name: string;
    slug: string;
    state: IState;
}
export interface ICities {
    success: boolean;
    data: ICity[];
    pagination: {
        total: number;
        current_page: number;
        next_page: number;
        last_page: number;
        per_page: number;
        has_more_pages: boolean;

    }
}
