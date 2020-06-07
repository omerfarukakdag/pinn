import * as uuid from 'uuid';
import { ICategory } from '../interfaces/models';
import { CategoryDBAccess } from '../dataLayer';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthHelper } from '../utils/authHelper';

const dbAccess = new CategoryDBAccess();

const createCategory = async (category: ICategory, event: APIGatewayProxyEvent): Promise<ICategory> => {
  const categoryId = uuid.v4();
  const userId = AuthHelper.getUserId(event);

  return await dbAccess.createCategory({
    categoryId,
    userId,
    createDate: new Date().toDateString(),
    name: category.name,
  });
};

const getCategoryById = async (categoryId: string): Promise<ICategory> => {
  return await dbAccess.getCategoryById(categoryId);
};

const getCategory = async (categoryId: string, event: APIGatewayProxyEvent): Promise<ICategory> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.getCategory(categoryId, userId);
};

const getAllCategories = async (): Promise<ICategory[]> => {
  return await dbAccess.getAllCategories();
};

const getAllCategoriesByUser = async (event: APIGatewayProxyEvent): Promise<ICategory[]> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.getAllCategoriesByUser(userId);
};

const updateCategory = async (categoryId: string, item: ICategory, event: APIGatewayProxyEvent): Promise<ICategory> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.updateCategory(categoryId, userId, item);
};

const deleteCategory = async (categoryId: string, event: APIGatewayProxyEvent): Promise<void> => {
  const userId = AuthHelper.getUserId(event);
  return await dbAccess.deleteCategory(categoryId, userId);
};

export {
  createCategory,
  getCategoryById,
  getCategory,
  getAllCategories,
  getAllCategoriesByUser,
  updateCategory,
  deleteCategory,
};
