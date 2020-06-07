import React from 'react';
import { makeStyles } from '@material-ui/core';
import { SharedContextProvider } from '../../core/context/SharedContextProvider';
import { SnackbarProvider } from 'notistack';
import Pace from '../../components/Pace';
import clsx from 'clsx';
import palette from '../../theme/mui/palette';
import Topbar from './navigation/Topbar';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: '100%'
  },
  content: {
    height: '100%',
    overflow: 'hidden'
  }
}));

interface IMainProps {}

const Master: React.FunctionComponent<IMainProps> = (props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <div className={clsx({ [classes.root]: true })}>
      <Topbar />
      <main className={classes.content}>
        <Pace color={palette.primary.light} />
        <SharedContextProvider>
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}>
            {children}
          </SnackbarProvider>
        </SharedContextProvider>
      </main>
    </div>
  );
};

export default Master;
