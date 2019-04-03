import Host from '@/service/hosts'
const constant = (browserName) => { // Host.doooly +
  if (browserName == "WebKit" || browserName == "Chrome WebView") {
    let appUrl = Host.appSite
    if (window.location.href.indexOf('cashier_v2.2.1') > -1) {
      appUrl = appUrl.replace('{appDist}', 'dist2.2.1')
    } else if (window.location.href.indexOf('cashier_v2.2.0') > -1) {
      appUrl = appUrl.replace('{appDist}', 'dist2.2.0')
    } else if (localStorage.htmlVersion) {
      let version = localStorage.htmlVersion
      appUrl = appUrl.replace('{appDist}', 'dist' + version)
    } else {
      appUrl = appUrl.replace('{appDist}', 'dist')
    }
    Host.webSite = appUrl
  } else if (browserName == "thirdApp") {
    Host.webSite = Host.otherSite
  }
  return {
    webSite: Host.webSite,
    activity: Host.activity,
    currentBaseUrl: window.location.href.substring(0, window.location.href.indexOf('#') + 1),
    commonShareJSONPConfig: Host.doooly + 'jersey/share/commonShareJSONPConfig',
    getTargetUrl: Host.reach + 'wechat/oneNumber/getTargetUrl.jhtml', // 一号通跳转
    errorLog: Host.doooly + 'jersey/app/error-log/save/v1', // 捕获错误信息接口
    // profile: Host.doooly + 'jersey/dooolyApp/index/user/profile',
    unifiedorder: Host.doooly + 'jersey/doooly/payment/unifiedorder', // 查询订单信息接口
    getPayForm: Host.doooly + 'jersey/doooly/payment/getPayForm', // 检查订单id是否有效
    noteCheck: Host.doooly + 'jersey/doooly/payment/integralPay', // 检查短信是否正确
    getPayResult: Host.doooly + 'jersey/doooly/payment/getPayResult', // 查询支付结果
    getLiftOrder: Host.doooly + 'jersey/myorder/getLiftOrder', // 查询礼包类型支付结果
    unifiedorder_v2: Host.doooly + 'jersey/doooly/payment/unifiedorder/V2',
    getPayForm_v2: Host.doooly + 'jersey/doooly/payment/getPayForm/V2',
    noteCheck_v2: Host.doooly + 'jersey/doooly/payment/integralPay/V2',
    getPayResult_v2: Host.doooly + 'jersey/doooly/payment/getPayResult/V2'
  }
}
export default constant
