import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CityPage } from 'src/sections/city/view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Cidades - ${CONFIG.appName}`}</title>
            </Helmet>

            <CityPage />

        </>
    );
}