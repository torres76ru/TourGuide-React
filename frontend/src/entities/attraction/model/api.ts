import axios from 'axios';
import type {
  AttractionDetailsResponse,
  AttractionListResponse,
  AttractionResponse,
} from './types';
import { API_BASE_URL } from 'shared/config/constants';

export const attractionApi = {
  getByCity: async (city: string, tag?: string): Promise<AttractionListResponse> => {
    const { data } = await axios.post(`${API_BASE_URL}/cities/`, {
      city,
      ...(tag ? { tags: tag } : {}),
    });
    return data;
  },
  getByCoords: async (
    lat: number,
    lon: number,
    tags?: string[]
  ): Promise<AttractionListResponse> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/map/attractions/?lat=${lat}&lng=${lon}${tags ? `&radius=0.01&tags=${tags.join(',')}` : ''}`
    );
    return data;
  },
  getById: async (id: string): Promise<AttractionDetailsResponse> => {
    const { data } = await axios.get(`${API_BASE_URL}/attractions/${id}/`);
    return data;
  },
  searchAttractions: async (query: string): Promise<AttractionResponse> => {
    const { data } = await axios.post(`${API_BASE_URL}/attractions/search/`, { name: query });
    return data;
  },
};
