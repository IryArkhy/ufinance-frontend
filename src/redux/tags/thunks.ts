import { createAsyncThunk } from '@reduxjs/toolkit';

import { Tag, createTags, deleteTag, fetchTags as getTags } from '../../lib/api/tags';
import { ErrorData, handleError } from '../../lib/api/utils';

export const fetchTags = createAsyncThunk<Tag[], undefined, { rejectValue: ErrorData }>(
  'tags/fetchTags',
  async (_, thunkApi) => {
    try {
      const { tags } = (await getTags()).data;

      return tags;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const createNewTags = createAsyncThunk<Tag[], string[], { rejectValue: ErrorData }>(
  'tags/createTags',
  async (names, thunkApi) => {
    try {
      const { tags } = (await createTags(names)).data;

      return tags;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);

export const removeTag = createAsyncThunk<Tag, string, { rejectValue: ErrorData }>(
  'tags/deleteTags',
  async (id, thunkApi) => {
    try {
      const { deletedTag } = (await deleteTag(id)).data;

      return deletedTag;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);
