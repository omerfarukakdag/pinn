import React, { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Profile from './Profile';
import { AppBar, Toolbar, Button, Theme } from '@material-ui/core';
import ExitToApp from '@material-ui/icons/ExitToApp';
import * as PagePaths from '../../../core/pagePaths';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  icon: {
    color: theme.palette.common.white,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center'
  },
  link: {
    '& a': {
      width: 35,
      minWidth: 'inherit',
      marginLeft: theme.spacing(1)
    }
  }
}));

interface ITopbarEvents {}

interface ITopbarProps extends ITopbarEvents {
  className?: string;
}

const ButtonWrapper: React.FunctionComponent<any> = ({ children, ...rest }) => {
  return <Button {...rest}>{children}</Button>;
};

const CustomRouterLink = forwardRef((props: any, ref: any) => {
  const classes = useStyles();
  return (
    <div ref={ref} className={classes.link}>
      <RouterLink {...props} />
    </div>
  );
});

const Topbar: React.FunctionComponent<ITopbarProps> = (props) => {
  const { className, children, ...rest } = props;
  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/">
          <img alt="Logo" src="./logo.png" />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Profile />
        <ButtonWrapper component={CustomRouterLink} to={PagePaths.Logout}>
          <div className={classes.icon}>
            <ExitToApp />
          </div>
        </ButtonWrapper>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
