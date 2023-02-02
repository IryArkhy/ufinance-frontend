import axiosInstance from '../axios';

export type Category = {
  id: string;
  type: 'CUSTOM' | 'DEFAULT';
  name: string;
  userId: string;
};

export type GetCategoriesResponse = {
  categories: Category[];
};

export type DeleteCategoryResponse = {
  deletedCategory: Category;
};

export const fetchCategories = async () => {
  return await axiosInstance.get<GetCategoriesResponse>('api/categories');
};

export const createCategoies = async (names: string[]) => {
  return await axiosInstance.post<GetCategoriesResponse>('api/categories', { categories: names });
};

export const deleteCategory = async (id: string) => {
  return await axiosInstance.delete<DeleteCategoryResponse>(`api/categories/${id}`);
};
