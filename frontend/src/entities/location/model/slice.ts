// features/location/model/locationSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Coordinates, LocationState } from './types';

const initialState: LocationState = {
  coords: null,
  city: null,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCoords(state, action: PayloadAction<Coordinates>) {
      state.coords = action.payload;
      state.error = null;
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.coords = null;
    },
  },
});

export const { setCoords, setCity, setError } = locationSlice.actions;
export default locationSlice.reducer;
