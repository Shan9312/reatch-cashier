"use strict";
String.prototype.starstWith = function (t) {
  return new RegExp("^" + t).test(this)
};
var globalProperties = {
  getDeviceId: function () {
    if ("iphone os" == navigator.userAgent.match(/iphone\sOS/i)) {
      var t = plus.ios.importClass("ASIdentifierManager").sharedManager();
      if (t.isAdvertisingTrackingEnabled()) {
        var e = t.advertisingIdentifier();
        return plus.ios.invoke(e, "UUIDString")
      }
    } else {
      if (window.plus) return plus.device.uuid.valueOf().substring(0, 15)
    }
  },
  getJsonData: function () {
    if (-1 < !location.hash.indexOf("?")) return null;
    var t = new RegExp("(^|&)JsonData=([^&]*)(&|$)", "i"),
      e = location.hash.split("?")[1].match(t);
    return null != e ? decodeURIComponent(e[2]) : null
  },
  getLocalStorage: function () {
    "undefined" != typeof RHNativeJS && (RHNativeJS.getToken && localStorage.setItem("token", RHNativeJS.getToken()), RHNativeJS.getPhone && localStorage.setItem("mobile", RHNativeJS.getPhone()), RHNativeJS.getUserId && localStorage.setItem("userId", RHNativeJS.getUserId()), RHNativeJS.groupShortName && localStorage.setItem("groupShortName", RHNativeJS.groupShortName()), RHNativeJS.nativeLbsCity && localStorage.setItem("address", RHNativeJS.nativeLbsCity()), RHNativeJS.getLoginUserNumber && localStorage.setItem("activateMobile", RHNativeJS.getLoginUserNumber()), RHNativeJS.isOwnApp && localStorage.setItem("ownApp", RHNativeJS.isOwnApp()), RHNativeJS.getUserName && localStorage.setItem("userName", RHNativeJS.getUserName()), RHNativeJS.getVersionName && localStorage.setItem("versionName", RHNativeJS.getVersionName()), RHNativeJS.getHtmlVersion && localStorage.setItem("htmlVersion", RHNativeJS.getHtmlVersion()), RHNativeJS.getGroupID && localStorage.setItem("groupId", RHNativeJS.getGroupID()), RHNativeJS.getBlocID && localStorage.setItem("blocId", RHNativeJS.getBlocID()), RHNativeJS.getPaymentType && localStorage.setItem("isPayPassword", RHNativeJS.getPaymentType())), localStorage.setItem("isSetPayPassword", 0 == localStorage.getItem("isPayPassword") ? 0 : 1);
    var t = this.getJsonData();
    return this.jsonData && localStorage.setItem("thirdUserToken", t), localStorage
  },
  getBrowserName: function () {
    var t = this.getLocalStorage(),
      e = (new UAParser).getResult().browser.name;
    if ("WeChat" == e && -1 < navigator.userAgent.indexOf("wxwork") ? e = "enterpriseWX" : "Android Browser" == e ? (e = "Chrome WebView", "other" == t.getItem("ownApp") && (e = "wiscoAppAndriod")) : "WebKit" == e && "other" == t.getItem("ownApp") && (e = "wiscoAppIOS"), "WebKit" == e || "Chrome WebView" == e) {
      var o = navigator.userAgent;
      /doooly/i.test(o) || (e = "otherAPP", t.setItem("appUrlChannel", "thirdParty"))
    }
    return e
  },
  getAPIDomain: function () {
    var t = "local";
    return location.host.startsWith("f") || -1 < location.href.indexOf("reachtest") ? t = "dev" : location.host.startsWith("t") || -1 < location.href.indexOf("reach_dist") ? t = "test" : -1 < location.href.indexOf("pre_") ? t = "pre" : -1 < location.href.indexOf("pro_") && (t = "pro"), {
      local: {
        butterfly: "https://admin.doooly.com/reachtest/",
        doooly: "https://admin.doooly.com/Doooly/",
        activity: "https://admin.doooly.com/activity/",
        order: "https://admin.doooly.com/doooly-order/",
        action: "https://test.doooly.cn:8410/doooly-action/"
      },
      dev: {
        butterfly: "https://admin.doooly.com/reachtest/",
        doooly: "https://admin.doooly.com/Doooly/",
        activity: "https://admin.doooly.com/activity/",
        order: "https://admin.doooly.com/doooly-order/",
        action: "https://test.doooly.cn:8410/doooly-action/"
      },
      test: {
        butterfly: "https://admin.doooly.com/reach_api/",
        doooly: "https://admin.doooly.com/doooly_api/",
        activity: "https://admin.doooly.com/activity/",
        order: "https://admin.doooly.com/doooly-order/",
        action: "https://test.doooly.cn:8410/doooly-action/"
      },
      pre: {
        butterfly: "https://reach-life.com/pre_api/",
        doooly: "https://api.doooly.com/pre_doooly/",
        activity: "https://reach-life.com/pre_activity_api/",
        order: "https://api.doooly.com/pre_order/",
        action: "https://api.doooly.com/pre_action/"
      },
      pro: {
        butterfly: "https://reach-life.com/pro_api/",
        doooly: "https://api.doooly.com/pro_doooly/",
        activity: "https://reach-life.com/pro_activity_api/",
        order: "https://api.doooly.com/pro_order/",
        action: "https://api.doooly.com/pro_action/"
      }
    } [t]
  },
  getFrontendDomain: function () {
    var t = {},
      e = ["wx2d328083c1b00c6a", "wx07dc2a87c3d4ec88"],
      o = "/dist/";
    /wiscowechat/.test(location.href) ? (e = ["wx58ada8d1e44c4f7b", "wx93b36cf949d5fb6c"], o = "/wiscowechat/") : /zfhwechat/.test(location.href) && (o = "/zfhwechat/");
    var a = {
        local: {
          m: "http://" + window.location.hostname + ":8080/#/",
          activity: "http://" + window.location.hostname + ":8001/#/",
          cashier: "http://" + window.location.hostname + ":8002/#/",
          thirdWebSite: "http://" + window.location.hostname + ":8080/#/",
          wx: ""
        },
        dev: {
          m: "https://admin.doooly.com/reachtest/dist/#/",
          activity: "https://admin.doooly.com/reachtest/activity/#/",
          cashier: "https://admin.doooly.com/reachtest/cashier/#/",
          thirdWebSite: "https://admin.doooly.com/reachtest/thirdParty/#/",
          wx: ""
        },
        test: {
          m: "https://admin.doooly.com/reach_dist/dist/#/",
          activity: "https://admin.doooly.com/reach_dist/activity/#/",
          cashier: "https://admin.doooly.com/reach_dist/cashier/#/",
          thirdWebSite: "https://admin.doooly.com/reach_dist/thirdParty/#/",
          wx: ""
        },
        pre: {
          m: "https://reach-life.com/pre_dist/dist/#/",
          activity: "https://reach-life.com/pre_activity/activity/#/",
          cashier: "https://reach-life.com/pre_cashier/cashier/#/",
          thirdWebSite: "https://reach-life.com/pre_dist/thirdParty/#/",
          wx: ""
        },
        pro: {
          m: "https://reach-life.com/pro_dist/dist/#/",
          activity: "https://reach-life.com/pro_activity/activity/#/",
          cashier: "https://reach-life.com/pro_cashier/cashier/#/",
          thirdWebSite: "https://reach-life.com/pro_dist/thirdParty/#/",
          wx: ""
        }
      },
      i = "local";
    if (location.host.startsWith("f") || location.host.startsWith("t")) t = {
      m: location.protocol + "//" + location.host + "/m/#/",
      activity: location.protocol + "//" + location.host + "/activity/#/",
      cashier: location.protocol + "//" + location.host + "/cashier/#/",
      wx: ""
    };
    else {
      -1 < location.href.indexOf("reachtest") ? i = "dev" : -1 < location.href.indexOf("reach_dist") ? i = "test" : -1 < location.href.indexOf("pre_") ? i = "pre" : -1 < location.href.indexOf("pro_") && (i = "pro"), t = a[i];
      var r = this.getLocalStorage().getItem("htmlVersion") || "";
      r && (t.m = t.m.replace("/dist/", "/dist_v" + r + "/"), t.activity = t.activity.replace("/activity/", "/activity_v" + r + "/"), t.cashier = t.cashier.replace("/cashier/", "/cashier_v" + r + "/"))
    }
    var c = ["pre", "pro"].includes(i) ? e[1] : e[0];
    return t.wx = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + c + "&redirect_uri=" + t.m.replace("/dist/", o) + "white&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect", t
  },
  getHeaders: function () {
    var t = this.getLocalStorage(),
      e = this.getBrowserName(),
      o = {
        channel: "",
        thirdPartyChannel: "",
        deviceId: this.getDeviceId() || t.getItem("userId"),
        thirdUserToken: ""
      };
    switch (e) {
      case "WeChat":
        -1 < location.href.indexOf("wiscowechat") && t.getItem("wiscowechatCodeType") ? o.channel = "wiscowechat" : o.channel = "wechat";
        var a = t.getItem("wiscoToken"),
          i = t.getItem("dooolyToken"); - 1 < location.href.indexOf("wiscowechat") && a ? o.token = a : i && (o.token = i);
        break;
      case "WebKit":
      case "Chrome WebView":
        o.channel = "app";
        break;
      case "otherAPPAndroid":
      case "otherAPPIos":
        o.channel = "wiscoapp";
        break;
      default:
        o.channel = "h5"
    }
    return t.getItem("thirdUserToken") && "WeChat" != e && (o.thirdPartyChannel = "dahua"), o
  }
};