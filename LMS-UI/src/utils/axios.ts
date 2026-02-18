import axios, { type AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const jwtAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

jwtAxios.interceptors.response.use(
  (res: AxiosResponse<any, any>) => {
    console.log(res, "interceptor");
    return res;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);

export default jwtAxios;
