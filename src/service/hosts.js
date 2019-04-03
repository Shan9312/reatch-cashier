// https正在用
const thirdParty = 'thirdParty'

var httpsbase = {
  dev: {
    webSite: 'http://' + window.location.hostname + ':8080/#/',
    reach: '/reachtest/',
    doooly: '/Doooly/',
    newDoooly: '/activity/',
    activity: 'http://' + window.location.hostname + ':8001/#/'
  },
  reachtest: { // 测试分支
    webSite: 'https://admin.doooly.com/reachtest/dist/#/',
    appSite: 'https://admin.doooly.com/reachtest/{appDist}/#/',
    otherSite: 'https://admin.doooly.com/reachtest/' + thirdParty + '/#/',
    reach: 'https://admin.doooly.com/reachtest/',
    doooly: 'https://admin.doooly.com/Doooly/',
    newDoooly: 'https://admin.doooly.com/activity/',
    activity: 'https://admin.doooly.com/reachtest/activity/#/'
  },
  reach_dist: { // 测试主干
    webSite: 'https://admin.doooly.com/reach_dist/dist/#/',
    appSite: 'https://admin.doooly.com/reach_dist/{appDist}/#/',
    otherSite: 'https://admin.doooly.com/reach_dist/' + thirdParty + '/#/',
    reach: 'https://admin.doooly.com/reach_api/',
    doooly: 'https://admin.doooly.com/doooly_api/',
    newDoooly: 'https://admin.doooly.com/activity/',
    activity: 'https://admin.doooly.com/reach_dist/activity/#/'
  },
  pre_cashier: { // pre
    webSite: 'https://reach-life.com/pre_dist/dist/#/',
    appSite: 'https://reach-life.com/pre_dist/{appDist}/#/',
    otherSite: 'https://reach-life.com/pre_dist/' + thirdParty + '/#/',
    reach: 'https://reach-life.com/pre_api/',
    doooly: 'https://api.doooly.com/pre_doooly/',
    newDoooly: 'https://reach-life.com/pre_activity_api/',
    activity: 'https://reach-life.com/pre_activity/activity/#/'
  },
  pro_cashier: { // production
    webSite: 'https://reach-life.com/pro_dist/dist/#/',
    appSite: 'https://reach-life.com/pro_dist/{appDist}/#/',
    otherSite: 'https://reach-life.com/pro_dist/' + thirdParty + '/#/',
    reach: 'https://reach-life.com/pro_api/',
    doooly: 'https://api.doooly.com/pro_doooly/',
    newDoooly: 'https://reach-life.com/pro_activity_api/',
    activity: 'https://reach-life.com/pro_activity/activity/#/'
  }

}

// let Host = httpsbase[process.env.NODE_ENV]
// console.log('host:' + process.env.NODE_ENV)
// if (!Host) {
//   Host = httpsbase['dev']
// }
// 根据url路径判断接口地址
const envUrl = ['reachtest', 'reach_dist', 'pre_cashier', 'pro_cashier']
let Host = httpsbase['dev']
if (document.location.protocol === 'https:') {
  envUrl.map((item, index) => {
    if (window.location.href.indexOf(item) > -1) {
      Host = httpsbase[item]
    }
  })
}
// 测试
// Host = httpsbase['reach_dist']
export default Host
