import Brower from '@/common/global'

/** 百度统计
 * _hmt.push(['_trackEvent', category, action, opt_, opt_value]);
 *'_trackEvent': 固定参数，表明统计类型是时间跟踪。
 * category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
 * action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
 * opt_：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
 * opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
 * @param {*} action 
 * @param {*} opt_label 
 */
const BaiduStats = (action, opt_label) => {
  let group, category, browserName

  browserName = Brower.getName()
  group = localStorage.getItem('groupShortName') || localStorage.getItem('groupId')
  opt_label = opt_label ? `${this.$route.name}-${opt_label}` : this.$route.name
  category = browserName == 'thirdApp' ? '第三方收银台' : 'H5收银台'
  category = group ? `${sort}-${group}` : `${category}-未登录`
  action = `点击-${action}`
  if (typeof (_hmt) != 'undefined') {
    _hmt.push(['_trackEvent', category, action, opt_]);
  }
}

export default BaiduStats