import {useState} from 'react';
import axiosBaseURL from '../services/AxiosBaseURL';

const followingHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFollow = async (userID: any, trainerID: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosBaseURL.post('/common/Follow', {
        userID: userID,
        trainerID: trainerID,
      });

      return res?.data;
    } catch (error) {
      console.log('Hook error', error);
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const unFollow = async (userID: any, trainerID: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosBaseURL.post('/common/unFollow', {
        userID: userID,
        trainerID: trainerID,
      });
      return res?.data;
    } catch (error) {
      console.log('Hook error', error);
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return {isFollow, unFollow, loading, error};
};
export default followingHook;
