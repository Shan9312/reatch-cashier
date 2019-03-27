import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/error',
      name: 'ErrorPage',
      component: () => import( /* webpackChunkName: "main" */ '@/views/error-page'),
      meta: {
        title: '页面未找到'
      }
    },
    {
      path: '/middle',
      name: 'MiddlePage',
      component: () => import( /* webpackChunkName: "main" */ '@/views/middle-page.vue'),
      meta: {
        title: '中间页'
      }
    },
    {
      path: '/cardBuyPay/:orderNum',
      name: 'Payment',
      component: () => import( /* webpackChunkName: "main" */ '@/views/payment/pay'),
      meta: {
        title: '收银台'
      }
    },
    {
      path: '/cardBuyPayResult/:orderNum',
      name: 'PaymentResult',
      component: () => import( /* webpackChunkName: "result" */ '@/views/payment/result'),
      meta: {
        title: '支付结果'
      }
    },
    {
      path: '/cardBuyPayResultH5/:orderNum/:productType',
      name: 'PaymentResultH5',
      component: () => import( /* webpackChunkName: "result" */ '@/views/payment/result/h5'),
      meta: {
        title: '微信支付结果'
      }
    }
  ]
})