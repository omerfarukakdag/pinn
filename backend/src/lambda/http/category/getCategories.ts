import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getAllCategoriesByUser } from '../../../businessLogic/categories';
import { createLogger } from '../../../utils/logger';
import { ICategory } from '../../../interfaces/models';

const logger = createLogger('getCategories');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);
      const categories: ICategory[] = await getAllCategoriesByUser(event);

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: categories,
        }),
      };
    } catch (error) {
      logger.error('getCategories', JSON.stringify(error));
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
