import axios from "axios";
import type {
  AttractionDetailsResponse,
  AttractionListResponse,
} from "./types";
import { API_BASE_URL } from "shared/config/constants";

export const attractionApi = {
  getByCity: async (tags: string): Promise<AttractionListResponse> => {
    const { data } = await axios.get(
      `${API_BASE_URL}/map/attractions/cities/?lat=59.934&lng=30.306&tags=${tags}`
    );
    return data;
  },

  getById: async (id: string): Promise<AttractionDetailsResponse> => {
    const { data } = await axios.get(`${API_BASE_URL}/attractions/${id}/`);
    return data;
  },
};
