// 百度统计
var _hmt = _hmt || [];
(function () {
  var secretKey = '5ddfc967a5eaf4d32a89559e293bb979'; // 百度统计测试
  var test = window.location.href;
  var isReach_dist =
    test.indexOf('reach_dist') > 0 || test.indexOf('localhost') > 0;
  var isReachtest = test.indexOf('reachtest') > 0;
  if (isReach_dist || isReachtest) {
    // 测试
    secretKey = isReach_dist ?
      'cc6fe667a6867c9cf9d34ce786116ee4' :
      'd0c3ce75fb2e96dfd25e01947cf960a6';
  } else {
    // 生产环境
    secretKey = '4b4ed8d0c62facfd2787cafd8ff71657';
  }
  var hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?' + secretKey;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
})();

var baiduStats = function (name, operation, label) {
  var browserName = globalProperties.getBrowserName();
  if (label) {
    label = name + '-' + label;
  } else {
    label = name;
  }
  // sort
  var sort = '';
  // sort
  if (browserName === 'otherAPP') {
    sort = '第三方活动';
  } else {
    sort = 'H5活动';
  }
  if (localStorage.getItem('groupShortName') || localStorage.getItem('groupId')) {
    sort = sort + '-' + (localStorage.getItem('groupShortName') || localStorage.getItem('groupId'));
  } else {
    sort = sort + '-' + '未登录';
  }
  operation = '点击-' + operation;
  if (typeof _hmt != 'undefined') {
    _hmt.push(['_trackEvent', sort, operation, label]);
  }
};

const BaiduStats = baiduStats;
export default BaiduStats;