import Vue from 'vue'
import VueRouter from 'vue-router'


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
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.title)) {
    document.title = to.meta.title
  }
  if (!to.matched.length) { //匹配前往的路由不存在
    from.name ? next({
      name: from.name
    }) : next('/error'); // 断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  }
  next();
})

export default router