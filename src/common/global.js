import {
    Indicator,
    Toast,
    MessageBox
} from 'mint-ui'
import {
    errorLog
} from '@/service'

/**
 * global properties
 */
const GlobalProperty = {
    browserName: globalProperties.getBrowserName(),
    apiDomain: globalProperties.getAPIDomain(),
    frontendDomain: globalProperties.getFrontendDomain(),
    localStorage: globalProperties.getLocalStorage(),
    headers: globalProperties.getHeaders()
}

/**
 * global functions
 */
const GlobalFunction = {
    // log out
    logout: () => {
        let browserName = GlobalProperty.browserName
        let storage = GlobalProperty.localStorage

        // ios
        if (browserName == 'Webkit' || browserName == 'OtherAppIOS') {
            webkit.messageHandlers.forceLoginOut.postMessage('1')
        }
        // android 
        else if (browserName == 'Chrome WebView' || browserName == 'OtherAppAndroid') {
            RHNativeJS.forceLoginOut('')
        }
        // h5
        else {
            // set redirect url for jump after login
            storage.setItem('loginUrl', location.href)

            let token, wiscoToken
            token = storage.getItem('token')
            wiscoToken = storage.getItem('wiscoToken')

            // clear token
            storage.removeItem('token')
            if (token == wiscoToken) {
                storage.removeItem('wiscoToken')
                location.href.replace(`${Property.frontendDomain.m}/companyLogin/wugang`)
            } else {
                storage.removeItem('dooolyToken')
                location.replace(Property.frontendDomain.m)
            }
        }
    },
    // upload error log
    uploadErrorLog: (error) => {
        let browserName = GlobalProperty.browserName
        let clientChannel = 'h5'
        if (browserName == 'WeChat') {
            clientChannel = 'wechat'
        } else if (browserName == 'WebKit') {
            clientChannel = 'iOS'
        } else if (browserName == 'Chrome WebView') {
            clientChannel = 'Android'
        }

        let timestamp = new Date().getTime()
        let storage = GlobalProperty.localStorage
        let userId = storage.getItem('userId')
        let appVersion = storage.getItem('versionName')
        let pageUrl = location.href

        errorLog(timestamp, clientChannel, '', error, '', userId, appVersion, pageUrl)
    }
}


/**
 * mint-ui
 */
const MintUI = {
    Indicator: {
        open(options) {
            return Indicator.open(Object.assign({}, {
                text: '加载中...',
                spinnerType: 'snake'
            }, options))
        },
        close() {
            return Indicator.close()
        }
    },
    Toast: {
        open(options) {
            return Toast(Object.assign({}, {
                message: '',
                position: 'middle',
                duration: 2000
            }, options))
        }
    },
    MessageBox
}

export {
    GlobalProperty,
    GlobalFunction,
    MintUI
}