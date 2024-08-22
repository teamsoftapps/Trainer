import {combineReducers} from '@reduxjs/toolkit';
import authSlice from '../Slices/AuthSlice';
import {TrainerAuth} from './trainerAuth';
import { userAuth } from './userAuth';

const Reducers = combineReducers({
  Auth: authSlice,
  [TrainerAuth.reducerPath]: TrainerAuth.reducer,
  [userAuth.reducerPath]:userAuth.reducer
});
export default Reducers;
