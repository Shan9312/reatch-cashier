import globalProperties from './globalProperties'

//兜礼app 安卓与ios方法封装
var dooolyAPP = function () {
  this.allConfig = {
    jumpDomain: globalProperties.getFrontendDomain(),
    logObj: globalProperties.getLocalStorage(),
    apiDomain: globalProperties.getAPIDomain(),
    headers: globalProperties.getHeaders()
  }
  this.browserName = globalProperties.getBrowserName()
}
dooolyAPP.prototype = {
  //1.获取定位信息
  homeLocationVector: function (channelName, typeName) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getLocationJson.postMessage('1')
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.homeLocationVector(channelName, typeName) //(1) channelName渠道名称(2)  typeName:类型名称OPENPERMMISON弹出权限提示框OTHERVALUE 不弹出权限提示框 必填字段
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //2.检测版本升级(关于兜礼)
  checkAppVersion: function (methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.checkUpdateVersion.postMessage('1')
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.checkAppVersion()
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //3.获取版本号方法1.0(关于兜礼)
  getAppVersionName: function (methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getAppVersionName.postMessage(methods)
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.getAppVersionName(methods)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //4.返回登陆页方法(会员激活)
  forceLoginOut: function (router, methods) {
    try {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.forceLoginOut.postMessage('1')
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        RHNativeJS.forceLoginOut('')
      } else {
        router.push('/')
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //5.获取设备号方法(会员激活)
  getPhoneDeviceId: function (methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getPhoneDeviceId.postMessage(methods)
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.getPhoneDeviceId(methods)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //6.返回首页(支付完成)
  jumpIndexPage: function (router, methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.jumpTabarItemIndex.postMessage('0')
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.jumpIndexPage()
      } else {
        router.push('/nav/newHome')
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //返回个人中心
  jumpPersonPage: function (router, methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.gotoPersonCenter.postMessage('PersonCenter')
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.jumpPersonPage()
      } else {
        router.push({
          path: '/nav/personalCenter'
        })
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //返回个人中心
  jumpAppHome: function (type) { //返回app端tab页面-1代表最后打开的页面0,1,2,3依次对应
    try {
      if (this.browserName == "WebKit") {
        window.webkit.messageHandlers.htmlToNativeTabBarIndex.postMessage(String(type));
      } else if (this.browserName == "Chrome WebView") {
        RHNativeJS.jumpAPPHOME(type);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //7.拨打电话方法(商户详情,常见问题,帮助中心)
  callPhone: function (methods) {
    try {
      if (this.browserName == 'otherAPPAndroid' || this.browserName == 'Chrome WebView') {
        RHNativeJS.callPhone(methods)
      } else if (this.browserName == 'otherAPPIos' || this.browserName == 'WebKit') {
        window.webkit.messageHandlers.callPhone.postMessage(methods)
      } else {
        window.location.href = 'tel:' + methods
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //8.打开京东首页方法(商户详情)
  openJDHome: function (methods) {
    try {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.openJDHome.postMessage('1')
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        RHNativeJS.openJDHome()
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //9.打开APP地图(商户详情,我的福利)
  openMapView: function (router, company, id) {
    var jsonObj = {
      jumpType: 'InsideJump',
      jumpUrl: 'MapView',
      company: company,
      id: id
    }
    try {
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj))
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
      } else {
        localStorage.storeMapCompany = company
        router.push({
          path: '/storeMap/' + id
        })
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //11.隐藏头部导航栏及禁止下拉刷新()
  hideNavgationBar: function () {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.hideNavgationBar.postMessage('true')
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.setTopDialog(true)
        RHNativeJS.visablePtrFrame(false)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //12.显示头部导航栏及恢复下拉刷新()
  showNavgationBar: function () {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.hideNavgationBar.postMessage('false')
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.setTopDialog(false)
        RHNativeJS.visablePtrFrame(true)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //13.返回上级页面(支付完成)
  goBackPageIndex: function (index) {
    try {
      if (this.browserName == 'WebKit') {
        // ios
        window.webkit.messageHandlers.goBackPageIndex.postMessage(index)
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.backWebPage(index)
      } else {
        window.history.go(-index)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //14.跳转联系客服(我的申诉)
  appealAgainst: function (router, jsonObj, type) {
    try {
      if (this.browserName == "WebKit") {
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj));
      } else if (this.browserName == "Chrome WebView") {
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
      } else {
        router.push({
          name: 'appeal',
          params: {
            dataType: type
          }
        });
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //15.打开手机通讯录(家属邀请)
  //返回参数(tel,name)
  openTelePhoneList: function (methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getAddressBook.postMessage(methods)
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.openTelePhoneList(methods)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //16.app选择上传照片(线下订单)
  photographNative: function (methods) {
    try {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.photographNative.postMessage(methods)
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        RHNativeJS.photographNative(methods)
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //17.修改APP本地支付方式
  getPaymentType: function (data) {
    try {
      if (this.browserName == 'WebKit') {
        // ios
        window.webkit.messageHandlers.getPaymentType.postMessage(JSON.stringify(data))
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.successPay(JSON.stringify(data)) //保存修改之后的值告诉android
      } else {
        localStorage.isPayPassword = data
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //18.安卓APP跳转供应商app方法
  androidGoMerchantApp: function (MerchantName, MerchantUrl) {
    var MerchantInfo = [{
        name: '滴滴出行',
        id: 'com.sdu.didi.psnger'
      },
      {
        name: '唯品会',
        id: 'com.achievo.vipshop'
      },
      {
        name: '1药网',
        id: 'com.yiwang'
      },
      {
        name: '票牛',
        id: 'com.ipiaoniu.android'
      },
      {
        name: '西十区',
        id: 'com.aiyou.androidxsq001'
      },
      {
        name: '典典养车',
        id: 'com.chediandian.customer'
      },
      {
        name: '易果生鲜',
        id: 'com.yiguo.app'
      },
      {
        name: '网易严选',
        id: 'com.netease.yanxuan'
      }
    ]
    var merchant = {
      id: '',
      url: MerchantUrl
    }
    for (var i = 0; i < MerchantInfo.length; i++) {
      if (MerchantInfo[i].name === MerchantName) {
        merchant.id = MerchantInfo[i].id
      }
    }
    try {
      if (this.browserName == 'Chrome WebView') {
        // 安卓中跳第三方app,特殊跳转方式
        RHNativeJS.goCooperationApp(merchant.id, merchant.url)
      } else {
        window.location.href = MerchantUrl
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  //19.app支付
  appPay: function (data, funcName, type) { //支付参数,回调函数名,支付方式 ('wx'微信支付,'zfb'支付宝支付)
    try {
      if (type == 'wx') {
        if (this.browserName == "WebKit" || this.browserName == "otherAPPIos") { //判断iPhone|iPad|iPod|iOS
          data.func = funcName;
          window.webkit.messageHandlers.wechatPay.postMessage(JSON.stringify(data));
        } else if (this.browserName == "Chrome WebView" || this.browserName == "otherAPPAndroid") { //判断Android
          RHNativeJS.wechatPay(JSON.stringify(data), funcName);
        }
      } else if (type == 'zfb') {
        if (this.browserName == 'WebKit') {
          // 判断iPhone|iPad|iPod|iOS
          data.func = funcName
          window.webkit.messageHandlers.aliPayment.postMessage(JSON.stringify(data))
        } else if (this.browserName == 'Chrome WebView') {
          RHNativeJS.aliPay(data.aLiPayUrl, funcName)
        } else {
          let form = data.aLiPayUrl
          let div = document.createElement('div')
          div.innerHTML = form // 此处form就是后台返回接收到的数据
          document.body.appendChild(div)
          document.forms[0].submit()
        }
      }
    } catch (e) {
      errorLog(e)
    }
  },
  //跳转新的收银地址页面
  redirectPay: function (orderNum, payVersion) {
    window.location.href = this.allConfig.jumpDomain.cashier + 'cardBuyPay/' + orderNum + '?payVersion=' + payVersion
  },
  //跳转活动项目
  redirectActivity: function (url) {
    window.location.href = this.allConfig.jumpDomain.activity + url
  },
  //跳转第三方
  gotoJumpJq: function (router, url) {
    if (this.browserName == 'WeChat') {
      window.location.href = url
    } else {
      let jsonObj = {
        jumpType: 'InsideJump',
        jumpUrl: url
      }
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj))
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
      } else {
        let currentBaseUrl = window.location.href.substring(
          0,
          window.location.href.indexOf('#') + 1
        )
        if (url.indexOf(currentBaseUrl) > -1) {
          const subUrl = url.substring(url.indexOf('#') + 1)
          router.push({
            path: subUrl
          })
        } else {
          window.location.href = url
        }
      }
    }
  },
  //项目内部跳转
  gotoJumpVue: function (router, url, dataType) {
    let _jsonObj
    if (this.browserName == 'WeChat') {
      router.push({
        path: url
      })
    } else {
      let jsonObj = {
        jumpType: 'InsideJump',
        jumpUrl: window.location.href.substring(0, window.location.href.indexOf('#') + 1) + url
      }
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        if (dataType && dataType[this.browserName]) {
          _jsonObj = _.extend(jsonObj, dataType[this.browserName])
        } else {
          _jsonObj = jsonObj
        }
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(_jsonObj))
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
      } else {
        router.push({
          path: url
        })
      }
    }
  },
  // cookie方法
  setCookie: function (name, value) {
    let Days = 30
    let exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  },
  getCookie: function (name) {
    let arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) return unescape(arr[2])
    else return null
  },
  removeCookie: function (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = this.getCookie(name)
    if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  },
  //退出登录方法
  logOut: function (router) {
    //修改
    this.removeCookie('token')
    this.removeCookie('userId')
    this.removeCookie('loginUrl')
    if (window.location.href.indexOf('wiscowechat') > 0) {
      localStorage.removeItem('wiscoToken')
      localStorage.removeItem('token')
    } else {
      localStorage.removeItem('dooolyToken')
      localStorage.removeItem('token')
    }
    if (!localStorage.removeItem('wiscoToken') && !localStorage.removeItem('token')) {
      localStorage.removeItem('userId')
      localStorage.removeItem('mobile')
      localStorage.removeItem('activateMobile')
      localStorage.removeItem('groupShortName')
      localStorage.removeItem('address')
      localStorage.removeItem('userName')
      localStorage.removeItem('redirectUrl')
      localStorage.removeItem('code')
      localStorage.removeItem('storeMapUrl')
      localStorage.removeItem('latitude')
      localStorage.removeItem('longitude')
      localStorage.removeItem('loginUrl')
      localStorage.removeItem('getAppVersionName')
      localStorage.removeItem('isPayPassword')
      localStorage.removeItem('isSetPayPassword')
    }
    if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
      window.webkit.messageHandlers.forceLoginOut.postMessage('1')
    } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
      RHNativeJS.forceLoginOut('')
    } else if (/wiscowechat/.test(window.location.href)) {
      router.replace('/companyLogin/wugang')
    } else if (/zfhwechat/.test(window.location.href)) {
      router.replace('/companyLogin/zfh')
    } else {
      router.replace('/')
    }
  },
  //登录/记录用户信息方法
  logIn: function (router, data, url) {
    //修改
    let str1 = JSON.parse(data)
    let token = ''
    if (str1.token) {
      token = str1.token
      this.setCookie('token', token)
      if (window.location.href.indexOf('wiscowechat') > 0) {
        localStorage.wiscoToken = token
        localStorage.token = token
      } else {
        localStorage.dooolyToken = token
        localStorage.token = token
      }
    }
    this.setCookie('userId', str1.adUserConn.userId)
    localStorage.userId = str1.adUserConn.userId
    localStorage.mobile = str1.adUserConn.telephone
    localStorage.groupShortName = str1.adUserConn.groupShortName
    localStorage.userName = str1.adUserConn.name
    this.removeCookie('first_conponShow')
    if (str1.adUserConn.isPayPassword) {
      localStorage.isPayPassword = str1.adUserConn.isPayPassword
      localStorage.isSetPayPassword = str1.adUserConn.isSetPayPassword
    }
    localStorage.groupId = str1.adUserConn.groupId
    localStorage.blocId = str1.adUserConn.blocId
    if (this.browserName == 'WeChat') {
      // 微信
      if (url) {
        localStorage.loginUrl = url
      }
      window.location.replace(this.allConfig.jumpDomain.wx)
    } else if (this.browserName == 'WebKit') {
      // ios
      var params = {
        userInfo: str1.adUserConn,
        type: '0',
        token: str1.token,
        url: url
      }
      window.webkit.messageHandlers.nativeUserInfomation.postMessage(params)
    } else if (this.browserName == 'Chrome WebView') {
      // 安卓
      if (url) {
        var href = window.location.href
        var index = href.indexOf('#')
        var base = href.substring(0, index + 1)
        RHNativeJS.setUserInfo(JSON.stringify(str1.adUserConn), str1.token, base + url)
      } else {
        RHNativeJS.nativeUserInfomation(JSON.stringify(str1.adUserConn), '0', str1.token)
      }
    } else {
      let strReg = '^http(s)?://'
      let reg = new RegExp(strReg)
      if (localStorage.loginUrl != 'nav/newHome') {
        var loginUrl_storage = localStorage.loginUrl
      }
      var loginUrl_cookie = this.getCookie('loginUrl')
      localStorage.removeItem('loginUrl') // 跳转前保存loginUrl，并清掉storage和cookies的loginUrl
      this.removeCookie('loginUrl')
      if (url) {
        router.replace(url)
      } else if (loginUrl_storage || loginUrl_cookie) {
        // 先判断loginUrl_storage
        if (reg.test(loginUrl_storage)) {
          window.location.replace(loginUrl_storage)
          return false
        } else if (reg.test(loginUrl_cookie)) {
          // 再判断loginUrl_cookie
          window.location.replace(loginUrl_cookie)
          return false
        }
        router.replace(loginUrl_storage)
      } else if (this.browserName == 'otherAPP') {
        if (window.location.href.charAt(window.location.href.length - 1) == '/') {
          router.replace('nav/newHome?first=1')
        } else {
          router.replace('/nav/newHome?first=1')
        }
      } else {
        if (window.location.href.charAt(window.location.href.length - 1) == '/') {
          router.replace('nav/newHome')
        } else {
          router.replace('/nav/newHome')
        }
      }
    }
  },
  //设置头部方法封装(类型待整理)
  initTitle: function (titleText, key, funcName) {
    document.title = titleText
    var jsonObj
    if (key == 1) {
      jsonObj = {
        title: {
          text: titleText
        },
        leftButton: {
          name: 'lbs',
          text: '城市',
          func: 'goLastPage()',
          visable: 'true'
        },
        rightButton: {
          name: 'notice',
          visable: 'true'
        },
        visable: 'true'
      }
    } else if (key == 2) {
      if (window.location.href.indexOf('/dist/') > -1) {
        //app旧版本兼容
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          visable: 'true'
        }
      } else {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: funcName,
            visable: 'true'
          },
          visable: 'true'
        }
      }
    } else if (key == 3) {
      //导购规则的弹窗
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'altNotice()',
            visable: 'true'
          },
          visable: 'true'
        }
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'altNoticeAndriod()',
            visable: 'true'
          },
          visable: 'true'
        }
      }
    } else if (key == 13) {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'false'
          },
          rightButton: {
            name: 'request',
            func: 'altNotice()',
            visable: 'true'
          },
          visable: 'true'
        }
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'false'
          },
          rightButton: {
            name: 'request',
            func: 'altNoticeAndriod()',
            visable: 'true'
          },
          visable: 'true'
        }
      }
    } else if (key == 4) {
      //导购文章分享
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'altNotice()',
            visable: 'true'
          },
          visable: 'true'
        }
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'share',
            func: 'shareShopping()',
            visable: 'true'
          },
          visable: 'true'
        }
      }
    } else if (key == 8) {
      //积分充值
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        //判断iPhone|iPad|iPod|iOS
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: funcName || 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: '疑问提示',
            func: 'APP_card_question()',
            visable: 'true'
          },
          visable: 'true'
        }
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        //判断Android
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: funcName || 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'APP_card_question()',
            visable: 'true'
          },
          visable: 'true'
        }
      }
    } else if (key == 5) {
      //发现
      jsonObj = {
        title: {
          text: titleText
        },
        leftButton: {
          name: 'lbs',
          text: '城市',
          func: 'goLastPage()',
          visable: 'false'
        },
        rightButton: {
          name: 'notice',
          visable: 'false'
        },
        visable: 'true'
      }
    } else if (key == 6) {
      //我的
      jsonObj = {
        title: {
          text: '我的',
          name: 'WhiteTextView'
        },
        leftButton: {
          name: 'whiteSetting',
          func: 'systemSetting()',
          visable: 'true'
        },
        rightButton: {
          name: 'whiteNotice',
          visable: 'true'
        },
        visable: 'true'
      }
    } else {
      jsonObj = {
        title: {
          text: titleText
        },
        leftButton: {
          name: 'return',
          text: '返回',
          func: 'goLastPage()',
          visable: 'true'
        },
        visable: 'true'
      }
    }
    try {
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        // jsonObj.title.text += "ios";//测试
        window.webkit.messageHandlers.initPageTitle.postMessage(JSON.stringify(jsonObj))
        window.webkit.messageHandlers.hiddenBotomTabBar.postMessage('true')
      } else if (this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.initPageTitle.postMessage(JSON.stringify(jsonObj))
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.initPageTitle(JSON.stringify(jsonObj))
        if (key == 6) {
          RHNativeJS.setPersonalCenterHeader(true)
        }
        RHNativeJS.hideWaitPanel()
      } else if (this.browserName == 'otherAPPAndroid') {
        RHNativeJS.initPageTitle(JSON.stringify(jsonObj))
      }
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  }
}
var dooolyAPP = new dooolyAPP()

//设置默认返回方法
function goLastPage() {
  dooolyAPP.goBackPageIndex(1)
}

export default dooolyAPP;