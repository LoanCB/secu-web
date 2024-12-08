import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import userReducer from "./user-slice";
import notificationReducer from "./notification-slice";
import storage from "redux-persist/es/storage";
import { persistReducer, persistStore } from "redux-persist";

const userPersistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: persistedUserReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
