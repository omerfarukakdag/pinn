import { createMuiTheme } from '@material-ui/core';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const borderWidth = 2;
const borderColor = 'rgba(0, 0, 0, 0.13)';

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  },
  border: {
    borderColor: borderColor,
    borderWidth: borderWidth
  }
});

export default theme;
