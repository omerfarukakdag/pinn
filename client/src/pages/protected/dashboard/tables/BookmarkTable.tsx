import React, { useState, useRef, ReactNode } from 'react';
import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  AppBar,
  TextField,
  Toolbar,
  CircularProgress
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import HighlightedInformation from '../../../../components/HighlightedInformation';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { IBookmark, IResponse, ICategory } from '../../../../core/interfaces';
import { useSnackbar } from 'notistack';
import FormDialog from '../../../../components/FormDialog';
import { QrIcon } from '../../../../components/QRIcon';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { ColDef, GridReadyEvent, SelectionChangedEvent, CellFocusedEvent } from 'ag-grid-community';
import moment from 'moment';
import { Button, Grid, Typography, Theme } from '@material-ui/core';
import BookmarkActionDialog from '../dialogs/BookmarkActionDialog';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash';
import { saveAs } from 'file-saver';

const useStyles = makeStyles((theme: Theme) => ({
  buttons: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  agGrid: {
    maxHeight: 700,
    width: '100%'
  },
  blackIcon: {
    color: theme.palette.common.black
  },
  iconButton: {
    padding: theme.spacing(1)
  },
  informationContainer: {
    margin: '40px 16px',
    display: 'flex',
    justifyContent: 'center'
  },
  block: {
    display: 'block'
  },
  paper: {
    margin: 'auto',
    overflow: 'hidden'
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  categorySelect: {
    minWidth: 200,
    marginLeft: 10,
    marginBottom: 0,
    marginTop: 0
  }
}));

interface IBookmarkTableEvents {
  onAddBookmarks: (bookmarks: IBookmark[]) => Promise<IResponse>;
  onUpdateBookmark: (bookmark: IBookmark) => Promise<IResponse>;
  onDeleteBookmarks: (bookmark: IBookmark[]) => Promise<IResponse>;
  onGenerateQRCode: (bookmark: IBookmark) => ReactNode;
  onDeleteAttachment: (bookmark: IBookmark) => Promise<IResponse>;
  onUploadAttachment: (bookmark: IBookmark, attachmentFile: File) => Promise<IResponse>;
}

interface IBookmarkTableProps extends IBookmarkTableEvents {
  bookmarks: IBookmark[];
  categories: ICategory[];
  loading?: boolean;
}

const getBookmarkDefaultValue = (): IBookmark =>
  _.cloneDeep({
    bookmarkId: '',
    userId: '',
    name: '',
    createDate: '',
    categoryId: '',
    url: '',
    attachmentUrl: '',
    notes: '',
    tag: ''
  });

const BookmarkTable: React.FunctionComponent<IBookmarkTableProps> = (props) => {
  const classes = useStyles();
  const {
    bookmarks,
    categories,
    loading,
    onAddBookmarks,
    onUpdateBookmark,
    onDeleteBookmarks,
    onGenerateQRCode,
    onDeleteAttachment,
    onUploadAttachment
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const [qrDialogIsVisible, setQrDialogIsVisible] = useState(false);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedBookmark, setSelectedBookmark] = useState<IBookmark>(getBookmarkDefaultValue());
  const [selectedBookmarks, setSelectedBookmarks] = useState<IBookmark[]>([]);
  const [exportIsEnabled, setExportIsEnabled] = useState(false);

  const [actionType, setActionType] = useState<'add' | 'update'>();
  const [actionButtonText, setActionButtonText] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const gridRef = useRef<AgGridReact>(null);

  const columnDefinitions = (): ColDef[] => [
    {
      width: 50,
      checkboxSelection: true,
      sortable: false,
      suppressMenu: true,
      filter: false,
      pinned: true,
      headerCheckboxSelection: true
    },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, width: 140 },
    {
      headerName: 'Url',
      colId: 'url',
      filter: true,
      cellRendererFramework: ({ data }: { data: IBookmark }) => {
        return (
          <a target={'_blank'} rel="noopener noreferrer" href={data.url}>
            {data.url}
          </a>
        );
      },
      valueGetter: ({ data }: { data: IBookmark }) => {
        return data.url;
      }
    },
    {
      headerName: 'Attachment',
      cellRendererFramework: ({ data }: { data: IBookmark }) => {
        return (
          <a target={'_blank'} rel="noopener noreferrer" href={data.attachmentUrl}>
            {'Attachment'}
          </a>
        );
      },
      valueGetter: ({ data }: { data: IBookmark }) => {
        return data.attachmentUrl;
      },
      colId: 'attachment',
      maxWidth: 160
    },
    { headerName: 'Notes', field: 'notes', filter: true },
    { headerName: 'Tag', field: 'tag', sortable: true, filter: true, maxWidth: 150 },
    {
      headerName: 'Category',
      sortable: true,
      maxWidth: 160,
      cellRendererFramework: ({ data }: { data: IBookmark }) => {
        const categoryInfo = (categories || []).find(
          (category) => category.categoryId === data.categoryId
        );
        return (
          <span>
            <b>{categoryInfo?.name}</b>
          </span>
        );
      },
      valueGetter: ({ data }: { data: IBookmark }) => {
        return data.categoryId;
      }
    },
    {
      headerName: 'CreateDate',
      field: 'createDate',
      sortable: true,
      maxWidth: 160,
      valueFormatter: ({ data }: { data: IBookmark }) => {
        return moment(data.createDate, 'ddd MMM DD YYYY').format('DD MMMM YYYY');
      }
    },
    {
      cellRendererFramework: ({ data }: { data: IBookmark }) => {
        return (
          <Box display="flex" justifyContent="flex-end">
            <IconButton
              className={classes.iconButton}
              aria-label="Edit"
              onClick={() => {
                onEditCellClicked(_.cloneDeep(data));
              }}>
              <EditIcon className={classes.blackIcon} />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              aria-label="Delete"
              onClick={() => {
                onDeleteCellClicked(_.cloneDeep(data));
              }}>
              <DeleteIcon className={classes.blackIcon} />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              aria-label="QR"
              onClick={() => {
                onGenerateQRCellClicked(_.cloneDeep(data));
              }}>
              <QrIcon className={classes.blackIcon} />
            </IconButton>
          </Box>
        );
      },
      colId: 'actions',
      maxWidth: 150
    }
  ];

  const onGridReady = (event: GridReadyEvent) => {
    gridRef.current?.api?.sizeColumnsToFit();
  };

  const deleteBookmarks = async (items: IBookmark[]) => {
    try {
      if (!items || items.length === 0) {
        return;
      }

      setDialogLoading(true);
      const response = await onDeleteBookmarks(items);
      setDialogLoading(false);

      if (response.success) {
        enqueueSnackbar('Success', { variant: 'success' });
      } else {
        enqueueSnackbar(JSON.stringify(response.result), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(JSON.stringify(error.message), { variant: 'error' });
    } finally {
      setDialogIsOpen(false);
      setSelectedBookmarks([]);
    }
  };

  const onEditCellClicked = (bookmark: IBookmark) => {
    setSelectedBookmark(bookmark);
    setActionType('update');
    setDialogTitle('Update Bookmark');
    setActionButtonText('Update');
    setPopupIsOpen(true);
  };

  const onDeleteToolbarButtonClick = async () => {
    const dialogContent = getDeleteDialogContent(selectedBookmarks);
    setDialogContent(dialogContent);
    setDialogIsOpen(true);
  };

  const onDeleteCellClicked = (bookmark: IBookmark) => {
    const dialogContent = getDeleteDialogContent([bookmark]);
    setSelectedBookmarks([bookmark]);
    setDialogContent(dialogContent);
    setDialogIsOpen(true);
  };

  const onGenerateQRCellClicked = (bookmark: IBookmark) => {
    setSelectedBookmark(bookmark);
    setQrDialogIsVisible(true);
  };

  const onDialogClose = () => {
    setDialogIsOpen(false);
  };

  const onQrDialogClose = () => {
    setQrDialogIsVisible(false);
  };

  const openAddBookmarkPopup = () => {
    setSelectedBookmark(getBookmarkDefaultValue());
    setActionType('add');
    setDialogTitle('Add Bookmark');
    setActionButtonText('Add');
    setPopupIsOpen(true);
  };

  const onPopupClose = () => {
    setPopupIsOpen(false);
  };

  const executeBookmarkAction = (bookmark: IBookmark) => {
    if (actionType === 'add') {
      return onAddBookmarks([bookmark]);
    } else if (actionType === 'update') {
      return onUpdateBookmark(bookmark);
    } else {
      return Promise.reject('Invalid action type');
    }
  };

  const onBookmarkAction = (
    bookmark: IBookmark,
    hasAttachment: boolean,
    attachmentFile?: File
  ): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        await executeBookmarkAction(bookmark);
        if (hasAttachment) {
          if (attachmentFile) {
            await onUploadAttachment(bookmark, attachmentFile);
          }
        } else if (bookmark.attachmentUrl) {
          await onDeleteAttachment(bookmark);
        }
        resolve({
          success: true
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onSearchInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setQuickFilterText(event.target.value);
  };

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const rows = event.api.getSelectedRows() as IBookmark[];
    setSelectedBookmarks(rows);
    setExportIsEnabled(rows.length > 0);
  };

  const getHighlightedContent = (message: React.ReactNode) => (
    <div>
      <HighlightedInformation>{message}</HighlightedInformation>
    </div>
  );

  const generateQRCode = () => {
    if (!selectedBookmark) {
      return getHighlightedContent('No bookmark selected to generate a QR code');
    }

    return onGenerateQRCode(selectedBookmark);
  };

  const exportBookmarksToHtml = () => {
    const items = _(selectedBookmarks)
      .groupBy((item) => item.categoryId)
      .map((value, key) => {
        const category = categories.find((category) => category.categoryId === key);
        return { category, bookmarks: value };
      })
      .value();

    const title = 'Pinn-Bookmarks';

    const content = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
        <!-- This is an automatically generated file.
           It will be read and overwritten.
           DO NOT EDIT! -->
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <TITLE>${title}</TITLE>
        <H1>${title}</H1>
        <DL><p>
          ${items
            .map((item) => {
              return `<DT><H3>${item.category ? item.category.name : 'Untitled'}</H3>
                    <DL><p>
                    ${item.bookmarks
                      .map((bookmark) => {
                        return `<DT><A HREF="${bookmark.url}">${bookmark.name}</A>`;
                      })
                      .join('\r\n')}
                    </DL><p>`;
            })
            .join('\r\n')}     
        </DL><p>`;

    var blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'pinn-bookmarks');
  };

  const onDialogConfirm = () => {
    if (!selectedBookmarks) {
      return;
    }
    deleteBookmarks(selectedBookmarks);
  };

  const getDeleteDialogContent = (items: IBookmark[]) => {
    if (!items) {
      return getHighlightedContent('No bookmark selected to delete');
    }

    if (items.length === 1) {
      return (
        <span>
          {'Do you really want to remove the bookmark '}
          <b>{items[0].name}</b>
          {' from your list?'}
        </span>
      );
    }

    return 'Selected bookmarks will be removed. Are you sure?';
  };

  const disableFocusColumns = ['url', 'attachment', 'actions'];

  const getToolbarContent = () => (
    <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SearchIcon className={classes.block} color="inherit" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Search bookmark"
              InputProps={{
                disableUnderline: true,
                className: classes.searchInput
              }}
              onChange={onSearchInputChange}
            />
          </Grid>
          <Grid item>
            {exportIsEnabled && (
              <Button
                className={classes.buttons}
                variant="contained"
                color="primary"
                onClick={exportBookmarksToHtml}
                disableElevation={true}>
                Export
              </Button>
            )}
            {categories.length > 0 && (
              <Button
                className={classes.buttons}
                variant="contained"
                color="primary"
                onClick={openAddBookmarkPopup}
                disableElevation={true}>
                Add
              </Button>
            )}
            {selectedBookmarks && selectedBookmarks.length > 1 && (
              <Button
                variant="contained"
                color="primary"
                disableElevation={true}
                onClick={onDeleteToolbarButtonClick}>
                Delete
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );

  const getContent = () => (
    <React.Fragment>
      <BookmarkActionDialog
        actionType={actionType}
        open={popupIsOpen}
        onClose={onPopupClose}
        onBookmarkAction={onBookmarkAction}
        actionButtonText={actionButtonText}
        categories={categories}
        bookmark={selectedBookmark}
        dialogTitle={dialogTitle}
      />
      {bookmarks.length === 0 ? (
        <div className={classes.informationContainer}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <Typography color="textSecondary" variant={'h4'} align="center">
              You don't have any bookmarks yet.
            </Typography>
          )}
        </div>
      ) : (
        <div>
          <FormDialog
            open={qrDialogIsVisible}
            content={generateQRCode()}
            onClose={onQrDialogClose}
            styleOptions={{ maxWidth: 300 }}
          />
          <ConfirmationDialog
            open={dialogIsOpen}
            title="Confirmation"
            content={dialogContent}
            loading={dialogLoading}
            onClose={onDialogClose}
            onConfirm={onDialogConfirm}
          />
          <div className={`${classes.agGrid} ag-theme-alpine`}>
            <AgGridReact
              rowSelection="multiple"
              rowDeselection={true}
              rowMultiSelectWithClick={true}
              domLayout={'autoHeight'}
              defaultColDef={{
                suppressMovable: true,
                resizable: true
              }}
              ref={gridRef}
              onCellFocused={(e: CellFocusedEvent) => {
                if (e.column && disableFocusColumns.includes(e.column.getColId())) {
                  e.api.setSuppressRowClickSelection(true);
                } else {
                  e.api.setSuppressRowClickSelection(false);
                }
              }}
              suppressCellSelection={true}
              columnDefs={columnDefinitions()}
              rowData={bookmarks}
              onGridReady={onGridReady}
              quickFilterText={quickFilterText}
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        {getToolbarContent()}
        {getContent()}
      </Paper>
    </React.Fragment>
  );
};

export default BookmarkTable;
