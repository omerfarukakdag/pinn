import React, { CSSProperties } from 'react';
import { IconButton, DialogTitle, Typography, Box, useTheme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface IDialogTitleWithCloseIconEvents {
  onClose: () => void;
}

interface IDialogTitleWithCloseIconProps extends IDialogTitleWithCloseIconEvents {
  id?: string;
  title?: string;
  disabled?: boolean;
  disablePadding?: boolean;
  paddingBottom?: number;
  style?: CSSProperties;
}

const DialogTitleWithCloseIcon: React.FunctionComponent<IDialogTitleWithCloseIconProps> = (
  props
) => {
  const { style, id, paddingBottom, onClose, disabled, title, disablePadding } = props;
  const theme = useTheme();

  return (
    <DialogTitle
      id={id}
      style={{
        paddingBottom: paddingBottom
          ? paddingBottom && disablePadding
            ? 0
            : paddingBottom
          : theme.spacing(3),
        paddingLeft: disablePadding ? 0 : undefined,
        paddingRight: disablePadding ? 0 : undefined,
        paddingTop: disablePadding ? 0 : theme.spacing(2),
        width: '100%',
        ...style
      }}
      disableTypography>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">{title}</Typography>
        <IconButton
          onClick={onClose}
          style={{ marginRight: -12, marginTop: -10 }}
          disabled={disabled}
          aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
};

export default DialogTitleWithCloseIcon;
