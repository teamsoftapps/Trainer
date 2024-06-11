import {configureStore} from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import Reducers from './Slices';
import {MMKV} from 'react-native-mmkv';
import {persistReducer, persistStore} from 'redux-persist';

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
    getdefaultMiddleware({serializableCheck: false}).concat(thunk),
});
export const persistore = persistStore(store);
