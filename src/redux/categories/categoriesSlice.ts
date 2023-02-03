import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Category } from '../../lib/api/categories';
import { ErrorData } from '../../lib/api/utils';

import { createNewCategories, fetchCategories, removeCategory } from './thunks';

type CategoriesSliceState = {
  categories: Category[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: null | ErrorData;
};

const initialState: CategoriesSliceState = {
  categories: [],
  loading: 'idle',
  error: null,
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories = [...state.categories, action.payload];
    },
    deleteCategory: (state, action: PayloadAction<{ id: string }>) => {
      state.categories = [...state.categories].filter((c) => c.id !== action.payload.id);
    },
    resetState: (state) => {
      state.categories = initialState.categories;
      state.error = initialState.error;
      state.loading = initialState.loading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(createNewCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(createNewCategories.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createNewCategories.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(removeCategory.fulfilled, (state, action) => {
      state.categories = [...state.categories].filter((cat) => cat.id !== action.payload.id);
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(removeCategory.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removeCategory.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });
  },
});

export const {
  setCategories,
  addCategory,
  deleteCategory,
  resetState: resetCategoriesState,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;
