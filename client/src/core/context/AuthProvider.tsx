import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client, {
  Auth0ClientOptions,
  Auth0Client,
  IdToken,
  RedirectLoginOptions,
  GetTokenSilentlyOptions,
  GetIdTokenClaimsOptions,
  GetTokenWithPopupOptions,
  PopupConfigOptions,
  LogoutOptions,
  PopupLoginOptions
} from '@auth0/auth0-spa-js';
import { browserHistory } from '../utils';
import { clientOptions } from '../config';

interface IAuth0Context {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: boolean;
  idToken: string;
  loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
  getIdTokenClaims: (options?: GetIdTokenClaimsOptions) => Promise<IdToken>;
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<any>;
  getTokenWithPopup: (
    options?: GetTokenWithPopupOptions,
    config?: PopupConfigOptions
  ) => Promise<string>;
  logout: (options?: LogoutOptions) => void;
}

const DEFAULT_REDIRECT_CALLBACK = (appState: any) => {
  window.history.replaceState({}, document.title, window.location.pathname);
  browserHistory.push(
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
  );
};

const contextDefaultValue: IAuth0Context = {
  isAuthenticated: false,
  user: undefined,
  loading: false,
  popupOpen: false,
  idToken: '',
  loginWithPopup: () => Promise.resolve(),
  handleRedirectCallback: () => Promise.resolve(),
  getIdTokenClaims: () => Promise.resolve(Object.assign({})),
  getTokenSilently: () => Promise.resolve(Object.assign({})),
  getTokenWithPopup: () => Promise.resolve(''),
  loginWithRedirect: () => Promise.resolve(),
  logout: () => {}
};

const Auth0Context = React.createContext<IAuth0Context>(contextDefaultValue);
const useAuth = () => useContext(Auth0Context);

interface IAuthProviderEvents {
  onRedirectCallback?: (params: any) => void;
}

interface IAuthProviderProps extends IAuthProviderEvents {
  options?: Auth0ClientOptions;
}

const AuthProvider: React.FunctionComponent<IAuthProviderProps> = (props) => {
  const {
    children,
    options = clientOptions,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK
  } = props;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>();
  const [auth0Client, setAuth0] = useState<Auth0Client>(Object.assign({}));
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [idToken, setIdToken] = useState('');

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const auth0FromHook = await createAuth0Client(options);
        setAuth0(auth0FromHook);

        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
          const { appState } = await auth0FromHook.handleRedirectCallback();
          onRedirectCallback(appState);
        }

        const isAuthenticated = await auth0FromHook.isAuthenticated();

        setIsAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const user = await auth0FromHook.getUser();
          setUser(user);

          const claims = await auth0FromHook.getIdTokenClaims();
          setIdToken(claims.__raw);
        }
      } catch (error) {
        console.log('AuthProvider error:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth0();
  }, []);

  const loginWithPopup = async (options?: PopupLoginOptions, config?: PopupConfigOptions) => {
    try {
      setPopupOpen(true);
      await auth0Client.loginWithPopup(options, config);
      const user = await auth0Client.getUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
  };

  const handleRedirectCallback = async () => {
    try {
      setLoading(true);
      await auth0Client.handleRedirectCallback();
      const user = await auth0Client.getUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        idToken,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (options?: GetIdTokenClaimsOptions) =>
          auth0Client.getIdTokenClaims(options),
        loginWithRedirect: (options?: RedirectLoginOptions) =>
          auth0Client.loginWithRedirect(options),
        getTokenSilently: (options?: GetTokenSilentlyOptions) =>
          auth0Client.getTokenSilently(options),
        getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) =>
          auth0Client.getTokenWithPopup(options, config),
        logout: (options?: LogoutOptions) => {
          setLoading(true);
          auth0Client.logout(options);
          setIdToken('');
          setLoading(false);
        }
      }}>
      {children}
    </Auth0Context.Provider>
  );
};

export { AuthProvider, Auth0Context, useAuth };
