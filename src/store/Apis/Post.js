import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../../services/Urls';
import {store} from '../store';

// export const token = store?.getState().Auth.data;

export const Posts = createApi({
  reducerPath: 'TrainerPosts',

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,

    prepareHeaders: headers => {
      const token = store?.getState().Auth?.data?.token;
      console.log('Token Dtaa', token);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      console.log('Header', token);
      return headers;
    },
  }),

  endpoints(builder) {
    return {
      getTrainers: builder.query({
        query: () => ({
          url: '/trainer/getAllTrainers',
          method: 'GET',
        }),
      }),
      getUsers: builder.query({
        query: () => ({
          url: '/user/getAllUsers',
          method: 'GET',
        }),
      }),
    };
  },
});

export const {useGetTrainersQuery, useGetUsersQuery} = Posts;
