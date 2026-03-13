import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL
});


client.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default client;