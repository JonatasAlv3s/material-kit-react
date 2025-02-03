export interface IPeople {
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

export interface Pagination {
    total: number;
    current_page: number;
    next_page: number | null;
    last_page: number;
    per_page: number;
    has_more_pages: boolean;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: IPeople[];
    pagination: Pagination;
}

export interface ApiResponseDetail {
    success: boolean;
    message: string;
    data: IPeople;
    pagination: Pagination;
}