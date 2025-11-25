// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { postApi } from "./api/postApi";
import { likeApi } from "./api/likeApi"; // Import the likeApi
import authReducer from "./slices/authSlice";
import { commentApi } from "./api/commentApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer, // Add likeApi reducer
    [commentApi.reducerPath]: commentApi.reducer, // Add commentApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(commentApi.middleware)
      .concat(postApi.middleware)
      .concat(likeApi.middleware), // Add likeApi middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
