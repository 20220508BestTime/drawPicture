import request from '@/api/index'

// export const initTodayPickup = () => {
//   const url = '/Init/InitTodayPickup'
//   const method = 'post'
//   return request({
//     method,
//     url,
//   })
// }

// export const getLineInformation = () => {
//   const url = '/Auth/LineLogin'
//   const method = 'get'
//   return request({
//     method,
//     url,
//   })
// }

const addToUrl = (payload) => {
  let str = '?'
  for(let key in payload){
      str += key + '=' + payload[key] + '&'
  }
  str = str.substring(0,str.length-1)
  return str
}