// services/comicService.ts

import api from '@/api/axios';

export const fetchComics = async (search: string = '', page: number = 1) => {
    const response = await api.get(`/comics`, {
        params: {
            search: search,
            page: page,
            limit: 10,
            sort: 'desc'
        }
    });
    return response.data;
};

export const createComic = async (title: string, file: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const response = await api.post('/comics', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

export const updateComic = async (id: number, title: string, file?: File) => {
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
        formData.append('file', file);
    }

    const response = await api.put(`/comics/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

export const deleteComic = async (id: number) => {
    const response = await api.delete(`/comics/${id}`);
    return response.data;
};
