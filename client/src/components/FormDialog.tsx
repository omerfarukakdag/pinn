import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Theme,
  makeStyles,
  PaperProps,
  Paper
} from '@material-ui/core';
import DialogTitleWithCloseIcon from './DialogTitleWithCloseIcon';
import Draggable from 'react-draggable';

const useStyles = makeStyles((theme: Theme) => ({
  dialogPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing(3),
    maxWidth: (props: IFormDialogProps) => props.styleOptions?.maxWidth || 420
  },
  actions: {
    marginTop: theme.spacing(2)
  },
  dialogPaperScrollPaper: {
    maxHeight: 'none'
  },
  dialogContent: {
    paddingTop: 0,
    paddingBottom: 0
  }
}));

interface IFormDialogEvents {
  onClose: () => void;
  onFormSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

interface IFormDialogProps extends IFormDialogEvents {
  open: boolean;
  headline?: string;
  loading?: boolean;
  content: ReactNode;
  actions?: ReactNode;
  hideBackdrop?: boolean;
  styleOptions?: {
    maxWidth?: number;
  };
}

const PaperComponent = (props: PaperProps) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const FormDialog: React.FunctionComponent<IFormDialogProps> = (props) => {
  const { open, loading, headline, onClose, onFormSubmit, content, actions, hideBackdrop } = props;
  const classes = useStyles(props);

  return (
    <Dialog
      open={open}
      closeAfterTransition={true}
      onClose={onClose}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
      classes={{
        paper: classes.dialogPaper,
        paperScrollPaper: classes.dialogPaperScrollPaper
      }}
      PaperComponent={PaperComponent}
      keepMounted={false}
      hideBackdrop={hideBackdrop}
      aria-labelledby="draggable-dialog-title">
      <DialogTitleWithCloseIcon
        id={'draggable-dialog-title'}
        title={headline}
        onClose={onClose}
        disabled={loading}
        style={{ cursor: 'move' }}
      />
      <DialogContent className={classes.dialogContent}>
        <form onSubmit={onFormSubmit}>
          <div>{content}</div>
          <Box width="100%" className={classes.actions}>
            {actions}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
