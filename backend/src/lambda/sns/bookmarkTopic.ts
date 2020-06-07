import { SNSEvent, SNSHandler, S3Event } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { getBookmarkById, updateAttachmentUrl } from '../../businessLogic/bookmarks';
import { S3Helper } from '../../utils/s3Helper';

const logger = createLogger('bookmarkTopic');

export const handler: SNSHandler = async (event: SNSEvent) => {
  logger.info('Processing SNS event', event);

  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message;
    logger.info('Processing S3 event', s3EventStr);
    const s3Event: S3Event = JSON.parse(s3EventStr);

    for (const record of s3Event.Records) {
      try {
        const bookmarkId = record.s3.object.key;
        const bookmarkItem = await getBookmarkById(bookmarkId);

        if (!bookmarkItem) {
          logger.error('Bookmark does not exist', bookmarkId);
          continue;
        }

        await updateAttachmentUrl(bookmarkItem.bookmarkId, bookmarkItem.userId, S3Helper.getAttachmentUrl(bookmarkId));
      } catch (error) {
        logger.error('Processing event record', error);
      }
    }
  }
};
