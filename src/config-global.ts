import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Minimal UI',
  appVersion: packageJson.version,
};

// ----------------------------------------------------------------------

export const Environment = {
  /**
       * Define a quantidade de linhas a ser carregada por padrão nas listagens. 
       */
  LIMITE_DE_LINHAS: 10,
  /**
   * Placeholder exibido nos inputs. 
   */
  INPUT_DE_BUSCA: 'Pesquisar...',
  /**
   * Texto exibido quando nenhum registro é encontrado nas listagens. 
   */
  LISTAGEM_VAZIA: 'Nenhum registro encontrado.',
  /**
   * Url base de consulta dos dados dessa aplicação. 
   */

  URL_BASE: 'https://n0isrx5qib.execute-api.us-east-1.amazonaws.com',

};
