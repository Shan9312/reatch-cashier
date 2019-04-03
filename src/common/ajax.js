import axios from 'axios'
import {
    Browser,
    MintUI,
    GlobalFun
} from '@/common/global'
import {
    GloabalFun
} from './global';

const defaultData = {

}
const defaultOptions = {

}

const request = (method, url, data, options = {}) => {
    let token, groupId, channel
    let browserName = Browser.getName()

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
            GlobalFun.logout()
        }

        return Promise.resolve(data)
    }).catch(err => {
        MintUI.Toast.open({
            message: '小兜兜正忙,请稍候重试!'
        })

        if (!navigator.onLine) return false
        GloabalFun.uploadErrorLog(browserName, error)

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
    get: (url, data = {}, options) => {
        let params, timestamp

        // set timestamp for let http get request lose efficacy
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