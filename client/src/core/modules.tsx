import { ComponentLoader } from './loadableBase';

const PublicRoute = ComponentLoader({
  loader: () => import(/* webpackChunkName: "PublicRoute" */ '../pages/public/Routes')
});

const ProtectedRoute = ComponentLoader({
  loader: () => import(/* webpackChunkName: "ProtectedRoute" */ '../pages/protected/Routes')
});

const ProtectedMaster = ComponentLoader({
  loader: () => import(/* webpackChunkName: "ProtectedMaster" */ '../pages/protected/Master')
});

const PublicMaster = ComponentLoader({
  loader: () => import(/* webpackChunkName: "PublicMaster" */ '../pages/public/Master')
});

const Dashboard = ComponentLoader({
  loader: () => import(/* webpackChunkName: "Dashboard" */ '../pages/protected/dashboard')
});

const Login = ComponentLoader({
  loader: () => import(/* webpackChunkName: "Login" */ '../pages/public/login')
});

const Logout = ComponentLoader({
  loader: () => import(/* webpackChunkName: "Logout" */ '../pages/protected/logout')
});

const NotFound = ComponentLoader({
  loader: () => import(/* webpackChunkName: "NotFound" */ '../pages/common/notfound')
});

export {
  PublicRoute,
  ProtectedRoute,
  Dashboard,
  Login,
  Logout,
  ProtectedMaster,
  PublicMaster,
  NotFound
};
