import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

export interface ApiErrorData {
  message: string;
}

const abortControllers = new Map<string, AbortController>();

const generateRequestToken = (config: InternalAxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return `${String(method)}-${String(url)}-${JSON.stringify(
    params
  )}-${JSON.stringify(data)}`;
};

const http = axios.create({
  baseURL: "http://192.168.5.72:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session: any | null = await getSession();
    const requestToken = generateRequestToken(config);
    const abortController = new AbortController();
    abortControllers.set(requestToken, abortController);
    config.signal = abortController.signal;

    config.headers.Authorization = `Bearer ${session?.user?.token}`;

    return config;
  },
  async (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorData>) => {
    if (axios.isAxiosError(error) && error.response) {
      if (error?.response.status === 401) {
        // signOut({ callbackUrl: "/login" });
        return "";
      }
    }
    throw error;
  }
);

export const cancelRequest = (config: InternalAxiosRequestConfig) => {
  const requestToken = generateRequestToken(config);
  const abortController = abortControllers.get(requestToken);
  if (abortController) {
    abortController.abort();
    abortControllers.delete(requestToken);
  }
};

export default http;
