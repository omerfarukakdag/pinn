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

interface IDeleteBookmarkRequest {
  bookmarkId: string;
}

interface IDeleteCategoryRequest {
  categoryId: string;
}

interface IGenerateUploadUrlRequest {
  fileName: string;
  fileType: string;
}

interface IResponse<T = any> {
  result?: any;
  success: boolean;
  item: T;
}

export { IBookmark, ICategory, IDeleteBookmarkRequest, IDeleteCategoryRequest, IGenerateUploadUrlRequest, IResponse };
