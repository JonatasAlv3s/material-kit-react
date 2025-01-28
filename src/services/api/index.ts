import axios from "axios";

import { Environment } from "src/config-global";

import { ErrorInterceptor, ResponseInterceptor } from "./interceptors";



const Api = axios.create({
    baseURL: Environment.URL_BASE,
    headers: {
        Authorization: `Bearer ${(localStorage.getItem('APP_ACCESS_TOKEN') || '')}`,
        Accept: `application/json`,
    }
});

Api.interceptors.response.use(
    (response) => ResponseInterceptor(response),
    (error) => ErrorInterceptor(error),
);

export { Api };