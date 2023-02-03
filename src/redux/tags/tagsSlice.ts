import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Tag } from '../../lib/api/tags';
import { ErrorData } from '../../lib/api/utils';

import { createNewTags, fetchTags, removeTag } from './thunks';

type TagsSliceState = {
  tags: Tag[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: null | ErrorData;
};

const initialState: TagsSliceState = {
  tags: [],
  loading: 'idle',
  error: null,
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTgas: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags = [...state.tags, action.payload];
    },
    deleteTag: (state, action: PayloadAction<{ id: string }>) => {
      state.tags = [...state.tags].filter((c) => c.id !== action.payload.id);
    },
    resetState: (state) => {
      state.tags = initialState.tags;
      state.error = initialState.error;
      state.loading = initialState.loading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(fetchTags.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(createNewTags.fulfilled, (state, action) => {
      state.tags = action.payload;
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(createNewTags.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createNewTags.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });

    builder.addCase(removeTag.fulfilled, (state, action) => {
      state.tags = [...state.tags].filter((cat) => cat.id !== action.payload.id);
      state.loading = 'succeeded';
      state.error = null;
    });
    builder.addCase(removeTag.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removeTag.rejected, (state, action) => {
      state.error = action.payload ?? null;
      state.loading = 'failed';
    });
  },
});

export const { setTgas, addTag, deleteTag, resetState: resetTagsState } = tagsSlice.actions;

export const tagsReducer = tagsSlice.reducer;
