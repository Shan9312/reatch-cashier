import routerConfig from '@/router'
import Cookies from 'js-cookie'
const cookieObj = {
  expires: new Date(2020, 11, 19),
  path: '/',
  domain: window.location.hostname
}
const Router = (routerOption) => {
  const loginjump = () => {
    let loginUrl = window.location.href
    // 美团不做登录校验跳转
    if (routerOption.getUrlParams('orderSource') === 'meituan') return
    if (loginUrl) {
      localStorage.loginUrl = loginUrl
      Cookies.set('loginUrl', loginUrl, cookieObj)
    }
    let url = routerOption.constant.webSite
    localStorage.removeItem('wiscowechatCodeType')
    localStorage.removeItem('token')

    if (/wiscowechat/.test(window.location.href)) {
      localStorage.removeItem('wiscoToken')
      window.location.replace(url + 'companyLogin/wugang')
    } else if (/zfhwechat/.test(window.location.href)) {
      localStorage.removeItem('dooolyToken')
      window.location.replace(url + 'companyLogin/zfh')
    } else {
      localStorage.removeItem('dooolyToken')
      window.location.replace(url)
    }
  }
  // 登录拦截白名单
  let whiteList = ['middle'];
  let isWhiteList = false;
  whiteList.forEach(white => {
    if (location.hash.indexOf(white) !== -1) {
      isWhiteList = true;
    }
  })
  // console.log(routerOption.getUrlParams('orderSource'))
  // 输入地址进入登录拦截
  if (!(localStorage.token || Cookies.get('token')) && !isWhiteList) {
    if (routerOption.browserName == "WebKit" || routerOption.browserName == "otherAPPIos") {
      window.webkit.messageHandlers.forceLoginOut.postMessage("1")
    } else if (routerOption.browserName == "Chrome WebView" || routerOption.browserName == "otherAPPAndroid") {
      RHNativeJS.forceLoginOut("")
    } else {
      loginjump()
    }
  }
  // 路由切换时回到顶部
  routerConfig.afterEach((to, from, next) => {
    window.scrollTo(0, 0)
  })
  // 路由进入前
  routerConfig.beforeEach((to, from, next) => {
    if (to.matched.length === 0) { // 匹配前往的路由不存在
      from.name ? next({
        name: from.name
      }) : next('/error') // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
    } else {
      next()
    }
    // 登录拦截白名单
    whiteList.forEach(white => {
      if (location.hash.indexOf(white) !== -1) {
        isWhiteList = true;
      }
    })
    // 未登录拦截
    if (!(localStorage.token || Cookies.get('token')) && !isWhiteList) {
      if (routerOption.browserName == "WebKit" || routerOption.browserName == "otherAPPIos") {
        window.webkit.messageHandlers.forceLoginOut.postMessage("1");
      } else if (routerOption.browserName == "Chrome WebView" || routerOption.browserName == "otherAPPAndroid") {
        RHNativeJS.forceLoginOut("")
      } else {
        loginjump()
        next()
      }
    }
    next()
  })

  return routerConfig
}

export default Router
