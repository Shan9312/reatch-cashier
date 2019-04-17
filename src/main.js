import globalProperties from "../static/js/globalProperties.js";
import dooolyAPP from '../static/js/dooolyAPP.js';
import UAParser from '../static/js/ua-parser';
import BaiduStates from '../static/js/baidu_state'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Cookies from 'js-cookie'
import '@/common/deviceInit' // 移动适配
import 'mint-ui/lib/style.css' // mint 样式

// 暂挂在到 window
window.globalProperties = globalProperties;
window.dooolyAPP = dooolyAPP;
window.BaiduStates = BaiduStates;
window.UAParser = UAParser;


Vue.config.productionTip = false;
Vue.prototype.$Cookies = Cookies;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')