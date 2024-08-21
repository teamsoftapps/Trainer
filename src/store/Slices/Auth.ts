import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const TrainerAuth = createApi({
  reducerPath: 'TrainerAuth',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.101:3000',
    prepareHeaders: header => {
      header.set('Accept', 'application/json');
    },
  }),

  endpoints: builder => ({
    SignIn: builder.mutation({
      query: body => ({
        url: '/trainer/trainerLogin',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {useSignInMutation} = TrainerAuth;
