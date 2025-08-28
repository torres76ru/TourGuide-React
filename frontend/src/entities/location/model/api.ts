import axios from 'axios';

import { API_BASE_URL } from 'shared/config/constants';
import type { CityResponse } from './types';

export const locationApi = {
  getByCity: async (latitude: number, longitude: number): Promise<CityResponse> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/map/attractions/city/?lat=${latitude}&lng=${longitude}`
    );
    return data;
  },
  getCity: async (latitude: number, longitude: number): Promise<string | null> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/map/attractions/city/?lat=${latitude}&lng=${longitude}`
    );
    return data.city || null;
  },
  getCities: async (): Promise<string[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/map/cities/`);
    return data;
  },
};
