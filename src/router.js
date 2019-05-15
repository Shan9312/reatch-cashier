import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  GlobalFunction
} from '@/common/global'


Vue.use(VueRouter)

const router = new VueRouter({
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
      component: () => import( /* webpackChunkName: "main" */ '@/views/middle-page'),
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
    },
    {
      path: '*',
      redirect: {
        path: '/error'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.title)) {
    document.title = to.meta.title
  }

  if (!localStorage.token) {
    GlobalFunction.logout()
  }
  next();
})

export default router