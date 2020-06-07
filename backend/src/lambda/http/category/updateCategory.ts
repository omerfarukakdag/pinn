import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getCategory, updateCategory } from '../../../businessLogic/categories';
import { createLogger } from '../../../utils/logger';
import { ICategory } from '../../../interfaces/models';

const logger = createLogger('updateCategory');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info('Processing event', event);

      const categoryId = event.pathParameters.categoryId;
      const categoryToUpdate: ICategory = JSON.parse(event.body);
      const categoryItem = await getCategory(categoryId, event);

      if (!categoryItem) {
        const message = 'Category does not exist or you are not authorized to update the category';
        logger.warning('updateCategory', message);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: message,
          }),
        };
      }

      const updatedItem = await updateCategory(categoryId, categoryToUpdate, event);

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: updatedItem,
        }),
      };
    } catch (error) {
      logger.error('updateCategory', JSON.stringify(error));
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
