// 判断使用类型(WeChat,app(苹果：WebKit,安卓：Chrome WebView), 浏览器)
// 根据browserName设置环境memberFrom、localStorage信息
const BrowserEnv = (browserName) => {

  var memberFrom = '兜礼会员'
  // 获取用户信息（安卓）
  if (browserName === 'Chrome WebView' || browserName === 'otherAPPAndroid') {
    localStorage.token = RHNativeJS.getToken()
    localStorage.mobile = RHNativeJS.getPhone()
    localStorage.userId = RHNativeJS.getUserId()
    localStorage.groupShortName = RHNativeJS.getGroupShortName()
    localStorage.address = RHNativeJS.nativeLbsCity()
    localStorage.activateMobile = RHNativeJS.getLoginUserNumber()
    localStorage.authType = RHNativeJS.getAuthType()
    localStorage.ownApp = RHNativeJS.isOwnApp()
    localStorage.userName = RHNativeJS.getUserName()

    // 新增版本号方法
    if (RHNativeJS.getVersionName) {
      localStorage.versionName = RHNativeJS.getVersionName()
    }
    // 获取前端地址版本号
    if (RHNativeJS.getHtmlVersion) {
      localStorage.htmlVersion = RHNativeJS.getHtmlVersion()
    }
    if (RHNativeJS.getPaymentType) {
      localStorage.isPayPassword = RHNativeJS.getPaymentType()
      if (localStorage.isPayPassword === 0) {
        localStorage.isSetPayPassword = 0
      } else {
        localStorage.isSetPayPassword = 1
      }
    }
    if (RHNativeJS.getGroupID) {
      localStorage.groupId = RHNativeJS.getGroupID()
      localStorage.blocId = RHNativeJS.getBlocID()
    }
  }
  // 定义武钢BrowserName
  if (browserName === 'Chrome WebView' && localStorage.ownApp === 'other') {
    Vue.prototype.$BrowserName = 'otherAPPAndroid'
    memberFrom = '武钢会员'
  }
  if (browserName === 'WebKit' && localStorage.ownApp === 'other') {
    Vue.prototype.$BrowserName = 'otherAPPIos'
    memberFrom = '武钢会员'
  }

  if (/wiscowechat/.test(window.location.href)) {
    memberFrom = '钢城e家会员'
  }
  // 判断是否为微信浏览器
  const isWeiXin = function () {
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      return true
    } else {
      return false
    }
  }
  // 判断是否为pc浏览器
  const IsPC = function () {
    var userAgentInfo = navigator.userAgent
    var Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod',
    ]
    var flag = true
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }
  // 微信Url
  const WxAppIdUrls = () => {
    let wxConfig
    let _weixinUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
    // 微信首页跳转签名url
    let config = {
      'wiscowechat': {
        channelText: encodeURIComponent('https://admin.doooly.com/reachtest/wiscowechat/#/white'),
        channelMain: encodeURIComponent('https://admin.doooly.com/reach_dist/wiscowechat/#/white'),
        channeltextDoooly: encodeURIComponent('https://reach-life.com/pre_dist/wiscowechat/#/white'),
        channelDoooly: encodeURIComponent('https://reach-life.com/pro_dist/wiscowechat/#/white'),
        appidText: 'wx58ada8d1e44c4f7b',
        appidMain: 'wx58ada8d1e44c4f7b',
        appidDoooly: 'wx93b36cf949d5fb6c'
      },
      'zfhwechat': {
        channelText: encodeURIComponent('https://admin.doooly.com/reachtest/zfhwechat/#/white'),
        channelMain: encodeURIComponent('https://admin.doooly.com/reach_dist/zfhwechat/?t=1#/white'),
        channeltextDoooly: encodeURIComponent('https://reach-life.com/pre_dist/zfhwechat/#/white'),
        channelDoooly: encodeURIComponent('https://reach-life.com/pro_dist/zfhwechat/#/white'),
        appidText: 'wx2d328083c1b00c6a',
        appidMain: 'wx2d328083c1b00c6a',
        appidDoooly: 'wx07dc2a87c3d4ec88'
      },
      'other': {
        channelText: encodeURIComponent('https://admin.doooly.com/reachtest/dist/#/white'),
        channelMain: encodeURIComponent('https://admin.doooly.com/reach_dist/dist/?t=1#/white'),
        channeltextDoooly: encodeURIComponent('https://reach-life.com/pre_dist/dist/#/white'),
        channelDoooly: encodeURIComponent('https://reach-life.com/pro_dist/dist/#/white'),
        appidText: 'wx2d328083c1b00c6a',
        appidMain: 'wx2d328083c1b00c6a',
        appidDoooly: 'wx07dc2a87c3d4ec88'
      }
    }
    for (let key in config) {
      let regKey = new RegExp(key)
      wxConfig = config['other'] // 默认用other
      if (config.hasOwnProperty(key) === true && regKey.test(window.location.href)) {
        wxConfig = config[key]
      }
    }
    console.log(wxConfig)
    return {
      text: _weixinUrl + wxConfig.appidText + '&redirect_uri=' + wxConfig.channelText + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      Main: _weixinUrl + wxConfig.appidMain + '&redirect_uri=' + wxConfig.channelMain + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      textDoooly: _weixinUrl + wxConfig.appidDoooly + '&redirect_uri=' + wxConfig.channeltextDoooly + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
      Doooly: _weixinUrl + wxConfig.appidDoooly + '&redirect_uri=' + wxConfig.channelDoooly + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
    }
  }
  return {
    memberFrom,
    isWeiXin,
    IsPC,
    WxAppIdUrls
  }
}

export default BrowserEnv
