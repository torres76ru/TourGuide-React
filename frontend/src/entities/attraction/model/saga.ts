// entities/attraction/model/saga.ts
import { call, put, takeEvery, takeLatest } from 'typed-redux-saga';
import {
  fetchAttractionsRequest,
  fetchAttractionsSuccess,
  fetchAttractionsFailure,
  searchAttractionsSuccess,
  searchAttractionsFailure,
  searchAttractionsRequest,
  fetchLeadersRequest,
  fetchLeadersFailure,
  fetchLeadersSuccess,
} from './slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AttractionResponse } from './types';
import { attractionApi } from './api';

function* handleSearchAttractions(action: PayloadAction<{ query: string }>) {
  try {
    const data: AttractionResponse = yield* call(
      attractionApi.searchAttractions,
      action.payload.query
    );
    console.log('handleSearchAttractions data:', data);
    yield* put(searchAttractionsSuccess(data));
  } catch (err: unknown) {
    let message = 'Search failed';

    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      message = axiosErr.response?.data?.detail ?? axiosErr.message ?? message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    yield* put(searchAttractionsFailure(message));
  }
}
function* handleFetchAttractions(
  action: PayloadAction<{
    tags?: string[];
    lat: number;
    lon: number;
    radius?: number;
  }>
) {
  const { tags, lat, lon, radius } = action.payload;

  try {
    const data = yield* call(attractionApi.getByCoords, lat, lon, tags, radius);

    yield* put(fetchAttractionsSuccess({ tags, data }));
  } catch (err: unknown) {
    let message = 'Loading attractions failed';
    if (err instanceof Error) message = err.message;
    yield* put(fetchAttractionsFailure(message));
  }
}

function* handleFetchLeaders(
  action: PayloadAction<{
    city?: string;
    tag: string;
    limit?: number;
  }>
) {
  const { city, tag, limit } = action.payload;

  try {
    const data: AttractionResponse = yield* call(attractionApi.getLeaders, city, tag, limit);
    yield* put(fetchLeadersSuccess({ tag, data }));
  } catch (err: unknown) {
    let message = 'Loading leaders failed';
    if (err instanceof Error) message = err.message;
    yield* put(fetchLeadersFailure({ tag, error: message }));
  }
}

export function* attractionSaga() {
  yield* takeEvery(fetchAttractionsRequest.type, handleFetchAttractions);
  yield* takeLatest(searchAttractionsRequest.type, handleSearchAttractions);
  yield* takeEvery(fetchLeadersRequest.type, handleFetchLeaders);
}
