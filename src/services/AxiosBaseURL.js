// import axios from 'axios';
// import {baseUrl} from './Urls';
// const axiosBaseURL = axios.create({
//   baseURL: baseUrl,
// });

// export default axiosBaseURL;

import axios from 'axios';
import {baseUrl} from './Urls';
import {store} from '../store/store';
// import store from '../store'; // ⭐ import redux store
const axiosBaseURL = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
});

// 🔥 INTERCEPTOR → attach token automatically
axiosBaseURL.interceptors.request.use(
  config => {
    const token = store.getState()?.Auth?.data?.token;

    // console.log('Token i axios:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default axiosBaseURL;
