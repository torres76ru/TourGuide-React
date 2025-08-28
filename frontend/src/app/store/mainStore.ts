// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "entities/user/model/slice";
import attractionReducer from "entities/attraction/model/slice";
import locationReducer from "entities/location/model/slice";

import createSagaMiddleware from "redux-saga";
import { userSaga } from "entities/user/model/saga";
import { attractionSaga } from "entities/attraction/model/saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    user: userReducer,
    attraction: attractionReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(userSaga);
sagaMiddleware.run(attractionSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
