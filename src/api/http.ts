import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import formatJsonToUrlParams, { InstanceObject } from '~/utils/format';

const BASE_PREFIX = import.meta.env.VITE_API_BASEURL;
// 创建实例
const axiosInstance: AxiosInstance = axios.create({
  // 前缀
  baseURL: BASE_PREFIX,
  // 超时
  timeout: 1000 * 30,
  // 请求头
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // TODO 在这里可以加上想要在请求发送前处理的逻辑
    // TODO 比如 loading 等
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    ElMessage.info(JSON.stringify(response.status));
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    if (response) {
      if (response.data.template) {
        return Promise.reject(response.data);
      }
      ElMessage.error(response.data?.description?.message || response.data.message);
      return Promise.reject(response.data);
    }
    ElMessage.warning('The network connection is abnormal, please try again later');
    return Promise.reject(error);
  },
);
const service = {
  get<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.get(url, { params: data });
  },

  post<T = any>(url: string, data?: object, params?: object): Promise<T> {
    return axiosInstance.post(url, data, { params });
  },

  put<T = any>(url: string, data?: object, params?: object): Promise<T> {
    return axiosInstance.put(url, data, { params });
  },

  delete<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.delete(url, { data });
  },

  upload: (url: string, file: FormData | File) =>
    axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (url: string, data: InstanceObject) => {
    window.location.href = `${BASE_PREFIX}/${url}?${formatJsonToUrlParams(data)}`;
  },
};

export default service;
