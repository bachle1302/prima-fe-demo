// services/comicService.ts

import api from "@/api/axios";

export const fetchComics = async (search: string = "", page: number = 1) => {
  const response = await api.get(`/comics`, {
    params: {
      search: search,
      page: page,
      limit: 10,
      sort: "desc"
    }
  });
  return response.data;
};