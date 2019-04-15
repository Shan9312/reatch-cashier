import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/common/deviceInit' // 移动适配
import 'mint-ui/lib/style.css' // mint 样式


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')