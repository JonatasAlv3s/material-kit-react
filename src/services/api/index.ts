import axios from "axios";

// import { Environment } from "src/config-global";

import { ErrorInterceptor, ResponseInterceptor } from "./interceptors";



const Api = axios.create({
    baseURL: 'https://n0isrx5qib.execute-api.us-east-1.amazonaws.com',
    headers: {
        Authorization: `Bearer 4675|OjVWbZhGRksO25sH2lJnt1MLWtzOPV4lDF6oq4iXfe5361e5`,
        Accept: `application/json`,
    }
});

Api.interceptors.response.use(
    (response) => ResponseInterceptor(response),
    (error) => ErrorInterceptor(error),
);

export { Api };