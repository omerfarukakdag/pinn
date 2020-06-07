import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getBookmark, updateBookmark } from '../../../businessLogic/bookmarks';
import { createLogger } from '../../../utils/logger';
import { IBookmark } from '../../../interfaces/models';

const logger = createLogger('updateBookmark');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const bookmarkId = event.pathParameters.bookmarkId;
      const bookmarkToUpdate: IBookmark = JSON.parse(event.body);
      const bookmarkItem = await getBookmark(bookmarkId, event);

      if (!bookmarkItem) {
        const message = 'Bookmark does not exist or you are not authorized to update the bookmark';
        logger.warning('updateBookmark', message);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: message,
          }),
        };
      }

      const updatedItem = await updateBookmark(bookmarkId, bookmarkToUpdate, event);

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: updatedItem,
        }),
      };
    } catch (error) {
      logger.error('updateBookmark', JSON.stringify(error));
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
