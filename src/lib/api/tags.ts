import axiosInstance from '../axios';

export type Tag = {
  id: string;
  name: string;
  userId: string;
};

export const fetchTags = async () => {
  return await axiosInstance.get<{ tags: Tag[] }>('api/tags');
};

export const createTags = async (names: string[]) => {
  return await axiosInstance.post<{ tags: Tag[] }>('api/tags', { tags: names });
};

export const deleteTag = async (id: string) => {
  return await axiosInstance.delete<{ deletedTag: Tag }>(`api/tags/${id}`);
};
