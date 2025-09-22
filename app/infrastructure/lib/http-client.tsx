import axios from "axios";

export const HttpClient = (baseURL = process.env.API_URL) => {
  const instance = axios.create({ baseURL });

  return {
    async get<T>(url: string, options?: any) {
      return await instance.get<T>(url, options);
    },
    async post<T>(url: string, data?: any, options?: any) {
      return await instance.post<T>(url, data, options);
    },
  };
};
