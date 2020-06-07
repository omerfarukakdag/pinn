import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getCategory } from '../../../businessLogic/categories';
import { createLogger } from '../../../utils/logger';
import { ICategory } from '../../../interfaces/models';

const logger = createLogger('getCategory');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const categoryId = event.pathParameters.categoryId;
      const categoryItem: ICategory = await getCategory(categoryId, event);

      if (!categoryItem) {
        const message = 'Category does not exist or you are not authorized to get the category';
        logger.warning('getCategory', message);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: message,
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: categoryItem,
        }),
      };
    } catch (error) {
      logger.error('getCategory', JSON.stringify(error));
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
