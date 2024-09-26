import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../../services/Urls';
import {store} from '../store';

export const Chats = createApi({
  reducerPath: 'Chats',

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,

    prepareHeaders: headers => {
      const token = store?.getState().Auth.data.data.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      console.log('Header', headers);
      return headers;
    },
  }),
  tagTypes: ['Chatss'],
  endpoints: builder => ({
    createChat: builder.mutation({
      query(body) {
        console.log('Body', body);
        return {
          url: '/createChat',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Chatss'],
    }),

    getChats: builder.query({
      query: () => ({
        url: '/getAllChats',
        method: 'GET',
      }),
      providesTags: ['Chatss'],
    }),
  }),
});

export const {useGetChatsQuery, useCreateChatMutation} = Chats;
