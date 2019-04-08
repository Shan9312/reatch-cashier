import axios from 'axios'
import {
  GlobalProperty,
  GlobalFunction,
  MintUI
} from '@/common/global'

const defaultData = {

}
const defaultOptions = {

}

const request = (method, url, data, options = {}) => {
  let browserName, storage, headers, token, groupId, channel

  browserName = GlobalProperty.browserName
  storage = GlobalProperty.localStroage
  headers = GlobalProperty.headers

  token = storage.getItem('token')
  groupId = stroage.getItem('groupId')
  channel = headers['channel']

  // set http request parameters
  data = Object.assign({}, defaultData, data)
  options = Object.assign({}, defaultOptions, {
    method,
    url,
    data
  }, options)

  // set http request headers
  if (token) options.headers['token'] = token
  if (groupId) options.headers['groupId'] = groupId
  if (channel) options.headers['channel'] = channel

  // in our's android app that will be use android native function to open loading modal else use h5 function
  if (browserName === 'Chrome WebView' && !data.outApp) {
    RHNativeJS.showWaitPanel()
  } else {
    MintUI.Indicator.open()
  }

  return axios.request(options).then(res => {
    let resData = res.data

    // unauthorized
    if (resData.code && resData.code == '40001') {
      // hint error message
      MintUI.Toast.open({
        message: resData.info
      })
      // log out
      GlobalFunction.logout()
    }

    return Promise.resolve(data)
  }).catch(err => {
    MintUI.Toast.open({
      message: '小兜兜正忙,请稍候重试!'
    })

    if (!navigator.onLine) return false
    GlobalFunction.uploadErrorLog()

    return Promise.reject(err)
  }).finally(() => {
    // in our's android app that will be use android native function to close loading modal else use h5 function
    if (browserName === 'Chrome WebView' && !data.outApp) {
      RHNativeJS.hideWaitPanel()
    } else {
      MintUI.Indicator.close()
    }
  })
}

export default {
  get: (url, data = {}) => {
    let params, timestamp

    // set timestamp
    timestamp = new Date().getTime()
    data['timestamp'] = timestamp

    // convert object data to url parameters
    Object.keys(data).forEach(key => {
      params += `&${key}=${data[key]}`;
    });
    params = `?${params.substring(1)}`;

    request('get', `${url}${params}`)
  },
  post: (url, data, options) => {
    request('post', url, data, options)
  }
}