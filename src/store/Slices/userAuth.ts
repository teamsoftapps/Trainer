import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const userAuth = createApi({
  reducerPath: 'userAuth',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.101:3000',
    // prepareHeaders: header => {
    //   header.set('Accept', 'application/json');
    // },
  }),

  endpoints: builder => ({
    SignInUser: builder.mutation({
      query: body => ({
        url: '/user/userLogin',
        method: 'POST',
        body,
      }),
    }),
    SignUpUser: builder.mutation({
      query: body => ({
        url: '/user/userSignup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {useSignInUserMutation,useSignUpUserMutation} = userAuth;
