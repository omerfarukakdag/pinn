import React from 'react';
import { CircularProgress } from '@material-ui/core';
import * as Modules from './core/modules';
import ModalBackdrop from './components/ModalBackdrop';
import { useAuth } from './core/context/AuthProvider';
import { browserHistory } from './core/utils';
import { Router } from 'react-router-dom';

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <ModalBackdrop open={loading}>
        <CircularProgress color="primary" />
      </ModalBackdrop>
    );
  }

  return (
    <Router history={browserHistory}>
      {isAuthenticated ? <Modules.ProtectedRoute /> : <Modules.PublicRoute />}
    </Router>
  );
};

export default App;
