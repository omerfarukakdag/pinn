import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%'
  },
  title: {
    fontWeight: 700
  }
}));

interface ICounterProps {
  className?: string;
  title: string;
  value: number;
}

const Counter: React.FunctionComponent<ICounterProps> = (props) => {
  const { className, title, value, children, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body1">
              {title}
            </Typography>
            <Typography variant="h2">{value}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Counter;
