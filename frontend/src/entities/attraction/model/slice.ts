// entities/attraction/model/slice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AttractionListResponse, AttractionResponse } from './types';

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

interface AttractionListState {
  attractionsByTag: Record<string, AttractionByTag>;
  search: SearchState;
}

const initialState: AttractionListState = {
  attractionsByTag: {},
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
      action: PayloadAction<{
        city?: string;
        tag: string;
        nearby?: { lat: number; lon: number };
        leaders?: boolean;
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
    fetchAttractionsSuccess(
      state,
      action: PayloadAction<{ tag: string; data: AttractionListResponse }>
    ) {
      const { tag, data } = action.payload;
      state.attractionsByTag[tag] = { attractions: data.attractions, loading: false, error: null };
    },
    fetchAttractionsFailure(state, action: PayloadAction<{ tag: string; error: string }>) {
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
} = attractionSlice.actions;

export default attractionSlice.reducer;
