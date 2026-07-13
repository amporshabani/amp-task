import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "../features/tasks/services/tasksApi";
import modalReducer from "./slices/modal.slice";
import themeReducer from "./slices/theme.slice";
import { authReducer, authFormReducer, authApi } from "@/features/auth";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    theme: themeReducer,

    auth: authReducer,
    authForm: authFormReducer,

    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([tasksApi.middleware, authApi.middleware]),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
