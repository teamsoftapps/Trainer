import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const ForgetPassword = createApi({
  reducerPath: 'ForgetPassword',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.117:6000',
    // prepareHeaders: header => {
    //   header.set('Accept', 'application/json');
    // },
  }),
  endpoints: builder => ({
    www: builder.mutation({
      query: email => ({
        url: '/trainer/forgetPassword',
        method: 'POST',
        body: {email},
      }),
    }),
  }),
});
export const {useWwwMutation} = ForgetPassword;
