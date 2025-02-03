import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PeopleView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Usuários - ${CONFIG.appName}`}</title>
      </Helmet>

      <PeopleView />

    </>
  );
}
