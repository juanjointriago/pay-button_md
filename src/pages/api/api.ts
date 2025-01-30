
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


API.interceptors.response.use((response) => response, (error) => {
  if (axios.isCancel(error)) return Promise.reject(error);

  // Verificar si el status es 401
  if (error.response && error.response.status === 401) {
    const res = error.response;
    if (res.data.error_message) res.data.error_message = 'Sesión expirada';

    if (window.location.pathname.includes('auth')) return Promise.reject(error);

    // Redireccionar a /logout
    window.location.href = '/logout';
  }

  return Promise.reject(error);
});



export default API;
