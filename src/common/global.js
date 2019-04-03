import {
    Indicator,
    Toast,
    MessageBox
} from 'mint-ui'
import Host from '@/common/host'

/**
 * browser
 */
const Browser = {
    name: '',
    setName: function (name) {
        this.name = name
    },
    getName: function () {
        return this.name
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

/**
 * global functions
 */
const GloabalFun = {
    // log out
    logout: () => {
        let browserName = Browser.getName()

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
            localStorage.setItem('loginUrl', location.href)

            let token, wiscoToken
            token = localStorage.getItem('token')
            wiscoToken = localStorage.getItem('wiscoToken')

            // clear token
            localStorage.removeItem('token')
            if (token == wiscoToken) {
                localStorage.removeItem('wiscoToken')
                location.href.replace(`${Host.mainWebsite}/companyLogin/wugang`)
            } else {
                localStorage.removeItem('dooolyToken')
                location.replace(Host.mainWebsite)
            }
        }
    },
    // upload error log
    uploadErrorLog: () => {

    }
}

export {
    Browser,
    MintUI,
    GloabalFun
}