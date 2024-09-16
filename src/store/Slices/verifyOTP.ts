import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const VerifyOTP = createApi({
  reducerPath: 'VerifyOTP',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.117:6000'}),
  endpoints: builder => ({
    verifyOTP: builder.mutation({
      query: ({token, resetPasswordVerificationCode}) => ({
        url: '/trainer/VerifyOTP',
        method: 'POST',
        body: {token, resetPasswordVerificationCode},
      }),
    }),
  }),
});

export const {useVerifyOTPMutation} = VerifyOTP;
