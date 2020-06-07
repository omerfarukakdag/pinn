import React from 'react';
import { protectedRoutes, sharedRoutes } from '../../core/routes';
import { Switch, Redirect, Route } from 'react-router-dom';
import * as PagePaths from '../../core/pagePaths';

interface IRoutesProps {}

const Routes: React.FunctionComponent<IRoutesProps> = (props) => {
  const routes = [...protectedRoutes, ...sharedRoutes];
  return (
    <Switch>
      <Redirect exact={true} from="/" to={PagePaths.Dashboard} />
      {routes &&
        routes.map((route, key) => {
          return (
            <Route
              key={key}
              exact={true}
              path={route.path}
              render={(routeProps) => {
                const componentProps = Object.assign({}, routeProps);
                return (
                  <route.layout>
                    <route.component {...componentProps} />
                  </route.layout>
                );
              }}
            />
          );
        })}
      <Redirect to={PagePaths.NotFound} />
    </Switch>
  );
};
export default Routes;
