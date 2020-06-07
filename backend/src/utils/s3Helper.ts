import * as AWS from 'aws-sdk';
import { config } from '../common';
import { createLogger } from '../utils/logger';
const AWSXray = require('aws-xray-sdk');

const XAWS = AWSXray.captureAWS(AWS);
const logger = createLogger('BookmarkDBAccess');

export class S3Helper {
  constructor(
    private readonly s3: AWS.S3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly urlExpiration = parseInt(config.signedUrlExpiration, 10),
  ) {}

  getUploadUrl(key: string, contentType: string): string {
    if (!key) {
      return '';
    }

    return this.s3.getSignedUrl('putObject', {
      Bucket: config.bookmarksBucketName,
      Key: key,
      Expires: this.urlExpiration,
      ContentType: contentType,
    });
  }

  deleteObject(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) {
          return reject('Bucket key is required but not provided');
        }

        await this.s3
          .deleteObject({
            Bucket: config.bookmarksBucketName,
            Key: key,
          })
          .promise();

        resolve();
      } catch (error) {
        logger.error('S3Helper.deleteObject error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  static getAttachmentUrl(bookmarkId: string): string {
    if (!bookmarkId) {
      return '';
    }

    return `https://${config.bookmarksBucketName}.s3.amazonaws.com/${bookmarkId}`;
  }
}
