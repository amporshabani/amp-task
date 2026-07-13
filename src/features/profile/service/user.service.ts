import { baseQueryWithReauth } from "@/app/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    sendOtpChangeEmail: builder.mutation({
      query: (data) => ({
        url: "/user/send-otp-change-email",
        method: "POST",
        body: data,
      }),
    }),
    verifyChangeEmail: builder.mutation({
      query: (data) => ({
        url: "/user/verify-otp-change-email",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendOtpChangeEmailMutation, useVerifyChangeEmailMutation } = userApi;
