import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { config } from '../common';
import { createLogger } from '../utils/logger';
import { IBookmark } from '../interfaces/models';
const AWSXray = require('aws-xray-sdk');

const XAWS = AWSXray.captureAWS(AWS);
const logger = createLogger('BookmarkDBAccess');

export class BookmarkDBAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly bookmarksTable = config.bookmarksTableName,
    private readonly bookmarksTableIndexName = config.bookmarksTableIndexName,
  ) {}

  createBookmark(bookmark: IBookmark): Promise<IBookmark> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bookmark) {
          return reject('bookmark is required but not provided');
        }

        logger.info('Creating a new bookmark', bookmark);

        const params: DocumentClient.PutItemInput = {
          TableName: this.bookmarksTable,
          Item: bookmark,
        };

        await this.docClient.put(params).promise();
        resolve(bookmark);
      } catch (error) {
        logger.error('createBookmark error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getBookmarkById(bookmarkId: string): Promise<IBookmark> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bookmarkId) {
          return reject('bookmarkId is required but not provided');
        }

        logger.info(`Getting bookmark with id ${bookmarkId}`);

        const params: DocumentClient.QueryInput = {
          IndexName: this.bookmarksTableIndexName,
          TableName: this.bookmarksTable,
          KeyConditionExpression: 'bookmarkId = :bookmarkId',
          ExpressionAttributeValues: {
            ':bookmarkId': bookmarkId,
          },
        };

        const result = await this.docClient.query(params).promise();

        if (result.Items && result.Items.length) {
          return resolve(result.Items[0] as IBookmark);
        }
        resolve(undefined);
      } catch (error) {
        logger.error('getBookmarkById error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getBookmark(bookmarkId: string, userId: string): Promise<IBookmark> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bookmarkId || !userId) {
          return reject('bookmarkId and userId are required but not provided');
        }

        logger.info(`Getting bookmark with id ${bookmarkId}`);

        const params: DocumentClient.QueryInput = {
          TableName: this.bookmarksTable,
          KeyConditionExpression: 'bookmarkId = :bookmarkId and userId = :userId',
          ExpressionAttributeValues: {
            ':bookmarkId': bookmarkId,
            ':userId': userId,
          },
        };

        const result = await this.docClient.query(params).promise();

        if (result.Items && result.Items.length) {
          return resolve(result.Items[0] as IBookmark);
        }

        resolve(undefined);
      } catch (error) {
        logger.error('getBookmark error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getAllBookmarks(): Promise<IBookmark[]> {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('Getting all bookmarks');
        const result = await this.docClient
          .scan({
            TableName: this.bookmarksTable,
          })
          .promise();
        resolve(result.Items as IBookmark[]);
      } catch (error) {
        logger.error('getAllBookmarks error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getAllBookmarksByUser(userId: string): Promise<IBookmark[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          return reject('userId is required but not provided');
        }

        logger.info(`Getting all bookmarks with userId ${userId}`);

        const params: DocumentClient.QueryInput = {
          TableName: this.bookmarksTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
        };

        const result = await this.docClient.query(params).promise();
        resolve(result.Items as IBookmark[]);
      } catch (error) {
        logger.error('getAllBookmarksByUser error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  updateAttachmentUrl(bookmarkId: string, userId: string, attachmentUrl: string): Promise<IBookmark> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bookmarkId || !userId) {
          return reject('bookmarkId, userId and attachmentUrl are required but not provided');
        }

        logger.info(`Updating attachment url of the bookmark: ${bookmarkId}`);

        const params: DocumentClient.UpdateItemInput = {
          TableName: this.bookmarksTable,
          Key: {
            bookmarkId: bookmarkId,
            userId: userId,
          },
          UpdateExpression: 'set #a = :a',
          ExpressionAttributeNames: {
            '#a': 'attachmentUrl',
          },
          ExpressionAttributeValues: {
            ':a': attachmentUrl,
          },
          ReturnValues: 'ALL_NEW',
        };

        const updatedItem = await this.docClient.update(params).promise();
        resolve(updatedItem.Attributes as IBookmark);
      } catch (error) {
        logger.error('updateAttachmentUrl error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  updateBookmark(bookmarkId: string, userId: string, item: IBookmark): Promise<IBookmark> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bookmarkId || !userId || !item) {
          return reject('bookmarkId, userId and item are required but not provided');
        }

        logger.info(`Updating bookmark with id: ${bookmarkId}`);

        const params: DocumentClient.UpdateItemInput = {
          TableName: this.bookmarksTable,
          Key: {
            userId: userId,
            bookmarkId: bookmarkId,
          },
          UpdateExpression: 'set #a = :a, #b = :b, #c = :c, #d = :d, #e = :e',
          ExpressionAttributeNames: {
            '#a': 'name',
            '#b': 'url',
            '#c': 'categoryId',
            '#d': 'notes',
            '#e': 'tag',
          },
          ExpressionAttributeValues: {
            ':a': item.name,
            ':b': item.url,
            ':c': item.categoryId,
            ':d': item.notes,
            ':e': item.tag,
          },
          ReturnValues: 'ALL_NEW',
        };

        const updatedItem = await this.docClient.update(params).promise();
        resolve(updatedItem.Attributes as IBookmark);
      } catch (error) {
        logger.error('updateBookmark error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  deleteBookmark(bookmarkId: string, userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!bookmarkId || !userId) {
          return reject('bookmarkId and userId are required but not provided');
        }

        logger.info(`Deleting bookmark with id: ${bookmarkId}`);

        const params: DocumentClient.DeleteItemInput = {
          TableName: this.bookmarksTable,
          Key: {
            userId: userId,
            bookmarkId: bookmarkId,
          },
        };

        await this.docClient.delete(params).promise();
        resolve();
      } catch (error) {
        logger.error('deleteBookmark error:', JSON.stringify(error));
        reject(error);
      }
    });
  }
}

const createDynamoDBClient = () => {
  if (config.isOffline) {
    logger.info('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
};
