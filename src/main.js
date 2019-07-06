import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Cookies from 'js-cookie'
import '@/common/mobileAdapt' // 移动适配
import 'mint-ui/lib/style.css' // mint 样式
import '@babel/polyfill' // es6 语法编译
// import './error-log'

Vue.config.productionTip = false;
Vue.prototype.$Cookies = Cookies;

let vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 百度统计事件点击统一处理
window.addEventListener('click', (event) => {
  let target = event.target || event.srcElement
  while (target && target.dataset && !target.dataset.baiduStats) {
    target = target.parentNode ? target.parentNode : ''
  }
  if (target && target.dataset && target.dataset.baiduStats) {
    let name = target.dataset.routeName || '';
    baiduStats(target.dataset.baiduStats, name, vm);
  }
})