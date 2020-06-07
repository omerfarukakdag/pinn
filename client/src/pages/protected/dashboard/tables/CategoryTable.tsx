import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  makeStyles,
  AppBar,
  Toolbar,
  TextField,
  Paper,
  CircularProgress
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HighlightedInformation from '../../../../components/HighlightedInformation';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { IBookmark, IResponse, ICategory } from '../../../../core/interfaces';
import { useSnackbar } from 'notistack';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { ColDef, GridReadyEvent, SelectionChangedEvent, CellFocusedEvent } from 'ag-grid-community';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import CategoryActionDialog from '../dialogs/CategoryActionDialog';
import { Button, Grid, Typography } from '@material-ui/core';
import _ from 'lodash';

const useStyles = makeStyles((theme: any) => ({
  buttons: {
    marginLeft: theme.spacing(1)
  },
  agGrid: {
    maxHeight: 700,
    width: '100%'
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
  blackIcon: {
    color: theme.palette.common.black
  },
  iconButton: {
    padding: theme.spacing(1)
  },
  contentWrapper: {
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    },
    width: '100%'
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  }
}));

interface ICategoryTableEvents {
  onAddCategories: (categories: ICategory[]) => Promise<IResponse>;
  onUpdateCategory: (category: ICategory) => Promise<IResponse>;
  onDeleteCategories: (categories: ICategory[]) => Promise<IResponse>;
  onSelectedCategoriesChanged: (categories: ICategory[]) => void;
}

interface ICategoryTableProps extends ICategoryTableEvents {
  categories: ICategory[];
  loading?: boolean;
}

const getCategoryDefaultValue = () =>
  _.cloneDeep({
    categoryId: '',
    createDate: '',
    name: '',
    userId: ''
  });

const CategoryTable: React.FunctionComponent<ICategoryTableProps> = (props) => {
  const classes = useStyles();
  const {
    categories,
    loading,
    onAddCategories,
    onUpdateCategory,
    onSelectedCategoriesChanged,
    onDeleteCategories
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'update'>();
  const [actionButtonText, setActionButtonText] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(getCategoryDefaultValue());
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

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
          </Box>
        );
      },
      maxWidth: 150,
      colId: 'Actions'
    }
  ];

  const onGridReady = (event: GridReadyEvent) => {
    gridRef.current?.api?.sizeColumnsToFit();
  };

  const deleteCategory = async (items: ICategory[]) => {
    try {
      if (!items || items.length === 0) {
        return;
      }

      setDialogLoading(true);
      const response = await onDeleteCategories(items);
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
      setSelectedCategories([]);
    }
  };

  const onDialogConfirm = () => {
    if (!selectedCategories) {
      return;
    }
    deleteCategory(selectedCategories);
  };

  const getDeleteDialogContent = (items: ICategory[]) => {
    if (!items) {
      return getHighlightedContent('No category selected to delete');
    }

    if (items.length === 1) {
      return (
        <span>
          {'Do you really want to delete the category '}
          <b>{items[0].name}</b>
          {' from your list? Bookmarks belong to the category will also be deleted.'}
        </span>
      );
    }

    return 'Are you sure to delete the selected categories?';
  };

  const onEditCellClicked = (category: ICategory) => {
    setSelectedCategory(category);
    setActionType('update');
    setDialogTitle('Update Category');
    setActionButtonText('Update');
    setPopupIsOpen(true);
  };

  const onDeleteToolbarButtonClick = async () => {
    const dialogContent = getDeleteDialogContent(selectedCategories);
    setDialogContent(dialogContent);
    setDialogIsOpen(true);
  };

  const onDeleteCellClicked = (category: ICategory) => {
    const dialogContent = getDeleteDialogContent([category]);
    setSelectedCategories([category]);
    setDialogContent(dialogContent);
    setDialogIsOpen(true);
  };

  const onDialogClose = () => {
    setDialogIsOpen(false);
  };

  const onPopupClose = () => {
    setPopupIsOpen(false);
  };

  const onSearchInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setQuickFilterText(event.target.value);
  };

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const rows = event.api.getSelectedRows() as ICategory[];
    setSelectedCategories(rows);
    onSelectedCategoriesChanged(rows);
  };

  const onCategoryAction = async (category: ICategory): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (actionType === 'add') {
          await onAddCategories([category]);
        } else if (actionType === 'update') {
          await onUpdateCategory(category);
        } else {
          return reject('invalid action type');
        }
        resolve({
          success: true
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const openAddCategoryPopup = () => {
    setSelectedCategory(getCategoryDefaultValue());
    setActionType('add');
    setDialogTitle('Add Category');
    setActionButtonText('Add');
    setPopupIsOpen(true);
  };

  const getHighlightedContent = (message: React.ReactNode) => (
    <div className={classes.contentWrapper}>
      <HighlightedInformation>{message}</HighlightedInformation>
    </div>
  );

  const getToolbarContent = () => (
    <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SearchIcon className={classes.block} color="inherit" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth={true}
              placeholder="Search category"
              onChange={onSearchInputChange}
              InputProps={{
                disableUnderline: true,
                className: classes.searchInput
              }}
            />
          </Grid>
          <Grid item>
            <Button
              className={classes.buttons}
              variant="contained"
              color="primary"
              onClick={openAddCategoryPopup}
              disableElevation={true}>
              Add
            </Button>
            {selectedCategories && selectedCategories.length > 1 && (
              <Button
                className={classes.buttons}
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
      <CategoryActionDialog
        open={popupIsOpen}
        onClose={onPopupClose}
        onCategoryAction={onCategoryAction}
        actionButtonText={actionButtonText}
        category={selectedCategory}
        dialogTitle={dialogTitle}
      />
      {categories.length === 0 ? (
        <div className={classes.informationContainer}>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <Typography color="textSecondary" variant={'h4'} align="center">
              You don't have any categories yet.
            </Typography>
          )}
        </div>
      ) : (
        <div>
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
              pagination={true}
              paginationPageSize={15}
              rowSelection="multiple"
              rowDeselection={true}
              rowMultiSelectWithClick={true}
              domLayout={'autoHeight'}
              defaultColDef={{
                suppressMovable: true
              }}
              onCellFocused={(e: CellFocusedEvent) => {
                const focusIsDisabled = e.column && e.column.getColId() === 'Actions';
                e.api.setSuppressRowClickSelection(focusIsDisabled);
              }}
              ref={gridRef}
              suppressCellSelection={true}
              columnDefs={columnDefinitions()}
              rowData={categories}
              onGridReady={onGridReady}
              quickFilterText={quickFilterText}
              onSelectionChanged={onSelectionChanged}
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

export default CategoryTable;
