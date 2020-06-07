import React, { useState } from 'react';
import { ISharedContext, IBookmark, ModelActions, ICategory } from '../interfaces';
import { useAuth } from './AuthProvider';
import { apiEndpoint } from '../config';
import { PinnHttpClient } from '../pinnHttpClient';
import moment from 'moment';
import { ExternalHttpClient } from '../externalHttpClient';

const bookmarkContextDefault: ModelActions<IBookmark> = {
  items: [],
  get: () => [],
  add: () => {},
  delete: () => {},
  set: () => {},
  update: () => {}
};

const bookmarkCategoryContextDefault: ModelActions<ICategory> = {
  items: [],
  get: () => [],
  add: () => {},
  delete: () => {},
  set: () => {},
  update: () => {}
};

const defaultValue: ISharedContext = {
  bookmarkManager: bookmarkContextDefault,
  categoryManager: bookmarkCategoryContextDefault,
  pinnHttpClient: new PinnHttpClient(),
  externalHttpClient: new ExternalHttpClient()
};

const SharedContext = React.createContext<ISharedContext>(defaultValue);

const useSharedContext = (): ISharedContext => {
  return React.useContext<ISharedContext>(SharedContext);
};

const SharedContextProvider: React.FunctionComponent = (props) => {
  const authContext = useAuth();

  const [bookmarkState, setBookmarkState] = React.useState<ModelActions<IBookmark>>(
    bookmarkContextDefault
  );
  const [bookmarkCategoryState, setBookmarkCategoryState] = React.useState<ModelActions<ICategory>>(
    bookmarkCategoryContextDefault
  );

  const [pinnHttpClient] = useState<PinnHttpClient>(
    new PinnHttpClient({
      baseURL: apiEndpoint,
      headers: {
        common: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authContext.idToken}`
        }
      },
      transformRequest: (data: any, headers: any) => {
        return JSON.stringify(data);
      }
    })
  );

  const [externalHttpClient] = useState<ExternalHttpClient>(new ExternalHttpClient());

  return (
    <SharedContext.Provider
      value={{
        bookmarkManager: {
          get: () => {
            return bookmarkState.items
              .slice()
              .sort(
                (a, b) =>
                  moment(a.createDate, 'ddd MMM DD YYYY').valueOf() -
                  moment(b.createDate, 'ddd MMM DD YYYY').valueOf()
              )
              .sort((a, b) => a.name.localeCompare(b.name));
          },
          add: (items: IBookmark[]) =>
            setBookmarkState({
              ...bookmarkState,
              items: [...bookmarkState.items, ...items]
            }),
          delete: (items: IBookmark[]) => {
            const idsToDelete = items.map((bookmark) => bookmark.bookmarkId);
            const newList = bookmarkState.items.filter(
              (bookmark) => !idsToDelete.includes(bookmark.bookmarkId)
            );
            setBookmarkState({ ...bookmarkState, items: newList });
          },
          set: (items: IBookmark[]) => setBookmarkState({ ...bookmarkState, items }),
          items: bookmarkState.items,
          update: (item: IBookmark) => {
            const itemIndex = bookmarkState.items.findIndex(
              (bookmark) => bookmark.bookmarkId === item.bookmarkId
            );

            const newList = [...bookmarkState.items];
            newList[itemIndex] = item;

            setBookmarkState({ ...bookmarkState, items: newList });
          }
        },
        categoryManager: {
          get: () => {
            return bookmarkCategoryState.items
              .slice()
              .sort(
                (a, b) =>
                  moment(a.createDate, 'ddd MMM DD YYYY').valueOf() -
                  moment(b.createDate, 'ddd MMM DD YYYY').valueOf()
              )
              .sort((a, b) => a.name.localeCompare(b.name));
          },
          add: (items: ICategory[]) =>
            setBookmarkCategoryState({
              ...bookmarkCategoryState,
              items: [...bookmarkCategoryState.items, ...items]
            }),
          delete: (items: ICategory[]) => {
            const idsToDelete = items.map((category) => category.categoryId);
            const newList = bookmarkCategoryState.items.filter(
              (category) => !idsToDelete.includes(category.categoryId)
            );

            const newBookmarkList = bookmarkState.items.filter(
              (bookmark) => !idsToDelete.includes(bookmark.categoryId)
            );

            setBookmarkCategoryState({ ...bookmarkCategoryState, items: newList });
            setBookmarkState({ ...bookmarkState, items: newBookmarkList });
          },
          set: (items: ICategory[]) =>
            setBookmarkCategoryState({ ...bookmarkCategoryState, items }),
          items: bookmarkCategoryState.items,
          update: (item: ICategory) => {
            const itemIndex = bookmarkCategoryState.items.findIndex(
              (category) => category.categoryId === item.categoryId
            );
            const newList = [...bookmarkCategoryState.items];
            newList[itemIndex] = item;

            setBookmarkCategoryState({
              ...bookmarkCategoryState,
              items: newList
            });
          }
        },
        pinnHttpClient: pinnHttpClient,
        externalHttpClient: externalHttpClient
      }}>
      {props.children}
    </SharedContext.Provider>
  );
};

export { useSharedContext, SharedContextProvider };
