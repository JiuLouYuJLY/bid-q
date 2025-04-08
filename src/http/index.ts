import axios from "axios";

export const baseURL = "http://localhost:8080/api/";

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.headers.token) {
      localStorage.setItem("token", response.headers.token);
    }
    return response;
  },
  (error) => {
    // if (error.response.status === 401) {
    //   localStorage.removeItem("token");
    // }
    return Promise.reject(error);
  }
);

export default instance;