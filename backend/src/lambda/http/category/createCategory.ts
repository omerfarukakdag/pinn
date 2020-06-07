import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { ICategory } from '../../../interfaces/models';
import { createLogger } from '../../../utils/logger';
import { createCategory } from '../../../businessLogic/categories';

const logger = createLogger('createCategory');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event:', event);

      const categories: ICategory[] = JSON.parse(event.body);

      if (!categories || categories.length == 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Request parameter is required but not provided.',
          }),
        };
      }

      const items: ICategory[] = [];
      for (const category of categories) {
        const newItem = await createCategory(category, event);
        items.push(newItem);
      }

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: items,
        }),
      };
    } catch (error) {
      logger.error('createCategory', JSON.stringify(error));
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
