import axios, { AxiosHeaders } from "axios";
import { API_HOST } from "../../constants/constants";

export const baseURL = `${API_HOST}/api/`;
const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("auth-token", token);
    } else {
      config.headers = {
        ...config.headers as any,
        "auth-token": token,
      };
    }
  }
  // console.log("Headers enviados:", config.headers); // Inspecciona los encabezados
  return config;
});



export default API;
