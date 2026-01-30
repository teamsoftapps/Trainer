import {useState} from 'react';
import axiosBaseURL from '../services/AxiosBaseURL';

const followingHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFollow = async (userID, trainerID) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosBaseURL.post('/common/Follow', {
        userID,
        trainerID,
      });

      return res?.data;
    } catch (err) {
      console.log('Hook error', err);
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const unFollow = async (userID, trainerID) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosBaseURL.post('/common/unFollow', {
        userID,
        trainerID,
      });

      return res?.data;
    } catch (err) {
      console.log('Hook error', err);
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return {isFollow, unFollow, loading, error};
};

export default followingHook;
