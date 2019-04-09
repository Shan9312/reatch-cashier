import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  MessageBox
} from 'mint-ui' // 按需加载
import '@/common/deviceInit' // 移动适配



// mint-ui 使用
Vue.prototype.$MessageBox = MessageBox;
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')