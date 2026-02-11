import {configureStore} from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import Reducers from './Slices';
import {MMKV} from 'react-native-mmkv';
import {persistReducer, persistStore} from 'redux-persist';
import {TrainerAuth} from './Apis/trainerAuth';
import {userAuth} from './Apis/userAuth';
import {Posts} from './Apis/Post';

const storage = new MMKV();
const reduxPersistStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },

  getItem: key => {
    const Value = storage.getString(key);
    return Promise.resolve(Value);
  },

  deleteItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};
const persistConfig = {
  key: 'root',
  storage: reduxPersistStorage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, Reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({
      serializableCheck: false,
      // immutableCheck: false,
    }).concat(TrainerAuth.middleware, userAuth.middleware, Posts.middleware),
});
export const persistore = persistStore(store);
