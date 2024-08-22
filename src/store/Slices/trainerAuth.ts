import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const TrainerAuth = createApi({
  reducerPath: 'TrainerAuth',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.117:6000',
    prepareHeaders: header => {
      header.set('Accept', 'application/json');
    },
  }),

  endpoints: builder => ({
    SignInTrainer: builder.mutation({
      query: body => ({
        url: '/trainer/trainerLogin',
        method: 'POST',
        body,
      }),
    }),
    SignUpTrainer: builder.mutation({
      query: body => ({
        url: '/trainer/trainerSignup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {useSignInTrainerMutation, useSignUpTrainerMutation} = TrainerAuth;
