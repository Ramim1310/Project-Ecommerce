import axios from 'axios';
import { getToken } from '../utils/auth';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    'Content-Type': 'application/json'
  }
});


API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;


export const fetchCatalog = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/products/catalog${queryParams ? `?${queryParams}` : ""}`;
    
    const response = await API.get(url);
    const result = response.data;
    return { data: result.data, pagination: result.pagination };
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { data: [], pagination: { total: 0, page: 1, limit: 9, totalPages: 1 } };
  }
};