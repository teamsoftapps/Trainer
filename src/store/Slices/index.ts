import {combineReducers} from '@reduxjs/toolkit';
import authSlice from '../Slices/AuthSlice';
import {TrainerAuth} from './trainerAuth';
import {userAuth} from './userAuth';
import {ResetPassword} from './resetPassword';
import {ResetOtp} from './resetOTP';
import {ForgetPassword} from './forgetPassword';
import {VerifyOTP} from './verifyOTP';
import profileImage from './profileImage';

const Reducers = combineReducers({
  Auth: authSlice,
  Image: profileImage,
  [TrainerAuth.reducerPath]: TrainerAuth.reducer,
  [userAuth.reducerPath]: userAuth.reducer,
  [ResetPassword.reducerPath]: ResetPassword.reducer,
  [ResetOtp.reducerPath]: ResetOtp.reducer,
  [ForgetPassword.reducerPath]: ForgetPassword.reducer,
  [VerifyOTP.reducerPath]: VerifyOTP.reducer,
});
export default Reducers;
