// entities/attraction/model/saga.ts
import { call, put, takeEvery, takeLatest } from 'typed-redux-saga';
import {
  fetchAttractionsRequest,
  fetchAttractionsSuccess,
  fetchAttractionsFailure,
  searchAttractionsSuccess,
  searchAttractionsFailure,
  searchAttractionsRequest,
} from './slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AttractionListResponse, AttractionResponse } from './types';
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
    city?: string;
    tag: string;
    nearby?: { lat: number; lon: number };
    leaders?: boolean;
  }>
) {
  const { city, tag, nearby, leaders } = action.payload;

  try {
    let data: AttractionListResponse;

    if (leaders) {
      data = yield* call(attractionApi.getLeaders, tag);
    } else if (nearby) {
      data = yield* call(attractionApi.getByCoords, nearby.lat, nearby.lon, [tag]);
    } else if (city) {
      data = yield* call(attractionApi.getByCity, city, tag);
    } else {
      throw new Error('Either city or nearby coordinates must be provided');
    }

    yield* put(fetchAttractionsSuccess({ tag, data }));
  } catch (err: unknown) {
    let message = 'Loading attractions failed';
    if (err instanceof Error) message = err.message;
    yield* put(fetchAttractionsFailure({ tag, error: message }));
  }
}

export function* attractionSaga() {
  yield* takeEvery(fetchAttractionsRequest.type, handleFetchAttractions);
  yield* takeLatest(searchAttractionsRequest.type, handleSearchAttractions);
}
