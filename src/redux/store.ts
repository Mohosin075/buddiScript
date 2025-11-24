import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./api/authApi"
import { userApi } from "./api/userApi"
import authReducer from "./slices/authSlice"
import { postApi } from "./api/postApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware,userApi.middleware,postApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
