import Vue from 'vue'
import App from './App.vue'
import router from './router'
import globalConfig from '@/service/global'

// mint-ui 使用
Vue.config.productionTip = false;

new Vue({
  router: globalConfig.router,
  render: h => h(App)
}).$mount('#app')