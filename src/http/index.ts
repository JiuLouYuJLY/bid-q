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
    if (response.data.code === 401 && response.data.message === "无效的token") {
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;