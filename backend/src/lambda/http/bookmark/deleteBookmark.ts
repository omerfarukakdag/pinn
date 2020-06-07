import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { deleteBookmark, deleteS3BucketObject, getBookmark } from '../../../businessLogic/bookmarks';
import { createLogger } from '../../../utils/logger';
import { IBookmark, IDeleteBookmarkRequest } from '../../../interfaces/models';

const logger = createLogger('deleteBookmark');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const bookmarksToDelete: IDeleteBookmarkRequest[] = JSON.parse(event.body);

      if (!bookmarksToDelete || bookmarksToDelete.length == 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Request parameter is required but not provided.',
          }),
        };
      }

      for (const item of bookmarksToDelete) {
        const bookmarkItem: IBookmark = await getBookmark(item.bookmarkId, event);
        if (!bookmarkItem) {
          const message = 'Bookmark does not exist or you are not authorized to delete the bookmark';
          logger.warning('deleteBookmark', message);
          return {
            statusCode: 404,
            body: JSON.stringify({
              error: message,
            }),
          };
        }

        await deleteBookmark(item.bookmarkId, event);
        await deleteS3BucketObject(item.bookmarkId);
      }

      return {
        statusCode: 200,
        body: '',
      };
    } catch (error) {
      logger.error('deleteBookmark', JSON.stringify(error));
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
