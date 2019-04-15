import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Cookies from 'js-cookie'
import '@/common/deviceInit' // 移动适配
import 'mint-ui/lib/style.css' // mint 样式


Vue.config.productionTip = false;
Vue.prototype.$Cookies = Cookies;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')