import axios from "axios";

// import { Environment } from "src/config-global";

import { ErrorInterceptor, ResponseInterceptor } from "./interceptors";



const Api = axios.create({
    baseURL: 'https://n0isrx5qib.execute-api.us-east-1.amazonaws.com',
    headers: {
        Authorization: `Bearer 4700|2HuI5vyLqs9j7lAJvgavTKCCMIkRwNpS6tXryQNR760d4443`,
        Accept: `application/json`,
    }
});

Api.interceptors.response.use(
    (response) => ResponseInterceptor(response),
    (error) => ErrorInterceptor(error),
);

export { Api };