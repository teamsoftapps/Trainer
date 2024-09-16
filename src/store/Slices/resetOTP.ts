import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const ResetOtp = createApi({
  reducerPath: 'ResetOtp',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.117:6000'}),
  endpoints: builder => ({
    resendOTP: builder.mutation({
      query: email => ({
        url: '/trainer/forgetPassword',
        method: 'POST',
        body: {email},
      }),
    }),
  }),
});

export const {useResendOTPMutation} = ResetOtp;
