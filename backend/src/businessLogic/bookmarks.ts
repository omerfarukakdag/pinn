import * as uuid from 'uuid';
import { IBookmark } from '../interfaces/models';
import { BookmarkDBAccess } from '../dataLayer';
import { S3Helper } from '../utils/s3Helper';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthHelper } from '../utils/authHelper';

const dbAccess = new BookmarkDBAccess();
const s3Helper = new S3Helper();

const createBookmark = async (bookmark: IBookmark, event: APIGatewayProxyEvent): Promise<IBookmark> => {
  const bookmarkId = uuid.v4();
  const userId = AuthHelper.getUserId(event);

  return await dbAccess.createBookmark({
    bookmarkId,
    userId,
    categoryId: bookmark.categoryId,
    createDate: new Date().toDateString(),
    name: bookmark.name,
    url: bookmark.url,
    notes: bookmark.notes,
    tag: bookmark.tag,
    attachmentUrl: '',
  });
};

const getBookmarkById = async (bookmarkId: string): Promise<IBookmark> => {
  return await dbAccess.getBookmarkById(bookmarkId);
};

const getBookmark = async (bookmarkId: string, event: APIGatewayProxyEvent): Promise<IBookmark> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.getBookmark(bookmarkId, userId);
};

const getAllBookmarks = async (): Promise<IBookmark[]> => {
  return await dbAccess.getAllBookmarks();
};

const getAllBookmarksByUser = async (event: APIGatewayProxyEvent): Promise<IBookmark[]> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.getAllBookmarksByUser(userId);
};

const updateAttachmentUrl = async (bookmarkId: string, userId: string, attachmentUrl: string): Promise<IBookmark> => {
  return await dbAccess.updateAttachmentUrl(bookmarkId, userId, attachmentUrl);
};

const updateBookmark = async (bookmarkId: string, item: IBookmark, event: APIGatewayProxyEvent): Promise<IBookmark> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.updateBookmark(bookmarkId, userId, item);
};

const deleteBookmark = async (bookmarkId: string, event: APIGatewayProxyEvent): Promise<void> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.deleteBookmark(bookmarkId, userId);
};

const getUploadUrl = (key: string, contentType: string) => s3Helper.getUploadUrl(key, contentType);
const deleteS3BucketObject = (key: string) => s3Helper.deleteObject(key);

export {
  createBookmark,
  getBookmarkById,
  getBookmark,
  getAllBookmarks,
  getAllBookmarksByUser,
  updateAttachmentUrl,
  updateBookmark,
  deleteBookmark,
  getUploadUrl,
  deleteS3BucketObject,
};
