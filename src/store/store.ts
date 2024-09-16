import {configureStore} from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import Reducers from './Slices';
import {MMKV} from 'react-native-mmkv';
import {persistReducer, persistStore} from 'redux-persist';
import {TrainerAuth} from './Slices/trainerAuth';
import {userAuth} from './Slices/userAuth';
import {ForgetPassword} from './Slices/forgetPassword';
import {ResetPassword} from './Slices/resetPassword';
import {ResetOtp} from './Slices/resetOTP';
import {VerifyOTP} from './Slices/verifyOTP';
const storage = new MMKV();
const reduxPersistStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },

  getItem: (key: string) => {
    const Value = storage.getString(key);
    return Promise.resolve(Value);
  },

  deleteItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};
const persistConfig: any = {
  key: 'root',
  storage: reduxPersistStorage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, Reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({serializableCheck: false}).concat(
      TrainerAuth.middleware,
      userAuth.middleware,
      ForgetPassword.middleware,
      ResetPassword.middleware,
      ResetOtp.middleware,
      VerifyOTP.middleware
    ),
});
export const persistore = persistStore(store);
