import * as Modules from './modules';
import { IRoute } from './interfaces';
import * as PagePaths from './pagePaths';

const publicRoutes: IRoute[] = [
  {
    path: PagePaths.Login,
    menuKey: 'login',
    component: Modules.Login,
    layout: Modules.PublicMaster
  }
];

const protectedRoutes: IRoute[] = [
  {
    path: PagePaths.Dashboard,
    menuKey: 'dashboard',
    component: Modules.Dashboard,
    layout: Modules.ProtectedMaster
  },
  {
    path: PagePaths.Logout,
    menuKey: 'logout',
    component: Modules.Logout,
    layout: Modules.ProtectedMaster
  }
];

const sharedRoutes: IRoute[] = [
  {
    path: PagePaths.NotFound,
    menuKey: 'notfound',
    component: Modules.NotFound,
    layout: Modules.PublicMaster
  }
];

export { publicRoutes, protectedRoutes, sharedRoutes };
