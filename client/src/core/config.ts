import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

const apiId = 'owm1wq6o4m';
const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;

const clientOptions: Auth0ClientOptions = {
  domain: 'akdag.auth0.com',
  client_id: '5LuTxF8KtFJYkAcqDq7zCCRLPn0kXVOy',
  callbackUrl: 'http://localhost:3000',
  cacheLocation: 'localstorage',
  redirect_uri: 'http://localhost:3000'
};

export { clientOptions, apiEndpoint };
