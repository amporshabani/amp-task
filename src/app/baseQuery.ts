import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { logout, setGuestCredentials } from "../features/auth/slices/auth.slice";
import type { RootState } from "./store";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  prepareHeaders: (headers) => {
    const guestId = localStorage.getItem("guest_id");
    if (guestId) headers.set("x-guest-id", guestId);
    return headers;
  },
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const isGuest = state.auth.isGuest;

    if (isGuest) {
      return result;
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());

          const newGuestId = "guest_" + Math.random().toString(36).substring(2, 11);
          localStorage.setItem("guest_id", newGuestId);
          api.dispatch(setGuestCredentials({ guestId: newGuestId }));

          setTimeout(() => {
            api.dispatch({ type: "tasks/toDoApi/util/resetApiState" });
            api.dispatch({ type: "authApi/util/resetApiState" });
          }, 0);
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
