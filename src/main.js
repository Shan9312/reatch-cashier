// 临时引入static本地文件使用
import globalProperties from "../public/static/js/globalProperties.js";
import dooolyAPP from '../public/static/js/dooolyAPP.js';
import UAParser from '../public/static/js/ua-parser';
import BaiduStats from '../public/static/js/baidu_state'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Cookies from 'js-cookie'
import '@/common/mobileAdapt' // 移动适配
import 'mint-ui/lib/style.css' // mint 样式

// 暂时挂在到 window
window.globalProperties = globalProperties;
window.dooolyAPP = dooolyAPP;
window.BaiduStats = BaiduStats;
window.UAParser = UAParser;


Vue.config.productionTip = false;
Vue.prototype.$Cookies = Cookies;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')