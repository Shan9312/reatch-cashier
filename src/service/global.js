import Vue from 'vue'
import Cookies from 'js-cookie'
import '@/assets/css/common.css'
import '@/assets/css/reset.css'
import '@/tools/ua-parser.min.js'
import '@/tools/deviceInit.js'
import '@/service/components'
import BrowserEnv from '@/tools/browserEnv.js'
import DooolyFun from '@/tools/dooolyAPP.js'
import BaiduStats from '@/tools/umeng.js'
import Utils from '@/tools/utils'
import Router from '@/service/routerIntercept'
import Http from '@/service/http'
import Constant from '@/service/constant'
import Wechat from '@/service/weixin'

const parser = new UAParser()
const result = parser.getResult()
let browser = result.browser.name
if (browser === 'Android Browser') {
  browser = 'Chrome WebView'
} else if (browser == 'WeChat' && navigator.userAgent.indexOf('wxwork') > -1) {
  browser = 'enterpriseWX'
}
// 第三方app打开指定browserName
let userAgent = window.navigator.userAgent // 兜礼app会有标识
let dooolyRegx = /doooly/i
if (browser === 'Chrome WebView' || browser === 'WebKit') {
  if (window.location.href.indexOf('thirdPartyPay') > -1 || localStorage.appUrlChannel === 'thirdParty') {
    // thirdPartyPay地址，不是兜礼app的情况
    if (!dooolyRegx.test(userAgent)) {
      browser = 'thirdApp'
      localStorage.appUrlChannel = 'thirdParty'
    }
  }
}
Vue.prototype.$Cookies = Cookies
Vue.prototype.$BrowserName = browser
Vue.prototype.$Utils = Utils
Vue.prototype.$BrowserEnv = BrowserEnv(Vue.prototype.$BrowserName)
Vue.prototype.$BaiduStats = BaiduStats(Vue.prototype.$BrowserName)
Vue.prototype.$DooolyAPP = DooolyFun(Vue.prototype.$BrowserName)
Vue.prototype.$Http = Http(Vue.prototype.$BrowserName, Vue.prototype.$Utils.getUrlParams)
Vue.prototype.$Constant = Constant(Vue.prototype.$BrowserName)
Vue.prototype.$Wechat = Wechat(Vue)
const routerOption = {
  browserName: Vue.prototype.$BrowserName,
  constant: Vue.prototype.$Constant,
  getUrlParams: Vue.prototype.$Utils.getUrlParams
}
const router = Router(routerOption)

export default {
  router
}
