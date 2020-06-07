import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { config } from '../common';
import { createLogger } from '../utils/logger';
import { ICategory } from '../interfaces/models';
const AWSXray = require('aws-xray-sdk');

const XAWS = AWSXray.captureAWS(AWS);
const logger = createLogger('CategoryDBAccess');

export class CategoryDBAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly categoriesTable = config.categoriesTableName,
    private readonly categoriesTableIndexName = config.categoriesTableIndexName,
  ) {}

  createCategory(category: ICategory): Promise<ICategory> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!category) {
          return reject('category is required but not provided');
        }

        logger.info('Creating a new category', category);

        const params: DocumentClient.PutItemInput = {
          TableName: this.categoriesTable,
          Item: category,
        };

        await this.docClient.put(params).promise();
        resolve(category);
      } catch (error) {
        logger.error('createCategory error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getCategoryById(categoryId: string): Promise<ICategory> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!categoryId) {
          return reject('categoryId is required but not provided');
        }

        logger.info(`Getting category with id ${categoryId}`);

        const params: DocumentClient.QueryInput = {
          IndexName: this.categoriesTableIndexName,
          TableName: this.categoriesTable,
          KeyConditionExpression: 'categoryId = :categoryId',
          ExpressionAttributeValues: {
            ':categoryId': categoryId,
          },
        };

        const result = await this.docClient.query(params).promise();

        if (result.Items && result.Items.length) {
          return resolve(result.Items[0] as ICategory);
        }
        resolve(undefined);
      } catch (error) {
        logger.error('getCategoryById error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getCategory(categoryId: string, userId: string): Promise<ICategory> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!categoryId || !userId) {
          return reject('categoryId and userId are required but not provided');
        }

        logger.info(`Getting category with id ${categoryId}`);

        const params: DocumentClient.QueryInput = {
          TableName: this.categoriesTable,
          KeyConditionExpression: 'categoryId = :categoryId and userId = :userId',
          ExpressionAttributeValues: {
            ':categoryId': categoryId,
            ':userId': userId,
          },
        };

        const result = await this.docClient.query(params).promise();

        if (result.Items && result.Items.length) {
          return resolve(result.Items[0] as ICategory);
        }

        resolve(undefined);
      } catch (error) {
        logger.error('getCategory error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getAllCategories(): Promise<ICategory[]> {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('Getting all categories');
        const result = await this.docClient
          .scan({
            TableName: this.categoriesTable,
          })
          .promise();
        resolve(result.Items as ICategory[]);
      } catch (error) {
        logger.error('getAllCategories error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  getAllCategoriesByUser(userId: string): Promise<ICategory[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          return reject('userId is required but not provided');
        }

        logger.info(`Getting all categories with userId ${userId}`);

        const params: DocumentClient.QueryInput = {
          TableName: this.categoriesTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
        };

        const result = await this.docClient.query(params).promise();
        resolve(result.Items as ICategory[]);
      } catch (error) {
        logger.error('getAllCategoriesByUser error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  updateCategory(categoryId: string, userId: string, item: ICategory): Promise<ICategory> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!categoryId || !userId || !item) {
          return reject('categoryId, userId and item are required but not provided');
        }

        logger.info(`Updating category with id: ${categoryId}`);

        const params: DocumentClient.UpdateItemInput = {
          TableName: this.categoriesTable,
          Key: {
            userId: userId,
            categoryId: categoryId,
          },
          UpdateExpression: 'set #a = :a',
          ExpressionAttributeNames: {
            '#a': 'name',
          },
          ExpressionAttributeValues: {
            ':a': item.name,
          },
          ReturnValues: 'ALL_NEW',
        };

        const updatedItem = await this.docClient.update(params).promise();
        resolve(updatedItem.Attributes as ICategory);
      } catch (error) {
        logger.error('updateCategory error:', JSON.stringify(error));
        reject(error);
      }
    });
  }

  deleteCategory(categoryId: string, userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!categoryId || !userId) {
          return reject('categoryId and userId are required but not provided');
        }

        logger.info(`Deleting category with id: ${categoryId}`);

        const params: DocumentClient.DeleteItemInput = {
          TableName: this.categoriesTable,
          Key: {
            userId: userId,
            categoryId: categoryId,
          },
        };

        await this.docClient.delete(params).promise();
        resolve();
      } catch (error) {
        logger.error('deleteCategory error:', JSON.stringify(error));
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
