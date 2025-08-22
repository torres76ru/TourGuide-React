import axios from 'axios';
import type { AttractionDetailsResponse, AttractionListResponse } from './types';
import { API_BASE_URL } from 'shared/config/constants';

export const attractionApi = {
  getByCity: async (city: string, tag?: string): Promise<AttractionListResponse> => {
    const { data } = await axios.get(`${API_BASE_URL}/cities/${city}/${tag && '&tags=' + tag}`);
    return data;
  },

  getById: async (id: string): Promise<AttractionDetailsResponse> => {
    const { data } = await axios.get(`${API_BASE_URL}/attractions/${id}/`);
    return data;
  },
};
