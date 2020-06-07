import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core';
import App from './App';
import { AuthProvider } from './core/context/AuthProvider';
import theme from './theme/mui';
import * as serviceWorker from './serviceWorker';

import './theme/custom/index.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Index: React.FunctionComponent = (props) => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.unregister();
