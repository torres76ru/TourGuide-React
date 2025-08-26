// entities/attraction/model/slice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Attraction, AttractionListResponse, AttractionResponse } from './types';

interface SearchState {
  results: AttractionListResponse['attractions'];
  loading: boolean;
  error: string | null;
}

interface AttractionByTag {
  attractions: AttractionListResponse['attractions'];
  loading: boolean;
  error: string | null;
}

interface NearbyState {
  attractions: Attraction[];
  loading: boolean;
  error: string | null;
}

interface AttractionListState {
  attractionsByTag: Record<string, AttractionByTag>;
  nearby: NearbyState;
  search: SearchState;
}

const initialState: AttractionListState = {
  attractionsByTag: {},
  nearby: {
    attractions: [],
    loading: false,
    error: null,
  },
  search: {
    results: [],
    loading: false,
    error: null,
  },
};

const attractionSlice = createSlice({
  name: 'attraction',
  initialState,
  reducers: {
    // --- поиск ---
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchAttractionsRequest(state, _action: PayloadAction<{ query: string }>) {
      state.search.loading = true;
      state.search.error = null;
    },
    searchAttractionsSuccess(state, action: PayloadAction<AttractionResponse>) {
      console.log('searchAttractionsSuccess action.payload:', action.payload);
      state.search.results = action.payload;
      state.search.loading = false;
      state.search.error = null;
    },
    searchAttractionsFailure(state, action: PayloadAction<string>) {
      state.search.results = [];
      state.search.loading = false;
      state.search.error = action.payload;
    },
    fetchAttractionsRequest(
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{
        tags?: string[];
        lat: number;
        lon: number;
        radius?: number;
      }>
    ) {
      state.nearby.loading = true;
      state.nearby.error = null;
    },
    fetchAttractionsSuccess(
      state,
      action: PayloadAction<{ tags?: string[]; data: AttractionListResponse }>
    ) {
      const { data } = action.payload;
      state.nearby.attractions = data.attractions;
      state.nearby.loading = false;
      state.nearby.error = null;
    },
    fetchAttractionsFailure(state, action: PayloadAction<string>) {
      state.nearby.attractions = [];
      state.nearby.loading = false;
      state.nearby.error = action.payload;
    },
    fetchLeadersRequest(
      state,
      action: PayloadAction<{
        city?: string;
        tag: string;
        nearby?: { lat: number; lon: number };
        leaders?: boolean;
        limit?: number;
      }>
    ) {
      const { tag } = action.payload;
      if (!state.attractionsByTag[tag]) {
        state.attractionsByTag[tag] = { attractions: [], loading: true, error: null };
      } else {
        state.attractionsByTag[tag].loading = true;
        state.attractionsByTag[tag].error = null;
      }
    },
    fetchLeadersSuccess(state, action: PayloadAction<{ tag: string; data: AttractionResponse }>) {
      const { tag, data } = action.payload;
      state.attractionsByTag[tag] = { attractions: data, loading: false, error: null };
    },
    fetchLeadersFailure(state, action: PayloadAction<{ tag: string; error: string }>) {
      const { tag, error } = action.payload;
      if (!state.attractionsByTag[tag]) {
        state.attractionsByTag[tag] = { attractions: [], loading: false, error };
      } else {
        state.attractionsByTag[tag].loading = false;
        state.attractionsByTag[tag].error = error;
      }
    },
  },
});

export const {
  fetchAttractionsRequest,
  fetchAttractionsSuccess,
  fetchAttractionsFailure,
  searchAttractionsRequest,
  searchAttractionsFailure,
  searchAttractionsSuccess,
  fetchLeadersRequest,
  fetchLeadersSuccess,
  fetchLeadersFailure,
} = attractionSlice.actions;

export default attractionSlice.reducer;
