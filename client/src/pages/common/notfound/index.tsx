import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  credit: {
    marginTop: 5
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

interface INotFoundProps {}

const NotFound: React.FunctionComponent<INotFoundProps> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={4}>
        <Grid item lg={6} xs={12}>
          <div className={classes.content}>
            <Typography variant="h1">404: The page you are looking for isn’t here</Typography>
            <Typography className={classes.credit} variant="subtitle2">
              <a
                href="https://iconscout.com/illustrations/error"
                target="_blank"
                rel="noopener noreferrer">
                Error Illustration
              </a>{' '}
              by <a href="https://iconscout.com/contributors/pixel-true-designs">Pixel True</a> on{' '}
              <a href="https://iconscout.com">Iconscout</a>
            </Typography>
            <img alt="Under development" className={classes.image} src="/404.png" />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
