// entities/attraction/model/saga.ts
import { call, put, takeEvery } from 'typed-redux-saga';
import { fetchAttractionsRequest, fetchAttractionsSuccess, fetchAttractionsFailure } from './slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AttractionListResponse } from './types';
import { attractionApi } from './api';

function* handleFetchAttractions(action: PayloadAction<{ city: string; tag: string }>) {
  const { city, tag } = action.payload;
  try {
    const data: AttractionListResponse = yield* call(attractionApi.getByCity, city, tag);

    yield* put(fetchAttractionsSuccess({ tag, data }));
  } catch (err: unknown) {
    let message = 'Loading attractions failed';

    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      message = axiosErr.response?.data?.detail ?? axiosErr.message ?? message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    yield* put(fetchAttractionsFailure({ tag, error: message }));
  }
}

export function* attractionSaga() {
  yield* takeEvery(fetchAttractionsRequest.type, handleFetchAttractions);
}
