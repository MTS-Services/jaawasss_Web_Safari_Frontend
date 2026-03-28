import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem("sourcenest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
