import React from 'react';
import { Backdrop, Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1200,
    position: 'fixed',
    touchAction: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  }
}));

interface IModalBackdropProps {
  open: boolean;
}

const ModalBackdrop: React.FunctionComponent<IModalBackdropProps> = (props) => {
  const { open, children } = props;
  const classes = useStyles();

  return (
    <Backdrop open={open} className={classes.backdrop}>
      {children}
    </Backdrop>
  );
};
export default ModalBackdrop;
