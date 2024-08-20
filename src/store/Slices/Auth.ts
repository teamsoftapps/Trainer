import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const TrainerAuth = createApi({
  reducerPath: 'TrainerAuth',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.189:3000',
    prepareHeaders: header => {
      header.set('Accept', 'application/json');
    },
  }),

  endpoints: builder => ({
    SignIn: builder.mutation({
      query: body => ({
        url: '/userLogin',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {useSignInMutation} = TrainerAuth;
