import axios from 'axios';
import {baseUrl} from './Urls';
const axiosBaseURL = axios.create({
  baseURL: baseUrl,
});

export default axiosBaseURL;
