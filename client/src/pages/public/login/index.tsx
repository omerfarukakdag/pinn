import React from 'react';
import { useAuth } from '../../../core/context/AuthProvider';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme: any) => ({
  root: {
    overflow: 'auto'
  },
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing()
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const classes = useStyles();
  const { loginWithRedirect } = useAuth();

  return (
    <Container className={classes.root} maxWidth="xs">
      <div className={classes.paper}>
        <img alt="Logo" src="./logo-medium.png" />
        <div className={classes.form}>
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginWithRedirect}>
            Login
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Login;
