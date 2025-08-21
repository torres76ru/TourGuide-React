// entities/attraction/model/slice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AttractionListResponse } from "./types";

interface AttractionByTag {
  attractions: AttractionListResponse["attractions"];
  loading: boolean;
  error: string | null;
}

interface AttractionListState {
  attractionsByTag: Record<string, AttractionByTag>;
}

const initialState: AttractionListState = {
  attractionsByTag: {},
};

const attractionSlice = createSlice({
  name: "attraction",
  initialState,
  reducers: {
    fetchAttractionsRequest(state, action: PayloadAction<{ tag: string }>) {
      const { tag } = action.payload;
      // инициализация под тег, если его ещё нет
      if (!state.attractionsByTag[tag]) {
        state.attractionsByTag[tag] = {
          attractions: [],
          loading: true,
          error: null,
        };
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
      state.attractionsByTag[tag] = {
        attractions: data.attractions,
        loading: false,
        error: null,
      };
    },
    fetchAttractionsFailure(
      state,
      action: PayloadAction<{ tag: string; error: string }>
    ) {
      const { tag, error } = action.payload;
      if (!state.attractionsByTag[tag]) {
        state.attractionsByTag[tag] = {
          attractions: [],
          loading: false,
          error,
        };
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
} = attractionSlice.actions;

export default attractionSlice.reducer;
