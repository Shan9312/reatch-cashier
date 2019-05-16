"use strict";
var _hmt = _hmt || [];
! function () {
  var e = "5ddfc967a5eaf4d32a89559e293bb979",
    t = window.location.href,
    a = 0 < t.indexOf("reach_dist") || 0 < t.indexOf("localhost"),
    c = 0 < t.indexOf("reachtest");
  e = a || c ? a ? "cc6fe667a6867c9cf9d34ce786116ee4" : "d0c3ce75fb2e96dfd25e01947cf960a6" : "4b4ed8d0c62facfd2787cafd8ff71657";
  var r = document.createElement("script");
  r.src = "https://hm.baidu.com/hm.js?" + e;
  var o = document.getElementsByTagName("script")[0];
  o.parentNode.insertBefore(r, o)
}();
var baiduStats = function (e, t, a) {
  a = a ? t.name + "-" + a : t.name;
  var c = "H5活动";
  localStorage.getItem("groupShortName") || localStorage.getItem("groupId") ? c = c + "-" + (localStorage.getItem("groupShortName") || localStorage.getItem("groupId")) : c += "-未登录", e = "点击-" + e, void 0 !== _hmt && _hmt.push(["_trackEvent", c, e, a])
};