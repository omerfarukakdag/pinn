import React from 'react';
import { CircularProgress, Box, Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  circularProgress: {
    color: theme.palette.secondary.main
  }
}));

interface IButtonCircularProgressProps {
  size?: number;
}

const ButtonCircularProgress: React.FunctionComponent<IButtonCircularProgressProps> = (props) => {
  const { size } = props;
  const classes = useStyles();

  return (
    <Box color="secondary.main" pl={1.5} display="flex">
      <CircularProgress
        size={size ? size : 24}
        thickness={size ? (size / 5) * 24 : 5}
        className={classes.circularProgress}
      />
    </Box>
  );
};

export default ButtonCircularProgress;
