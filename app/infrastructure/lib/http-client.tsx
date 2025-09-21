import axios from "axios";
import { redirect } from "react-router";

export const HttpClient = (baseURL = process.env.API_URL) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        throw redirect("/sign-in");
      }
      return Promise.reject(error);
    },
  );

  return {
    async get<T>(url: string, options?: any) {
      return await instance.get<T>(url, options);
    },
    async post<T>(url: string, data?: any, options?: any) {
      return await instance.post<T>(url, data, options);
    },
  };
};
