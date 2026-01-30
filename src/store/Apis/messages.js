import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../../services/Urls';
import {store} from '../store';

export const messages = createApi({
  reducerPath: 'messages',

  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,

    prepareHeaders: headers => {
      const token = store?.getState().Auth?.data?.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Messagess'],
  endpoints: builder => ({
    createMessaeg: builder.mutation({
      query(body) {
        return {
          url: '/createMessage',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Messagess'],
    }),

    getMessages: builder.query({
      query(body) {
        console.log('Recieved Body From User ', body);
        return {
          url: `/getAllMessages?chatId=${body.chatId}&limit=${body.limit}&page=${body.page}`,
          method: 'GET',
        };
      },
      providesTags: ['Messagess'],
    }),
  }),
});
export const {useGetMessagesQuery, useCreateMessaegMutation} = messages;
