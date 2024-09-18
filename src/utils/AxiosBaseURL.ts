import axios from 'axios';

const axiosBaseURL = axios.create({
  baseURL: 'http://192.168.0.101:6000',
});

export default axiosBaseURL;
