// features/location/model/locationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationState {
  coords: Coordinates | null;
  error: string | null;
}

const initialState: LocationState = {
  coords: null,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCoords(state, action: PayloadAction<Coordinates>) {
      state.coords = action.payload;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.coords = null;
    },
  },
});

export const { setCoords, setError } = locationSlice.actions;
export default locationSlice.reducer;
