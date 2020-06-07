import React, { useState, Fragment, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  makeStyles,
  Theme,
  FormHelperText,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import FormDialog from '../../../../components/FormDialog';
import ButtonCircularProgress from '../../../../components/ButtonCircularProgress';
import { IBookmark, IResponse, ICategory } from '../../../../core/interfaces';
import { useSnackbar } from 'notistack';
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme: Theme) => ({
  dropzone: {
    height: 130,
    minHeight: 'inherit'
  }
}));

interface IBookmarkActionDialogEvents {
  onClose: () => void;
  onBookmarkAction: (
    bookmark: IBookmark,
    hasAttachment: boolean,
    attachmentFile?: File
  ) => Promise<IResponse>;
}

interface IBookmarkActionDialogProps extends IBookmarkActionDialogEvents {
  dialogTitle: string;
  actionType?: 'add' | 'update';
  actionButtonText: string;
  open: boolean;
  bookmark: IBookmark;
  categories: ICategory[];
}

const BookmarkActionDialog: React.FunctionComponent<IBookmarkActionDialogProps> = (props) => {
  const {
    actionType,
    actionButtonText,
    dialogTitle,
    onClose,
    open,
    bookmark,
    categories,
    onBookmarkAction
  } = props;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(bookmark);
  const [categoryError, setCategoryError] = useState(false);
  const [attachmentError, setAttachmentError] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(Boolean(item.attachmentUrl));
  const [attachmentFile, setAttachmentFile] = useState<File>();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    setItem(bookmark);
  }, [bookmark]);

  useEffect(() => {
    setAttachmentError(false);
    setCategoryError(false);

    if (actionType !== 'add') {
      setHasAttachment(Boolean(item.attachmentUrl));
    }
  }, [item, actionType]);

  const onFormSubmitted = async () => {
    try {
      setLoading(true);
      const response = await onBookmarkAction(item, hasAttachment, attachmentFile);

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

  const onBookmarkAttachmentDrop = (
    files: File[],
    event: React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement> | DragEvent | Event
  ) => {
    setAttachmentFile(files[0]);
    setAttachmentError(false);
  };

  const dialogContent = (
    <Fragment>
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
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        label="Url"
        autoComplete="off"
        type="url"
        value={item.url}
        onChange={(event) => {
          setItem({ ...item, url: event.target.value });
        }}
        FormHelperTextProps={{ error: true }}
      />
      <FormControl
        margin={'normal'}
        fullWidth={true}
        required={true}
        error={categoryError}
        variant="outlined">
        <InputLabel id="categoryLabelId">Category</InputLabel>
        <Select
          required={true}
          fullWidth={true}
          labelId="categoryLabelId"
          id="categorySelectId"
          value={item.categoryId}
          onChange={(event) => {
            setItem({ ...item, categoryId: event.target.value as string });
          }}
          label="Category">
          {categories.map((item, key) => {
            return (
              <MenuItem key={key} value={item.categoryId}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
        {categoryError && <FormHelperText>Required</FormHelperText>}
      </FormControl>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth={true}
        label="Tag"
        autoComplete="off"
        type="text"
        value={item.tag}
        onChange={(event) => {
          setItem({ ...item, tag: event.target.value });
        }}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth={true}
        label="Notes"
        autoComplete="off"
        type="text"
        value={item.notes}
        onChange={(event) => {
          setItem({ ...item, notes: event.target.value });
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={hasAttachment}
            onChange={(event) => {
              setAttachmentFile(undefined);
              setAttachmentError(false);
              setHasAttachment(event.target.checked);
            }}
            color="primary"
          />
        }
        label="Attachment"
      />
      {hasAttachment && (
        <FormControl
          margin={'normal'}
          fullWidth={true}
          required={true}
          error={attachmentError}
          variant="outlined">
          <DropzoneArea
            acceptedFiles={[
              '.xlsx',
              '.xls',
              'image/*',
              '.doc',
              '.docx',
              '.ppt',
              '.pptx',
              '.txt',
              '.pdf'
            ]}
            clearOnUnmount={true}
            dropzoneProps={{
              minSize: 0,
              maxSize: 5242880
            }}
            dropzoneClass={classes.dropzone}
            dropzoneText="Upload an attachment"
            showPreviewsInDropzone={false}
            onDrop={onBookmarkAttachmentDrop}
            alertSnackbarProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
              }
            }}
          />
          {attachmentError && <FormHelperText>Required</FormHelperText>}
        </FormControl>
      )}
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
          if (!item.categoryId) {
            setCategoryError(true);
            return;
          }
          if (!item.attachmentUrl && hasAttachment && !attachmentFile) {
            setAttachmentError(true);
            return;
          }

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

export default BookmarkActionDialog;
