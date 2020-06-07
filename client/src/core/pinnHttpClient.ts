import { HttpClient } from './httpClient';
import {
  IBookmark,
  ICategory,
  IDeleteBookmarkRequest,
  IDeleteCategoryRequest,
  IAttachment,
  IApiResult,
  IGenerateUploadUrlRequest
} from './interfaces';
import { AxiosRequestConfig } from 'axios';

class PinnHttpClient extends HttpClient {
  public constructor(config?: AxiosRequestConfig) {
    super(config);
  }

  public createBookmarks = (body: IBookmark[]) =>
    this.post<IApiResult<IBookmark[]>, IBookmark[]>('/bookmarks', body).then(this.success);

  public deleteBookmarks = (body: IDeleteBookmarkRequest[]) =>
    this.delete<any>(`/bookmarks`, {
      data: body
    }).then(this.success);

  public getUploadUrl = (bookmarkId: string, body: IGenerateUploadUrlRequest) =>
    this.post<IApiResult<IAttachment>, IGenerateUploadUrlRequest>(
      `/bookmarks/${bookmarkId}/attachment`,
      body
    ).then(this.success);

  public deleteAttachment = (bookmarkId: string) =>
    this.delete(`/bookmarks/${bookmarkId}/attachment`).then(this.success);

  public getBookmark = (bookmarkId: string) =>
    this.get<IApiResult<IBookmark>>(`/bookmarks/${bookmarkId}`).then(this.success);

  public getBookmarks = () => this.get<IApiResult<IBookmark[]>>('/bookmarks').then(this.success);

  public updateBookmark = (bookmarkId: string, body: IBookmark) =>
    this.patch<IApiResult<IBookmark>, IBookmark>(`/bookmarks/${bookmarkId}`, body).then(
      this.success
    );

  public createCategories = (body: ICategory[]) =>
    this.post<IApiResult<ICategory[]>, ICategory[]>('/categories', body).then(this.success);

  public deleteCategories = (body: IDeleteCategoryRequest[]) =>
    this.delete<any>(`/categories`, {
      data: body
    }).then(this.success);

  public getCategory = (categoryId: string) =>
    this.get<IApiResult<ICategory>>(`/categories/${categoryId}`).then(this.success);

  public getCategories = () => this.get<IApiResult<ICategory[]>>('/categories').then(this.success);

  public updateCategory = (categoryId: string, body: ICategory) =>
    this.patch<IApiResult<ICategory>, ICategory>(`/categories/${categoryId}`, body).then(
      this.success
    );
}

export { PinnHttpClient };
