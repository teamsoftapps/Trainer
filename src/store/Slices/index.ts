import {combineReducers} from '@reduxjs/toolkit';
import authSlice from '../Slices/AuthSlice';
import {TrainerAuth} from './Auth';

const Reducers = combineReducers({
  Auth: authSlice,
  [TrainerAuth.reducerPath]: TrainerAuth.reducer,
});
export default Reducers;
