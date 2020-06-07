import React, { useEffect, useState, ReactNode } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import BookmarkTable from './tables/BookmarkTable';
import {
  IResponse,
  IBookmark,
  ICategory,
  IBookmarkImport,
  IDeleteCategoryRequest,
  IDeleteBookmarkRequest
} from '../../../core/interfaces';
import { useSharedContext } from '../../../core/context/SharedContextProvider';
import CategoryTable from './tables/CategoryTable';
import Counter from './Counter';
import { DropzoneArea } from 'material-ui-dropzone';
import { JSDOM } from 'jsdom';
import BookmarkImportDialog from './dialogs/BookmarkImportDialog';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

var QRCode = require('qrcode.react');

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  importContainer: {
    height: 120,
    minHeight: 'inherit'
  },
  exportContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

interface IBookmarksProps {}

const Bookmark: React.FunctionComponent<IBookmarksProps> = (props) => {
  const classes = useStyles();
  const context = useSharedContext();
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [importedBookmarks, setImportedBookmarks] = useState<IBookmarkImport[]>([]);
  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [filteredBookmarks, setFilteredBookmarks] = useState<IBookmark[]>(
    context.bookmarkManager.items
  );

  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredBookmarks(context.bookmarkManager.get());
    } else {
      setFilteredBookmarks(
        context.bookmarkManager.get().filter((bookmark) =>
          selectedCategories.some((category) => {
            return category.categoryId === bookmark.categoryId;
          })
        )
      );
    }
  }, [context.bookmarkManager.items, context.categoryManager.items, selectedCategories]);

  const getCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await context.pinnHttpClient.getCategories();
      context.categoryManager.set(response.item || []);
    } catch (error) {
      enqueueSnackbar('Failed to get categories', { variant: 'error' });
    } finally {
      setCategoryLoading(false);
    }
  };

  const getBookmarks = async () => {
    try {
      setBookmarkLoading(true);
      const response = await context.pinnHttpClient.getBookmarks();
      context.bookmarkManager.set(response.item || []);
    } catch (error) {
      enqueueSnackbar('Failed to get bookmarks', { variant: 'error' });
    } finally {
      setBookmarkLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getBookmarks();
  }, []);

  const onAddBookmarks = (bookmarks: IBookmark[]): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await context.pinnHttpClient.createBookmarks(bookmarks);
        context.bookmarkManager.add(response.item);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onUpdateBookmark = (bookmark: IBookmark): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await context.pinnHttpClient.updateBookmark(bookmark.bookmarkId, bookmark);
        context.bookmarkManager.update(response.item);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onDeleteBookmarks = (bookmarks: IBookmark[]): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const idList: IDeleteBookmarkRequest[] = bookmarks.map((item) => {
          return {
            bookmarkId: item.bookmarkId
          };
        });
        await context.pinnHttpClient.deleteBookmarks(idList);
        context.bookmarkManager.delete(bookmarks);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onGenerateQRCode = (bookmark: IBookmark): ReactNode => {
    if (!bookmark) {
      return null;
    }
    return <QRCode size={180} value={bookmark.url} />;
  };

  const onAddCategories = (categories: ICategory[]): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await context.pinnHttpClient.createCategories(categories);
        context.categoryManager.add(response.item);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onUpdateCategory = (category: ICategory): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await context.pinnHttpClient.updateCategory(category.categoryId, category);
        context.categoryManager.update(response.item);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onDeleteCategories = (categories: ICategory[]): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const idList: IDeleteCategoryRequest[] = categories.map((item) => {
          return {
            categoryId: item.categoryId
          };
        });
        await context.pinnHttpClient.deleteCategories(idList);
        context.categoryManager.delete(categories);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      } finally {
        setSelectedCategories([]);
      }
    });
  };

  const onDeleteAttachment = (bookmark: IBookmark): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        await context.pinnHttpClient.deleteAttachment(bookmark.bookmarkId);
        getBookmarks();
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onUploadAttachment = (bookmark: IBookmark, attachmentFile: File): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await context.pinnHttpClient.getUploadUrl(bookmark.bookmarkId, {
          fileName: attachmentFile.name,
          fileType: attachmentFile.type
        });
        await context.externalHttpClient.uploadFile(response.item.uploadUrl, attachmentFile);
        setTimeout(() => {
          getBookmarks();
        }, 1000);
        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  const getBookmarkCategory = (elem: HTMLElement | null) => {
    while (elem) {
      if (elem.tagName === 'DT') {
        var item = elem.querySelector('H3');
        if (item) {
          return item.textContent;
        }
      }

      elem = elem.parentElement;
    }
    return null;
  };

  const getImportedBookmarks = (dom: Document): IBookmarkImport[] => {
    var links = dom.querySelectorAll('a');
    var bookmarks: IBookmarkImport[] = [];

    links.forEach((element) => {
      var categoryName = getBookmarkCategory(element);
      bookmarks.push({
        url: element.href,
        title: element.text,
        categoryName: categoryName || 'Other'
      });
    });

    return bookmarks;
  };

  const onBookmarkImport = (
    files: File[],
    event: React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement> | DragEvent | Event
  ) => {
    setImportedBookmarks([]);
    const reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (e) => {
      const jsdom = new JSDOM(reader.result?.toString());
      const bookmarks = getImportedBookmarks(jsdom.window.document);
      setImportedBookmarks(bookmarks);
      setImportDialogIsOpen(true);
    };

    reader.onerror = () => {
      setImportedBookmarks([]);
      enqueueSnackbar('Failed to import', { variant: 'error' });
    };
  };

  const onImportBookmarksAction = (category: IBookmarkImport[]): Promise<IResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const uniqueGroups = _(category)
          .groupBy((item) => item.categoryName)
          .map((value, key) => key)
          .value();

        const categories: ICategory[] = [];
        const categoriesToCreate: ICategory[] = [];

        for (const categoryName of uniqueGroups) {
          const category = context.categoryManager.items.find(
            (category) => category.name.toLowerCase() === categoryName.toLowerCase()
          );

          if (category) {
            categories.push(category);
          } else {
            categoriesToCreate.push({
              name: categoryName,
              categoryId: '',
              userId: '',
              createDate: ''
            });
          }
        }

        if (categoriesToCreate.length > 0) {
          const response = await context.pinnHttpClient.createCategories(categoriesToCreate);
          categories.push(...response.item);
        }

        const bookmarksToCreate: IBookmark[] = [];

        _(category)
          .groupBy((item) => item.categoryName)
          .forEach((value, key) => {
            const categoryItem = categories.find(
              (item) => item.name.toLowerCase() === key.toLowerCase()
            )!;

            const bookmarks: IBookmark[] = value.map((item) => {
              return {
                bookmarkId: '',
                categoryId: categoryItem.categoryId,
                createDate: '',
                name: item.title,
                url: item.url,
                userId: '',
                attachmentUrl: '',
                notes: '',
                tag: ''
              };
            });
            bookmarksToCreate.push(...bookmarks);
          });

        if (bookmarksToCreate.length > 0) {
          await context.pinnHttpClient.createBookmarks(bookmarksToCreate);
        } else {
          enqueueSnackbar('No bookmarks provided to import', { variant: 'error' });
        }

        getCategories();
        getBookmarks();

        resolve({
          success: true
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const onImportDialogClose = () => {
    setImportDialogIsOpen(false);
  };

  const onSelectedCategoriesChanged = (categories: ICategory[]) => {
    setSelectedCategories(categories);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Counter title={'Categories'} value={context.categoryManager.items.length} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Counter title={'Bookmarks'} value={context.bookmarkManager.items.length} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <DropzoneArea
            dropzoneClass={classes.importContainer}
            acceptedFiles={['.html']}
            showPreviewsInDropzone={false}
            onDrop={onBookmarkImport}
            dropzoneText="Import bookmark"
            alertSnackbarProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
              }
            }}
          />
          <BookmarkImportDialog
            open={importDialogIsOpen}
            onClose={onImportDialogClose}
            onAction={onImportBookmarksAction}
            items={importedBookmarks}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item lg={3} md={6} xl={3} xs={12}>
          <CategoryTable
            categories={context.categoryManager.get()}
            loading={categoryLoading}
            onAddCategories={onAddCategories}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategories={onDeleteCategories}
            onSelectedCategoriesChanged={onSelectedCategoriesChanged}
          />
        </Grid>
        <Grid item lg={9} md={12} xl={9} xs={12}>
          <BookmarkTable
            bookmarks={filteredBookmarks}
            categories={context.categoryManager.items}
            loading={bookmarkLoading}
            onAddBookmarks={onAddBookmarks}
            onUpdateBookmark={onUpdateBookmark}
            onDeleteBookmarks={onDeleteBookmarks}
            onGenerateQRCode={onGenerateQRCode}
            onDeleteAttachment={onDeleteAttachment}
            onUploadAttachment={onUploadAttachment}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Bookmark;
