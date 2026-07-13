import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/app/baseQuery";
import { setCredentials, logout as authLogout } from "../slices/auth.slice";
import { tasksApi } from "@/features/tasks/services/tasksApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (data) => ({ url: "/auth/send-otp", method: "POST", body: data }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({ url: "/auth/verify-otp", method: "POST", body: data }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.user) {
            dispatch(setCredentials(data.user));
            dispatch(tasksApi.util.resetApiState());
          }
        } catch (err) {
          console.error("خطا در همگام‌سازی بعد از ورود:", err);
        }
      },
    }),

    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["User"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.warn("ارور سشن");
        } finally {
          dispatch(authLogout());
          dispatch(tasksApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation, useGetMeQuery, useLogoutMutation } =
  authApi;
