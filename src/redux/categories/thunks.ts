import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  Category,
  createCategoies,
  deleteCategory,
  fetchCategories as getCategories,
} from '../../lib/api/categories';
import { ErrorData, handleError } from '../../lib/api/utils';

export const fetchCategories = createAsyncThunk<Category[], undefined, { rejectValue: ErrorData }>(
  'categories/fetchCategories',
  async (_, thunkApi) => {
    try {
      const { categories } = (await getCategories()).data;

      return categories;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const createNewCategories = createAsyncThunk<
  Category[],
  string[],
  { rejectValue: ErrorData }
>('categories/createCategory', async (names, thunkApi) => {
  try {
    const { categories } = (await createCategoies(names)).data;

    return categories;
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const removeCategory = createAsyncThunk<Category, string, { rejectValue: ErrorData }>(
  'categories/deleteCategory',
  async (id, thunkApi) => {
    try {
      const { deletedCategory } = (await deleteCategory(id)).data;

      return deletedCategory;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);
