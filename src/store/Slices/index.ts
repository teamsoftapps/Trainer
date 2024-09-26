import {combineReducers} from '@reduxjs/toolkit';
import {TrainerAuth} from './trainerAuth';
import {userAuth} from './userAuth';
import {ResetPassword} from './resetPassword';
import {ResetOtp} from './resetOTP';
import {ForgetPassword} from './forgetPassword';
import {VerifyOTP} from './verifyOTP';
import authSlice from '../Slices/AuthSlice';
import profileImage from './profileImage';
import db_ID from './db_ID';
import favouriteSlice from './favourite';
import followSlice from './follow';
const Reducers = combineReducers({
  Auth: authSlice,
  Image: profileImage,
  dbId: db_ID,
  follow: followSlice,
  favourite: favouriteSlice,
  [TrainerAuth.reducerPath]: TrainerAuth.reducer,
  [userAuth.reducerPath]: userAuth.reducer,
  [ResetPassword.reducerPath]: ResetPassword.reducer,
  [ResetOtp.reducerPath]: ResetOtp.reducer,
  [ForgetPassword.reducerPath]: ForgetPassword.reducer,
  [VerifyOTP.reducerPath]: VerifyOTP.reducer,
});
export default Reducers;
