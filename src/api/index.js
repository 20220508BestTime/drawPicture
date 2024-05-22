import axios from 'axios'

export const TIMEOUT = 10000

// const DEFAULT_CACHE_EXPIRY_TIME = 3000
// https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-391D3550-2FAB-43F0-AA4D-06929689EB22

const CONFIG = {
  // baseURL: 'https://cet.bryte.com.tw/api/v2',
  // baseURL: 'https://5bc7-2001-b011-8007-3b17-3cae-bde3-9aea-e67b.ngrok-free.app/',
  timeout: TIMEOUT,
  // headers: { Authorization: `Bearer ${token}` }
}
const instance = axios.create(CONFIG)

instance.interceptors.request.use(
  config => {
    // before request is sent
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers = { Authorization: `Bearer ${localStorage.getItem("token")}` }
    // }

    // console.log('interceptors.request config',config)
    return config
  },
  error => {
    // console.log('interceptors.request error',error)
    // request error
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  response => {
    // Do something with response data
    // console.log('interceptors.response response',response)
    return response;
  },
  error => {
    // console.log('interceptors.response error',error)
    return Promise.reject(error);
  }
);

/**
 * @param {string} method http的request methods
 * @param {string} url 同axios的url
 * @param {object} data axios收的params或data(依method決定)
 * @param {number} timeout(optional) 同axios config中的timeout
 * @param {number} noCache(optional) method為get 且傳入true時 不使用既有的快取
 */
export default async function ({
  method = '',
  url = '',
  data,
  timeout,
  noCache,
}) {
  // console.log('b')
  const config = {
    timeout,
    noCache,
  }
  method = method.toLowerCase()
  switch (method) {
    case 'get':
      // cache機制 檢查是否取出
      return instance.get(url, { params: data }, config)
    case 'post':
      return instance.post(url, data, config)
    case 'delete':
      config.params = data
      return instance.delete(url, config)
    case 'put':
      return instance.put(url, data, config)
    case 'patch':
      return instance.patch(url, data, config)
    default:
      // TODO: 這邊設計未知method的錯誤
      return Promise.reject()
  }
}
