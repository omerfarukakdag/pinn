import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getBookmark, deleteS3BucketObject, updateAttachmentUrl } from '../../../businessLogic/bookmarks';
import { createLogger } from '../../../utils/logger';

const logger = createLogger('deleteAttachment');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const bookmarkId = event.pathParameters.bookmarkId;
      const bookmarkItem = await getBookmark(bookmarkId, event);

      if (!bookmarkItem) {
        const message = 'Bookmark does not exist or you are not authorized to delete the attachment';
        logger.warning('deleteAttachment', message);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: message,
          }),
        };
      }

      await deleteS3BucketObject(bookmarkItem.bookmarkId);
      await updateAttachmentUrl(bookmarkItem.bookmarkId, bookmarkItem.userId, '');

      return {
        statusCode: 200,
        body: '',
      };
    } catch (error) {
      logger.error('deleteAttachment', JSON.stringify(error));
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
