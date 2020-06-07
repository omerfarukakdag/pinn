import React from 'react';
import { RouteComponentProps } from 'react-router';
import { PinnHttpClient } from './pinnHttpClient';
import { ExternalHttpClient } from './externalHttpClient';

interface ModelActions<T> {
  items: T[];
  get: () => T[];
  add: (items: T[]) => void;
  delete: (items: T[]) => void;
  update: (item: T) => void;
  set: (items: T[]) => void;
}

interface IResponse<T = any> {
  result?: any;
  success: boolean;
  item?: T;
}

interface IApiResult<T = any> {
  item: T;
}

interface IUser {
  id: string;
  name: string;
}

interface IAuthContext {
  authenticated: boolean;
  user?: IUser;
  authenticate: () => void;
  logout: () => void;
}

interface ISharedContext {
  readonly bookmarkManager: ModelActions<IBookmark>;
  readonly categoryManager: ModelActions<ICategory>;
  readonly pinnHttpClient: PinnHttpClient;
  readonly externalHttpClient: ExternalHttpClient;
}

interface IBookmark {
  bookmarkId: string;
  name: string;
  url: string;
  categoryId: string;
  userId: string;
  createDate: string;
  attachmentUrl?: string;
  notes?: string;
  tag?: string;
}

interface ICategory {
  categoryId: string;
  name: string;
  userId: string;
  createDate: string;
}

interface IAttachment {
  uploadUrl: string;
}

interface IDeleteBookmarkRequest {
  bookmarkId: string;
}

interface IDeleteCategoryRequest {
  categoryId: string;
}

interface IPageProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface ILoadingComponentProps {
  isLoading: boolean;
  pastDelay: boolean;
  timedOut: boolean;
  error: any;
  retry: () => void;
}

interface ILoadableOptions {
  loader(): Promise<React.ComponentType<any> | { default: React.ComponentType<any> }>;
  loading?: React.ComponentType<ILoadingComponentProps>;
  timeOut?: number | false;
  delay?: number | false;
  modules?: string[];
  webpack?: () => Array<string | number>;
}

interface IRoute {
  path: string;
  menuKey: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  layout: React.ComponentType<any>;
}

interface IBookmarkImport {
  url: string;
  categoryName: string;
  title: string;
}

interface IGenerateUploadUrlRequest {
  fileName: string;
  fileType: string;
}

export type {
  IResponse,
  IBookmark,
  IUser,
  IAuthContext,
  ISharedContext,
  ModelActions,
  ICategory,
  IAttachment,
  IDeleteBookmarkRequest,
  IDeleteCategoryRequest,
  IPageProps,
  ILoadingComponentProps,
  ILoadableOptions,
  IRoute,
  IApiResult,
  IBookmarkImport,
  IGenerateUploadUrlRequest
};
