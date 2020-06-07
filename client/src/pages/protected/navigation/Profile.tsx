import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';
import { useAuth } from '../../../core/context/AuthProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 30,
    height: 30
  },
  name: {
    marginLeft: theme.spacing(1),
    color: theme.palette.common.white
  }
}));

interface IProfileProps {
  className?: string;
  [key: string]: any;
}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const { className, children, ...rest } = props;

  const classes = useStyles();
  const { user } = useAuth();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar alt="Person" className={classes.avatar} src={user.picture} />
      <Typography className={classes.name} variant="h5">
        {user.name}
      </Typography>
    </div>
  );
};

export default Profile;
