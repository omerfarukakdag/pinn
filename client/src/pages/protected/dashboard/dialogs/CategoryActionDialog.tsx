import React, { useState, Fragment, useEffect } from 'react';
import { TextField, Button, makeStyles, Theme } from '@material-ui/core';
import FormDialog from '../../../../components/FormDialog';
import ButtonCircularProgress from '../../../../components/ButtonCircularProgress';
import { IResponse, ICategory } from '../../../../core/interfaces';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 300
  }
}));

interface ICategoryActionDialogEvents {
  onClose: () => void;
  onCategoryAction: (category: ICategory) => Promise<IResponse>;
}

interface ICategoryActionDialogProps extends ICategoryActionDialogEvents {
  dialogTitle: string;
  actionButtonText: string;
  open: boolean;
  category: ICategory;
}

const CategoryActionDialog: React.FunctionComponent<ICategoryActionDialogProps> = (props) => {
  const { actionButtonText, dialogTitle, onClose, open, category, onCategoryAction } = props;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<ICategory>(category);

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    setItem(category);
  }, [category]);

  const onFormSubmitted = async () => {
    try {
      setLoading(true);
      const response = await onCategoryAction(item);

      if (response.success) {
        enqueueSnackbar('Success', {
          variant: 'success'
        });
      } else {
        enqueueSnackbar(JSON.stringify(response.result), {
          variant: 'error'
        });
      }
    } catch (error) {
      enqueueSnackbar(JSON.stringify(error.message), { variant: 'error' });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const dialogContent = (
    <Fragment>
      <div className={classes.root}>
        <TextField
          variant="outlined"
          margin="normal"
          required={true}
          fullWidth={true}
          label="Name"
          autoFocus={true}
          autoComplete="off"
          value={item.name}
          type="text"
          onChange={(event) => {
            setItem({ ...item, name: event.target.value });
          }}
          FormHelperTextProps={{ error: true }}
        />
      </div>
    </Fragment>
  );

  return (
    <React.Fragment>
      <FormDialog
        loading={loading}
        onClose={onClose}
        open={open}
        headline={dialogTitle}
        onFormSubmit={(e) => {
          e.preventDefault();
          onFormSubmitted();
        }}
        content={dialogContent}
        actions={
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            size="medium"
            color="secondary"
            disabled={loading}>
            {actionButtonText}
            {loading && <ButtonCircularProgress />}
          </Button>
        }
      />
    </React.Fragment>
  );
};

export default CategoryActionDialog;
