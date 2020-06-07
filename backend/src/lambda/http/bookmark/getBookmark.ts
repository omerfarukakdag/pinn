import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getBookmark } from '../../../businessLogic/bookmarks';
import { createLogger } from '../../../utils/logger';
import { IBookmark } from '../../../interfaces/models';

const logger = createLogger('getBookmark');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);
      const bookmarkId = event.pathParameters.bookmarkId;
      const bookmarkItem: IBookmark = await getBookmark(bookmarkId, event);

      if (!bookmarkItem) {
        const message = 'Bookmark does not exist or you are not authorized to get the bookmark';
        logger.warning('getBookmark', message);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: message,
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: bookmarkItem,
        }),
      };
    } catch (error) {
      logger.error('getBookmark', JSON.stringify(error));
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
  }),
);
