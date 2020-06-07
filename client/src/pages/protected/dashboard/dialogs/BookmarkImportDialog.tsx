import React, { useState, Fragment, useRef } from 'react';
import { Button, makeStyles, Theme } from '@material-ui/core';
import FormDialog from '../../../../components/FormDialog';
import ButtonCircularProgress from '../../../../components/ButtonCircularProgress';
import { IResponse, IBookmarkImport } from '../../../../core/interfaces';
import { useSnackbar } from 'notistack';
import { ColDef, GridReadyEvent, SelectionChangedEvent, CellFocusedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

const useStyles = makeStyles((theme: Theme) => ({
  agGrid: {
    maxHeight: 700,
    width: 900
  }
}));

interface IBookmarkImportDialogEvents {
  onClose: () => void;
  onAction: (importItems: IBookmarkImport[]) => Promise<IResponse>;
}

interface IBookmarkImportDialogProps extends IBookmarkImportDialogEvents {
  open: boolean;
  items: IBookmarkImport[];
}

const BookmarkImportDialog: React.FunctionComponent<IBookmarkImportDialogProps> = (props) => {
  const { onClose, open, items, onAction } = props;
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IBookmarkImport[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const gridRef = useRef<AgGridReact>(null);

  const columnDefinitions = (): ColDef[] => [
    {
      headerName: 'Category',
      field: 'categoryName',
      sortable: true,
      filter: true,
      width: 150,
      rowGroup: true,
      hide: true,
      headerCheckboxSelection: true
    },
    { headerName: 'Title', field: 'title', sortable: true, filter: true, width: 250 },
    {
      headerName: 'Url',
      filter: true,
      colId: 'link',
      cellRendererFramework: ({ data }: { data: IBookmarkImport }) => {
        if (data) {
          return (
            <a target={'_blank'} rel="noopener noreferrer" href={data.url}>
              {data.url}
            </a>
          );
        }
        return <></>;
      },
      valueGetter: ({ data }: { data: IBookmarkImport }) => {
        return data?.url;
      }
    }
  ];

  const onFormSubmitted = async () => {
    try {
      setLoading(true);
      const response = await onAction(selectedItems);

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

  const onGridReady = (event: GridReadyEvent) => {
    gridRef.current?.api?.sizeColumnsToFit();
    gridRef.current?.api?.selectAll();
  };

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const rows = event.api.getSelectedRows() as IBookmarkImport[];
    setSelectedItems(rows);
  };

  const dialogContent = (
    <Fragment>
      <div className={`${classes.agGrid} ag-theme-alpine`}>
        <AgGridReact
          modules={[RowGroupingModule, ClientSideRowModelModule]}
          rowSelection="multiple"
          rowDeselection={true}
          rowMultiSelectWithClick={true}
          groupSelectsChildren={true}
          suppressRowClickSelection={true}
          suppressAggFuncInHeader={true}
          domLayout={'autoHeight'}
          defaultColDef={{
            suppressMovable: true,
            resizable: true
          }}
          ref={gridRef}
          onCellFocused={(e: CellFocusedEvent) => {
            if (e.column && e.column.getColId() === 'link') {
              e.api.setSuppressRowClickSelection(true);
            } else {
              e.api.setSuppressRowClickSelection(false);
            }
          }}
          autoGroupColumnDef={{
            headerName: 'Category',
            field: 'categoryName',
            minWidth: 250,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: { checkbox: true }
          }}
          suppressCellSelection={true}
          columnDefs={columnDefinitions()}
          rowData={items}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
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
        headline={'Import Bookmark'}
        onFormSubmit={(e) => {
          e.preventDefault();
          onFormSubmitted();
        }}
        styleOptions={{
          maxWidth: 1000
        }}
        content={dialogContent}
        actions={
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            size="medium"
            color="secondary"
            disabled={loading || selectedItems.length === 0}>
            {'Import'}
            {loading && <ButtonCircularProgress />}
          </Button>
        }
      />
    </React.Fragment>
  );
};

export default BookmarkImportDialog;
