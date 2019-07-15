import axios from './http';

export const getApi = (params,path) => {
  return axios({
  method:'get',
  url:`/${path}`,
  params: params
})
  .then(res => res); };
export const postApi = (params,path) => {
  console.log(params);
  return axios({
  method:'post',
  url:`/${path}`,
  data: params
})
  .then(res => res); };
