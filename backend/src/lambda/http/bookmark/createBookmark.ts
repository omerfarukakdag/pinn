import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createBookmark } from '../../../businessLogic/bookmarks';
import { IBookmark } from '../../../interfaces/models';
import { createLogger } from '../../../utils/logger';
import { getAllCategoriesByUser } from '../../../businessLogic/categories';

const logger = createLogger('createBookmarks');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event:', event);

      const bookmarks: IBookmark[] = JSON.parse(event.body);

      if (!bookmarks || bookmarks.length == 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Request parameter is required but not provided.',
          }),
        };
      }

      const categories = await getAllCategoriesByUser(event);
      const isValidCategory = bookmarks.every((bookmark) =>
        categories.some((category) => {
          return category.categoryId === bookmark.categoryId;
        }),
      );

      if (!isValidCategory) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Category does not exist',
          }),
        };
      }

      const items: IBookmark[] = [];
      for (const bookmark of bookmarks) {
        const newItem = await createBookmark(bookmark, event);
        items.push(newItem);
      }

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: items,
        }),
      };
    } catch (error) {
      logger.error('createBookmarks', JSON.stringify(error));
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
