import {combineReducers} from '@reduxjs/toolkit';
import authSlice from '../Slices/AuthSlice';
import {TrainerAuth} from '../Apis/trainerAuth';
import {userAuth} from '../Apis/userAuth';
import {Posts} from '../Apis/Post';
import {Chats} from '../Apis/chat';
import {messages} from '../Apis/messages';
import profileImage from './profileImage';
import db_ID from './db_ID';
import follow from './follow';
import favourite from './favourite';
import TrainerBookings from './trainerBookings';

const Reducers = combineReducers({
  Auth: authSlice,
  Image: profileImage,
  dbId: db_ID,
  follow: follow,
  favourite: favourite,
  bookings: TrainerBookings,
  [TrainerAuth.reducerPath]: TrainerAuth.reducer,
  [userAuth.reducerPath]: userAuth.reducer,
  [Posts.reducerPath]: Posts.reducer,
  [Chats.reducerPath]: Chats.reducer,
  [messages.reducerPath]: messages.reducer,
});
export default Reducers;
