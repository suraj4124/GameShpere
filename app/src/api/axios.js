import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL from app.json extra config or fallback to localhost
// Ideally this comes from environment variables
// using the LAN IP from the Expo start output
const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://10.195.29.72:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., token expired)
      // We might want to dispatch a logout action here if we had access to the store/context directly
      // For now, we'll just clear the token
      await AsyncStorage.removeItem('userToken');
      // You might successfully return a rejection here to handle it in the UI
    }
    return Promise.reject(error);
  }
);

export default api;
