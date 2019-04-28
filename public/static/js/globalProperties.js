/**
 * The global properties of doooly
 * 兜礼全局属性
 */

const globalProperties = {
  /**
   * 获取设备id,在ios中使用idfa，其它机型中使用uuid
   * Get device id, in ios used idfa otherwise uuid is used
   */
  getDeviceId() {
    if (navigator.userAgent.match(/iphone\sOS/i) == 'iphone os') {
      let ASIdentifierManager = plus.ios.importClass('ASIdentifierManager')
      let sharedManager = ASIdentifierManager.sharedManager()
      if (sharedManager.isAdvertisingTrackingEnabled()) {
        let advertisingIdentifier = sharedManager.advertisingIdentifier()
        let idfa = plus.ios.invoke(advertisingIdentifier, 'UUIDString')
        return idfa
      }
    } else {
      if (window.plus) {
        let device_id = plus.device.uuid.valueOf()
        return device_id.substring(0, 15)
      }
    }
  },
  /**
   * 获取url hash值中键为JsonData的值
   * Get value of the key named JsonData in the url hash value
   */
  getJsonData() {
    if (!location.hash.indexOf('?') > -1) return null

    let key = 'JsonData'
    let reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i')
    let r = location.hash.split('?')[1].match(reg)

    return r != null ? decodeURIComponent(r[2]) : null
  },
  /**
   * 通过原生方法获取参数并存储到localstorage
   * Get parameters by native's function and store them to localstorage
   */
  getLocalStorage() {
    if (typeof RHNativeJS != 'undefined') {
      if (RHNativeJS.getToken) localStorage.setItem('token', RHNativeJS.getToken())

      if (RHNativeJS.getPhone) localStorage.setItem('mobile', RHNativeJS.getPhone())

      if (RHNativeJS.getUserId) localStorage.setItem('userId', RHNativeJS.getUserId())

      if (RHNativeJS.groupShortName) localStorage.setItem('groupShortName', RHNativeJS.groupShortName())

      if (RHNativeJS.nativeLbsCity) localStorage.setItem('address', RHNativeJS.nativeLbsCity())

      if (RHNativeJS.getLoginUserNumber) localStorage.setItem('activateMobile', RHNativeJS.getLoginUserNumber())

      if (RHNativeJS.isOwnApp) localStorage.setItem('ownApp', RHNativeJS.isOwnApp())

      if (RHNativeJS.getUserName) localStorage.setItem('userName', RHNativeJS.getUserName())

      if (RHNativeJS.getVersionName) localStorage.setItem('versionName', RHNativeJS.getVersionName())

      if (RHNativeJS.getHtmlVersion) localStorage.setItem('htmlVersion', RHNativeJS.getHtmlVersion())

      if (RHNativeJS.getGroupID) localStorage.setItem('groupId', RHNativeJS.getGroupID())

      if (RHNativeJS.getBlocID) localStorage.setItem('blocId', RHNativeJS.getBlocID())

      if (RHNativeJS.getPaymentType) localStorage.setItem('isPayPassword', RHNativeJS.getPaymentType())
    }

    localStorage.setItem('isSetPayPassword', localStorage.getItem('isPayPassword') == 0 ? 0 : 1)

    let jsonData = this.getJsonData()
    // in app of dahua
    // if the hash of url contains a key that named 'JsonData' then set value of thirdUserToken to that key's value
    if (this.jsonData) {
      localStorage.setItem('thirdUserToken', jsonData)
    }

    return localStorage
  },
  /**
   * 通过本地存储数据和浏览器的userAgent获取浏览器名称
   * Get browser's name by localstorage data and browser's user-agent
   */
  getBrowserName() {
    let storage = this.getLocalStorage()
    let browserName = new UAParser().getResult().browser.name // default browser name

    if (browserName == 'WeChat' && navigator.userAgent.indexOf('wxwork') > -1) {
      //enterprise wechat
      browserName = 'enterpriseWX'
    } else if (browserName == 'Android Browser') {
      //own's andriod app
      browserName = 'Chrome WebView'
      if (storage.getItem('ownApp') == 'other')
        // andriod app of wisco
        browserName = 'wiscoAppAndriod'
    } else if (browserName == 'WebKit') {
      //own's ios app
      if (storage.getItem('ownApp') == 'other')
        // ios app of wisco
        browserName = 'wiscoAppIOS'
    }
    if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
      let userAgent = navigator.userAgent // 兜礼app会有标识
      let dooolyRegx = /doooly/i
      if (/otherdist/.test(location.href) || /thirdParty/.test(location.href) || /thirdPartyPay/.test(location.href) || storage.getItem('appUrlChannel') == 'thirdParty') {
        // other third-party's app
        if (!dooolyRegx.test(userAgent)) {
          browserName = 'otherAPP'
          storage.setItem('appUrlChannel', 'thirdParty') // to do
        }
      }
    }
    return browserName
  },
  /**
   * 通过url获取匹配到的接口域名
   * Get matching api domain by url
   */
  getAPIDomain() {
    const apiDomainMap = {
      local: {
        butterfly: 'https://admin.doooly.com/reachtest/',
        doooly: 'https://admin.doooly.com/Doooly/',
        activity: 'https://admin.doooly.com/activity/',
        order: '/admin/doooly-order/',
        action: '/admin8410/doooly-action/'
      },
      dev: {
        butterfly: 'https://admin.doooly.com/reachtest/',
        doooly: 'https://admin.doooly.com/Doooly/',
        activity: 'https://admin.doooly.com/activity/',
        order: 'https://admin.doooly.com/doooly-order/',
        action: 'https://test.doooly.cn:8410/doooly-action/'
      },
      test: {
        butterfly: 'https://admin.doooly.com/reach_api/',
        doooly: 'https://admin.doooly.com/doooly_api/',
        activity: 'https://admin.doooly.com/activity/',
        order: 'https://admin.doooly.com/doooly-order/',
        action: 'https://test.doooly.cn:8410/doooly-action/'
      },
      pre: {
        butterfly: 'https://reach-life.com/pre_api/',
        doooly: 'https://api.doooly.com/pre_doooly/',
        activity: 'https://reach-life.com/pre_activity_api/',
        order: 'https://api.doooly.com/pre_order/',
        action: 'https://api.doooly.com/pre_action/'
      },
      prod: {
        butterfly: 'https://reach-life.com/pro_api/',
        doooly: 'https://api.doooly.com/pro_doooly/',
        activity: 'https://reach-life.com/pro_activity_api/',
        order: 'https://api.doooly.com/pro_order/',
        action: 'https://api.doooly.com/pro_action/'
      }
    }

    let currentEnv = 'local' // set default enviorment value is local
    if (location.protocol == 'https:') {
      // Determine if the current enviorment is development by the host name is starts with 'f' or the href is contains 'reachtest'
      if (location.host.startsWith('f') || location.href.indexOf('reachtest') > -1) {
        currentEnv = 'dev'
      }
      // Determine if the current enviorment is test by the host name is starts with 't' or the href is contains 'reach_dist'
      else if (location.host.startsWith('t') || location.href.indexOf('reach_dist') > -1) {
        currentEnv = 'test'
      }
      // Determine if the current enviorment is pre by the href is contains 'pre_'
      else if (location.href.indexOf('pre_') > -1) {
        currentEnv = 'pre'
      }
      // Determine if the current enviorment is pre by the href is contains 'pro_'
      else if (location.href.indexOf('pro_')) {
        currentEnv = 'pro'
      }
    }

    return apiDomainMap[currentEnv]
  },
  /**
   * 通过url获取匹配到的前端域名
   * Get matching frontend domain by url
   */
  getFrontendDomain() {
    let frontendDomain = {}

    let appId = [
      'wx2d328083c1b00c6a', // dev and test's appid
      'wx07dc2a87c3d4ec88' // pre and prod's appid
    ]
    let redirectType = '/dist/' // default type
    if (/wiscowechat/.test(location.href)) {
      // in wechat of wisco
      appId = ['wx58ada8d1e44c4f7b', 'wx93b36cf949d5fb6c']
      redirectType = '/wiscowechat/'
    } else if (/zfhwechat/.test(location.href)) {
      // in wechat of zfh
      redirectType = '/zfhwechat/'
    }

    const frontendDomainMap = {
      local: {
        m: 'http://' + window.location.hostname + ':8080/#/',
        activity: 'http://' + window.location.hostname + ':8001/#/',
        cashier: 'http://' + window.location.hostname + ':8002/#/',
        thirdWebSite: 'http://' + window.location.hostname + ':8080/#/',
        wx: ''
      },
      dev: {
        m: 'https://admin.doooly.com/reachtest/dist/#/',
        activity: 'https://admin.doooly.com/reachtest/activity/#/',
        cashier: 'https://admin.doooly.com/reachtest/cashier_v2.2.1/#/',
        thirdWebSite: 'https://admin.doooly.com/reachtest/thirdParty/#/',
        wx: ''
      },
      test: {
        m: 'https://admin.doooly.com/reach_dist/dist/#/',
        activity: 'https://admin.doooly.com/reach_dist/activity/#/',
        cashier: 'https://admin.doooly.com/reach_dist/cashier_v2.2.1/#/',
        thirdWebSite: 'https://admin.doooly.com/reach_dist/thirdParty/#/',
        wx: ''
      },
      pre: {
        m: 'https://reach-life.com/pre_dist/dist/#/',
        activity: 'https://reach-life.com/pre_activity/activity/#/',
        cashier: 'https://reach-life.com/pre_cashier/cashier/#/',
        thirdWebSite: 'https://reach-life.com/pre_dist/thirdParty/#/',
        wx: ''
      },
      prod: {
        m: 'https://reach-life.com/pro_dist/dist/#/',
        activity: 'https://reach-life.com/pro_activity/activity/#/',
        cashier: 'https://reach-life.com/pro_cashier/cashier/#/',
        thirdWebSite: 'https://reach-life.com/pro_dist/thirdParty/#/',
        wx: ''
      }
    }

    let currentEnv = 'local' // set default enviorment value is local
    // new version domain judge rules
    if (location.host.startsWith('f') || location.host.startsWith('t')) {
      frontendDomain = {
        m: `${location.host}/m/#/`,
        activity: `${location.host}/activity/#/`,
        cashier: `${location.host}/cashier/#/`,
        wx: ''
      }
    }
    // old version domain judge rules
    else {
      if (location.protocol == 'https:') {
        // determine if the current enviorment is development by the href is contains 'reachtest'
        if (location.href.indexOf('reachtest') > -1) {
          currentEnv = 'dev'
        }
        // determine if the current enviorment is test by the href is contains 'reach_dist'
        else if (location.href.indexOf('reach_dist') > -1) {
          currentEnv = 'test'
        }
        // determine if the current enviorment is pre by the href is contains 'pre_'
        else if (location.href.indexOf('pre_') > -1) {
          currentEnv = 'pre'
        }
        // determine if the current enviorment is pre by the href is contains 'pro_'
        else if (location.href.indexOf('pro_')) {
          currentEnv = 'pro'
        }
      }

      frontendDomain = frontendDomainMap[currentEnv]
      let storage = this.getLocalStorage()
      let htmlVersion = storage.getItem('htmlVersion') || ''
      // if localstorage has exists htmlVersion then replace version
      if (htmlVersion) {
        frontendDomain.m = frontendDomain.m.replace('/dist/', `/dist_v${htmlVersion}/`)
        frontendDomain.activity = frontendDomain.activity.replace('/activity/', `/activity_v${htmlVersion}/`)
        frontendDomain.cashier = frontendDomain.cashier.replace('/cashier/', `/cashier_v${htmlVersion}/`)
      }
    }

    let currentAppId = ['pre', 'pro'].includes(currentEnv) ? appId[1] : appId[0]
    frontendDomain.wx = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${currentAppId}&redirect_uri=${frontendDomain.m.replace('/dist/', redirectType)}white&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`

    return frontendDomain
  },
  /**获取http请求的头文件
   * Get headers for http request
   */
  getHeaders() {
    let storage = this.getLocalStorage()
    let browserName = this.getBrowserName()
    let headers = {
      channel: '', // 区分大致来源
      thirdPartyChannel: '', // 区分具体某一个第三方来源
      deviceId: this.getDeviceId() || storage.getItem('userId'), // 设备ID
      thirdUserToken: '' // 大华的免登录令牌
    }

    switch (browserName) {
      case 'WeChat': // in wechat browser
        if (location.href.indexOf('wiscowechat') > -1 && storage.getItem('wiscowechatCodeType')) {
          headers.channel = 'wiscowechat' // in wechat browser of wisco
        } else {
          headers.channel = 'wechat' // in other wechat browsers besides wisco
        }

        let wiscoToken = storage.getItem('wiscoToken')
        let dooolyToken = storage.getItem('dooolyToken')
        // wiscotoken is used in wechat browser of wisco,otherwise dooolytokne is used
        if (location.href.indexOf('wiscowechat') > -1 && wiscoToken) {
          headers.token = wiscoToken
        } else if (dooolyToken) {
          headers.token = dooolyToken
        }
        break
      case 'WebKit':
      case 'Chrome WebView':
        headers.channel = 'app' // in own's app
        break
      case 'otherAPPAndroid':
      case 'otherAPPIos':
        headers.channel = 'wiscoapp' // in app of wisco
        break
      default:
        headers.channel = 'h5' // other scenarios besides above
        break
    }

    if (storage.getItem('thirdUserToken') && browserName != 'WeChat') {
      headers.thirdPartyChannel = 'dahua'
    }

    return headers
  }
}