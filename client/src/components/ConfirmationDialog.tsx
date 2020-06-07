import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import ButtonCircularProgress from './ButtonCircularProgress';

interface IConfirmationDialogEvents {
  onClose: () => void;
  onConfirm: () => void;
}

interface IConfirmationDialogProps extends IConfirmationDialogEvents {
  open: boolean;
  loading: boolean;
  title: string;
  content: React.ReactNode;
}

const ConfirmationDialog: React.FunctionComponent<IConfirmationDialogProps> = (props) => {
  const { open, loading, title, content, onClose, onConfirm } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        disableBackdropClick={loading}
        disableEscapeKeyDown={loading}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button color="secondary" onClick={onConfirm} variant="contained" disabled={loading}>
            Yes {loading && <ButtonCircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;
