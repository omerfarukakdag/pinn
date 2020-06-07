import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getAllBookmarksByUser } from '../../../businessLogic/bookmarks';
import { createLogger } from '../../../utils/logger';
import { IBookmark } from '../../../interfaces/models';

const logger = createLogger('getBookmarks');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);
      const bookmarks: IBookmark[] = await getAllBookmarksByUser(event);

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: bookmarks,
        }),
      };
    } catch (error) {
      logger.error('getBookmarks', JSON.stringify(error));
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
