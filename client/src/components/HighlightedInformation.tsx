import React from 'react';
import classNames from 'classnames';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => ({
  main: {
    backgroundColor: theme.palette.warning.light,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius
  }
}));

interface IHighlighedInformationProps {
  className?: string;
}

const HighlighedInformation: React.FunctionComponent<IHighlighedInformationProps> = (props) => {
  const { className, children } = props;
  const classes = useStyles();

  return (
    <div className={classNames(classes.main, className ? className : null)}>
      <Typography variant="h6">{children}</Typography>
    </div>
  );
};

export default HighlighedInformation;
