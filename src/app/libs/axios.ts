import axiosInstance from 'axios';
import { config } from '@/core/config';
import { firebaseAuth } from './firebase';

const axios = axiosInstance.create({
  baseURL: config.apiURL,
});

axios.interceptors.request.use(
  async (config) => {
    const token = await firebaseAuth.currentUser.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { axios };
