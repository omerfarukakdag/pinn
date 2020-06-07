import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface ThemeOptions {
    border: {
      borderColor: string;
      borderWidth: number;
    };
  }
}
