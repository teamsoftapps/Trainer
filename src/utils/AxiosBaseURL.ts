import axios from 'axios';

const axiosBaseURL = axios.create({
  baseURL: 'http://192.168.0.117:3000',
});

export default axiosBaseURL;
