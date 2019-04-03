//友盟点击事件监控(事件类别,事件操作,事件标签,事件值,元素id)
// const UmengClick = (browserName) => {
//   return function(sort, operation, label, val, id) {
//     if (browserName == 'Chrome WebView' || browserName == 'otherAPPAndroid') {
//       sort = '安卓-' + sort
//     } else if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
//       sort = 'IOS-' + sort
//     } else {
//       sort = 'H5-' + sort
//     }
//     var url = window.location.href.substring(
//       0,
//       window.location.href.indexOf('#') - 1
//     )
//     url = url.substring(url.lastIndexOf('/') + 1)
//     operation = operation + '-' + label
//     if (localStorage.blocId && localStorage.blocId != 'undefined') {
//       label =
//         localStorage.blocId +
//         '-' +
//         localStorage.groupId +
//         '-' +
//         localStorage.userId +
//         '-' +
//         url
//     } else if (localStorage.groupId && localStorage.groupId != 'undefined') {
//       label = localStorage.groupId + '-' + localStorage.userId + '-' + url
//     } else {
//       label = localStorage.userId + '-' + url
//     }
//     if (typeof _czc != 'undefined') {
//       _czc.push(['_trackEvent', sort, operation, label, val, id])
//     }
//   }
// }

// 百度统计
const BaiduStats = (browserName) => {
  return function(operation, label){
    // var label = '';
    // label = window.location.href;
    if (label) {
      label = this.$route.name + '-' + label;
    } else {
      label = this.$route.name;
    }
    // sort
    var sort = '';
    // sort
    if (browserName === 'thirdApp') {
      sort = '第三方收银台';
    } else {
      sort = 'H5收银台';
    }
    if (localStorage.groupShortName || localStorage.groupId) {
      sort = sort + '-' + (localStorage.groupShortName || localStorage.groupId);
    } else {
      sort = sort + '-' + '未登录';
    }
    // operation
    operation = '点击-' + operation;
    if(typeof(_hmt) != "undefined"){
      _hmt.push(['_trackEvent', sort, operation, label]);
    }
  };
}

export default BaiduStats
