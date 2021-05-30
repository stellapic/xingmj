import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import QS from 'qs';
import { message } from 'antd'

export const baseUrl = 'http://139.198.19.132:8080' 

const service = axios.create({
  baseURL: baseUrl
})

service.interceptors.request.use((config: AxiosRequestConfig) => { 
  const token = window.localStorage.getItem('userToken');
  config.data = Object.assign({}, config.data, {
    token: token,
  })
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
  config.data = QS.stringify(config.data)
  return config
}, error => { 
  return error;
});

service.interceptors.response.use((response: AxiosResponse) => {
  if (response.status) {
    switch (response.status) {
      case 200:
        return response.data;
      case 401:
        // TODO: not logged in
        break;
      case 403:
        // TODO: token expire
        break;
      default:
        message.error(response.data.message);
    }
  } else { 
    return response;
  }
});

export default service;
