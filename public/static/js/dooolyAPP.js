"use strict";
(dooolyAPP = function () {
  this.allConfig = {
    jumpDomain: globalProperties.getFrontendDomain(),
    logObj: globalProperties.getLocalStorage(),
    apiDomain: globalProperties.getAPIDomain(),
    headers: globalProperties.getHeaders()
  }, this.browserName = globalProperties.getBrowserName()
}).prototype = {
  homeLocationVector: function (e, o) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.getLocationJson.postMessage("1") : "Chrome WebView" == this.browserName && RHNativeJS.homeLocationVector(e, o)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  checkAppVersion: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.checkUpdateVersion.postMessage("1") : "Chrome WebView" == this.browserName && RHNativeJS.checkAppVersion()
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  getAppVersionName: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.getAppVersionName.postMessage(e) : "Chrome WebView" == this.browserName && RHNativeJS.getAppVersionName(e)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  forceLoginOut: function (e, o) {
    try {
      "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? window.webkit.messageHandlers.forceLoginOut.postMessage("1") : "Chrome WebView" == this.browserName || "otherAPPAndroid" == this.browserName ? RHNativeJS.forceLoginOut("") : e.push("/")
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  getPhoneDeviceId: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.getPhoneDeviceId.postMessage(e) : "Chrome WebView" == this.browserName && RHNativeJS.getPhoneDeviceId(e)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  jumpIndexPage: function (e, o) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.jumpTabarItemIndex.postMessage("0") : "Chrome WebView" == this.browserName ? RHNativeJS.jumpIndexPage() : e.push("/nav/newHome")
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  jumpPersonPage: function (e, o) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.gotoPersonCenter.postMessage("PersonCenter") : "Chrome WebView" == this.browserName ? RHNativeJS.jumpPersonPage() : e.push({
        path: "/nav/personalCenter"
      })
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  jumpAppHome: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.htmlToNativeTabBarIndex.postMessage(String(e)) : "Chrome WebView" == this.browserName && RHNativeJS.jumpAPPHOME(e)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  callPhone: function (e) {
    try {
      "otherAPPAndroid" == this.browserName || "Chrome WebView" == this.browserName ? RHNativeJS.callPhone(e) : "otherAPPIos" == this.browserName || "WebKit" == this.browserName ? window.webkit.messageHandlers.callPhone.postMessage(e) : window.location.href = "tel:" + e
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  openJDHome: function (e) {
    try {
      "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? window.webkit.messageHandlers.openJDHome.postMessage("1") : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || RHNativeJS.openJDHome()
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  openMapView: function (e, o, t) {
    var r = {
      jumpType: "InsideJump",
      jumpUrl: "MapView",
      company: o,
      id: t
    };
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(r)) : "Chrome WebView" == this.browserName ? RHNativeJS.gotoNativeJump(JSON.stringify(r)) : (localStorage.storeMapCompany = o, e.push({
        path: "/storeMap/" + t
      }))
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  hideNavgationBar: function () {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.hideNavgationBar.postMessage("true") : "Chrome WebView" == this.browserName && (RHNativeJS.setTopDialog(!0), RHNativeJS.visablePtrFrame(!1))
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  showNavgationBar: function () {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.hideNavgationBar.postMessage("false") : "Chrome WebView" == this.browserName && (RHNativeJS.setTopDialog(!1), RHNativeJS.visablePtrFrame(!0))
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  goBackPageIndex: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.goBackPageIndex.postMessage(e) : "Chrome WebView" == this.browserName ? RHNativeJS.backWebPage(e) : window.history.go(-e)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  appealAgainst: function (e, o, t) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(o)) : "Chrome WebView" == this.browserName ? RHNativeJS.gotoNativeJump(JSON.stringify(o)) : e.push({
        name: "appeal",
        params: {
          dataType: t
        }
      })
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  openTelePhoneList: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.getAddressBook.postMessage(e) : "Chrome WebView" == this.browserName && RHNativeJS.openTelePhoneList(e)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  photographNative: function (e) {
    try {
      "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? window.webkit.messageHandlers.photographNative.postMessage(e) : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || RHNativeJS.photographNative(e)
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  getPaymentType: function (e) {
    try {
      "WebKit" == this.browserName ? window.webkit.messageHandlers.getPaymentType.postMessage(JSON.stringify(e)) : "Chrome WebView" == this.browserName ? RHNativeJS.successPay(JSON.stringify(e)) : localStorage.isPayPassword = e
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  androidGoMerchantApp: function (e, o) {
    for (var t = [{
        name: "滴滴出行",
        id: "com.sdu.didi.psnger"
      }, {
        name: "唯品会",
        id: "com.achievo.vipshop"
      }, {
        name: "1药网",
        id: "com.yiwang"
      }, {
        name: "票牛",
        id: "com.ipiaoniu.android"
      }, {
        name: "西十区",
        id: "com.aiyou.androidxsq001"
      }, {
        name: "典典养车",
        id: "com.chediandian.customer"
      }, {
        name: "易果生鲜",
        id: "com.yiguo.app"
      }, {
        name: "网易严选",
        id: "com.netease.yanxuan"
      }], r = {
        id: "",
        url: o
      }, a = 0; a < t.length; a++) t[a].name === e && (r.id = t[a].id);
    try {
      "Chrome WebView" == this.browserName ? RHNativeJS.goCooperationApp(r.id, r.url) : window.location.href = o
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  },
  appPay: function (e, o, t) {
    try {
      if ("wx" == t) "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? (e.func = o, window.webkit.messageHandlers.wechatPay.postMessage(JSON.stringify(e))) : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || RHNativeJS.wechatPay(JSON.stringify(e), o);
      else if ("zfb" == t)
        if ("WebKit" == this.browserName) e.func = o, window.webkit.messageHandlers.aliPayment.postMessage(JSON.stringify(e));
        else if ("Chrome WebView" == this.browserName) RHNativeJS.aliPay(e.aLiPayUrl, o);
      else {
        var r = e.aLiPayUrl,
          a = document.createElement("div");
        a.innerHTML = r, document.body.appendChild(a), document.forms[0].submit()
      }
    } catch (e) {
      errorLog(e)
    }
  },
  redirectPay: function (e, o) {
    window.location.href = this.allConfig.jumpDomain.cashier + "cardBuyPay/" + e + "?payVersion=" + o
  },
  redirectActivity: function (e) {
    window.location.href = this.allConfig.jumpDomain.activity + e
  },
  gotoJumpJq: function (e, o) {
    if ("WeChat" == this.browserName) window.location.href = o;
    else {
      var t = {
        jumpType: "InsideJump",
        jumpUrl: o
      };
      if ("WebKit" == this.browserName) window.webkit.messageHandlers.jumpTabarItemIndex.postMessage(JSON.stringify(t));
      else if ("Chrome WebView" == this.browserName) RHNativeJS.gotoNativeJump(JSON.stringify(t));
      else {
        var r = window.location.href.substring(0, window.location.href.indexOf("#") + 1);
        if (-1 < o.indexOf(r)) {
          var a = o.substring(o.indexOf("#") + 1);
          e.push({
            path: a
          })
        } else window.location.href = o
      }
    }
  },
  gotoJumpVue: function (e, o, t) {
    var r = void 0;
    if ("WeChat" == this.browserName) e.push({
      path: o
    });
    else {
      var a = {
        jumpType: "InsideJump",
        jumpUrl: window.location.href.substring(0, window.location.href.indexOf("#") + 1) + o
      };
      "WebKit" == this.browserName ? (r = t && t[this.browserName] ? _.extend(a, t[this.browserName]) : a, window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(r))) : "Chrome WebView" == this.browserName ? RHNativeJS.gotoNativeJump(JSON.stringify(a)) : e.push({
        path: o
      })
    }
  },
  setCookie: function (e, o) {
    var t = new Date;
    t.setTime(t.getTime() + 2592e6), document.cookie = e + "=" + escape(o) + ";expires=" + t.toGMTString()
  },
  getCookie: function (e) {
    var o, t = new RegExp("(^| )" + e + "=([^;]*)(;|$)");
    return (o = document.cookie.match(t)) ? unescape(o[2]) : null
  },
  removeCookie: function (e) {
    var o = new Date;
    o.setTime(o.getTime() - 1);
    var t = this.getCookie(e);
    null != t && (document.cookie = e + "=" + t + ";expires=" + o.toGMTString())
  },
  logOut: function (e) {
    this.removeCookie("token"), this.removeCookie("userId"), this.removeCookie("loginUrl"), 0 < window.location.href.indexOf("wiscowechat") ? localStorage.removeItem("wiscoToken") : localStorage.removeItem("dooolyToken"), localStorage.removeItem("token"), localStorage.removeItem("wiscoToken") || localStorage.removeItem("token") || (localStorage.removeItem("userId"), localStorage.removeItem("mobile"), localStorage.removeItem("activateMobile"), localStorage.removeItem("groupShortName"), localStorage.removeItem("address"), localStorage.removeItem("userName"), localStorage.removeItem("redirectUrl"), localStorage.removeItem("code"), localStorage.removeItem("storeMapUrl"), localStorage.removeItem("latitude"), localStorage.removeItem("longitude"), localStorage.removeItem("loginUrl"), localStorage.removeItem("getAppVersionName"), localStorage.removeItem("isPayPassword"), localStorage.removeItem("isSetPayPassword")), "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? window.webkit.messageHandlers.forceLoginOut.postMessage("1") : "Chrome WebView" == this.browserName || "otherAPPAndroid" == this.browserName ? RHNativeJS.forceLoginOut("") : /wiscowechat/.test(window.location.href) ? e.replace("/companyLogin/wugang") : /zfhwechat/.test(window.location.href) ? e.replace("/companyLogin/zfh") : e.replace("/")
  },
  logIn: function (e, o, t) {
    var r = JSON.parse(o),
      a = "";
    if (r.token && (a = r.token, this.setCookie("token", a), 0 < window.location.href.indexOf("wiscowechat") ? localStorage.wiscoToken = a : localStorage.dooolyToken = a, localStorage.token = a), this.setCookie("userId", r.adUserConn.userId), localStorage.userId = r.adUserConn.userId, localStorage.mobile = r.adUserConn.telephone, localStorage.groupShortName = r.adUserConn.groupShortName, localStorage.userName = r.adUserConn.name, this.removeCookie("first_conponShow"), r.adUserConn.isPayPassword && (localStorage.isPayPassword = r.adUserConn.isPayPassword, localStorage.isSetPayPassword = r.adUserConn.isSetPayPassword), localStorage.groupId = r.adUserConn.groupId, localStorage.blocId = r.adUserConn.blocId, "WeChat" == this.browserName) t && (localStorage.loginUrl = t), window.location.replace(this.allConfig.jumpDomain.wx);
    else if ("WebKit" == this.browserName) {
      var i = {
        userInfo: r.adUserConn,
        type: "0",
        token: r.token,
        url: t
      };
      window.webkit.messageHandlers.nativeUserInfomation.postMessage(i)
    } else if ("Chrome WebView" == this.browserName)
      if (t) {
        var s = window.location.href,
          n = s.indexOf("#"),
          l = s.substring(0, n + 1);
        RHNativeJS.setUserInfo(JSON.stringify(r.adUserConn), r.token, l + t)
      } else RHNativeJS.nativeUserInfomation(JSON.stringify(r.adUserConn), "0", r.token);
    else {
      var m = new RegExp("^http(s)?://");
      if ("nav/newHome" != localStorage.loginUrl) var w = localStorage.loginUrl;
      var h = this.getCookie("loginUrl");
      if (localStorage.removeItem("loginUrl"), this.removeCookie("loginUrl"), t) e.replace(t);
      else if (w || h) {
        if (m.test(w)) return window.location.replace(w), !1;
        if (m.test(h)) return window.location.replace(h), !1;
        e.replace(w)
      } else "otherAPP" == this.browserName ? "/" == window.location.href.charAt(window.location.href.length - 1) ? e.replace("nav/newHome?first=1") : e.replace("/nav/newHome?first=1") : "/" == window.location.href.charAt(window.location.href.length - 1) ? e.replace("nav/newHome") : e.replace("/nav/newHome")
    }
  },
  initTitle: function (e, o, t) {
    var r;
    document.title = e, 1 == o ? r = {
      title: {
        text: e
      },
      leftButton: {
        name: "lbs",
        text: "城市",
        func: "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "notice",
        visable: "true"
      },
      visable: "true"
    } : 2 == o ? r = -1 < window.location.href.indexOf("/dist/") ? {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "true"
      },
      visable: "true"
    } : {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: t,
        visable: "true"
      },
      visable: "true"
    } : 3 == o ? "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "request",
        func: "altNotice()",
        visable: "true"
      },
      visable: "true"
    } : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || (r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "request",
        func: "altNoticeAndriod()",
        visable: "true"
      },
      visable: "true"
    }) : 13 == o ? "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "false"
      },
      rightButton: {
        name: "request",
        func: "altNotice()",
        visable: "true"
      },
      visable: "true"
    } : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || (r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "false"
      },
      rightButton: {
        name: "request",
        func: "altNoticeAndriod()",
        visable: "true"
      },
      visable: "true"
    }) : 4 == o ? "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "request",
        func: "altNotice()",
        visable: "true"
      },
      visable: "true"
    } : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || (r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "share",
        func: "shareShopping()",
        visable: "true"
      },
      visable: "true"
    }) : 8 == o ? "WebKit" == this.browserName || "otherAPPIos" == this.browserName ? r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: t || "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "疑问提示",
        func: "APP_card_question()",
        visable: "true"
      },
      visable: "true"
    } : "Chrome WebView" != this.browserName && "otherAPPAndroid" != this.browserName || (r = {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: t || "goLastPage()",
        visable: "true"
      },
      rightButton: {
        name: "request",
        func: "APP_card_question()",
        visable: "true"
      },
      visable: "true"
    }) : r = 5 == o ? {
      title: {
        text: e
      },
      leftButton: {
        name: "lbs",
        text: "城市",
        func: "goLastPage()",
        visable: "false"
      },
      rightButton: {
        name: "notice",
        visable: "false"
      },
      visable: "true"
    } : 6 == o ? {
      title: {
        text: "我的",
        name: "WhiteTextView"
      },
      leftButton: {
        name: "whiteSetting",
        func: "systemSetting()",
        visable: "true"
      },
      rightButton: {
        name: "whiteNotice",
        visable: "true"
      },
      visable: "true"
    } : {
      title: {
        text: e
      },
      leftButton: {
        name: "return",
        text: "返回",
        func: "goLastPage()",
        visable: "true"
      },
      visable: "true"
    };
    try {
      "WebKit" == this.browserName ? (window.webkit.messageHandlers.initPageTitle.postMessage(JSON.stringify(r)), window.webkit.messageHandlers.hiddenBotomTabBar.postMessage("true")) : "otherAPPIos" == this.browserName ? window.webkit.messageHandlers.initPageTitle.postMessage(JSON.stringify(r)) : "Chrome WebView" == this.browserName ? (RHNativeJS.initPageTitle(JSON.stringify(r)), 6 == o && RHNativeJS.setPersonalCenterHeader(!0), RHNativeJS.hideWaitPanel()) : "otherAPPAndroid" == this.browserName && RHNativeJS.initPageTitle(JSON.stringify(r))
    } catch (e) {
      dooolyAPP.errorLog(e)
    }
  }
};
var dooolyAPP = new dooolyAPP;

function goLastPage() {
  dooolyAPP.goBackPageIndex(1)
}