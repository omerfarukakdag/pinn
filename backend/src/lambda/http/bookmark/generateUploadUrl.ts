import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getBookmark, getUploadUrl } from '../../../businessLogic/bookmarks';
import { createLogger } from '../../../utils/logger';
import { IGenerateUploadUrlRequest } from '../../../interfaces/models';

const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const bookmarkId = event.pathParameters.bookmarkId;
      const fileDetail: IGenerateUploadUrlRequest = JSON.parse(event.body);
      const bookmarkItem = await getBookmark(bookmarkId, event);

      if (!bookmarkItem) {
        const message = 'Bookmark does not exist or you are not authorized to generate the upload url';
        logger.warning('generateUploadUrl', message);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: message,
          }),
        };
      }

      const key = `${bookmarkItem.bookmarkId}`;
      const uploadUrl = getUploadUrl(key, fileDetail.fileType);

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: {
            uploadUrl,
          },
        }),
      };
    } catch (error) {
      logger.error('generateUploadUrl', JSON.stringify(error));
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
