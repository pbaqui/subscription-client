import axios from 'axios';
import AuthService from "../services/AuthService";
import history from "../utils/History";

const instance = axios.create({
  baseURL: 'http://localhost:3010/api',
});

instance.interceptors.request.use(
  async (config) => {
    const user = JSON.parse(localStorage.getItem('sc-user'));

    if (user) {
      config.headers.Authorization = user.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Interceptor para llamar a refreshToken cuando el access token vence.
instance.interceptors.response.use(
  response => response,
  async error => {
    console.log('ERROR', error);
    if (error.response && error.response.status === 401) {
        AuthService.logout();
        history.push(`/signin`);
    }
    return Promise.reject(error);
  }
);

export default instance;