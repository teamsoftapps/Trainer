import {combineReducers} from '@reduxjs/toolkit';
import authSlice from '../Slices/AuthSlice';

const Reducers = combineReducers({
  Auth: authSlice,
});
export default Reducers;
