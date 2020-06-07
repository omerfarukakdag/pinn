import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { deleteCategory, getCategory } from '../../../businessLogic/categories';
import { createLogger } from '../../../utils/logger';
import { ICategory, IDeleteCategoryRequest } from '../../../interfaces/models';
import { getAllBookmarksByUser, deleteBookmark, deleteS3BucketObject } from '../../../businessLogic/bookmarks';

const logger = createLogger('deleteCategory');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const categoriesToDelete: IDeleteCategoryRequest[] = JSON.parse(event.body);

      if (!categoriesToDelete || categoriesToDelete.length == 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Request parameter is required but not provided.',
          }),
        };
      }

      for (const item of categoriesToDelete) {
        const categoryItem: ICategory = await getCategory(item.categoryId, event);
        if (!categoryItem) {
          const message = 'Category does not exist or you are not authorized to delete the category';
          logger.warning('deleteCategory', message);
          return {
            statusCode: 404,
            body: JSON.stringify({
              error: message,
            }),
          };
        }
        await deleteCategory(item.categoryId, event);
      }

      const bookmarks = await getAllBookmarksByUser(event);
      if (bookmarks.length) {
        const bookmarksToDelete = bookmarks.filter((bookmark) =>
          categoriesToDelete.some((item) => {
            return item.categoryId === bookmark.categoryId;
          }),
        );

        for (const item of bookmarksToDelete) {
          await deleteBookmark(item.bookmarkId, event);
          await deleteS3BucketObject(item.bookmarkId);
        }
      }

      return {
        statusCode: 200,
        body: '',
      };
    } catch (error) {
      logger.error('deleteCategory', JSON.stringify(error));
      return {
        statusCode: 500,
        body: JSON.stringify({
          error,
        }),
      };
    }
  },
);

handler.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
