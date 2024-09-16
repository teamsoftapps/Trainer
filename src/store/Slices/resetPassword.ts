import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const ResetPassword = createApi({
  reducerPath: 'ResetPassword',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.117:6000'}),
  endpoints: builder => ({
    resetPassword: builder.mutation({
      query: ({token, Password, ID}) => ({
        url: '/trainer/resetPassword',
        method: 'POST',
        body: {token, Password, ID},
      }),
    }),
  }),
});

export const {useResetPasswordMutation} = ResetPassword;
