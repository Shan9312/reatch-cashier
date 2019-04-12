<template>
  <div>
    <!-- 微信h5页面跳转 -->
  </div>
</template>

<script>
  import {
    getPayResult
  } from '@/service'
  import {
    MintUI,
  } from '@/common/global' // 引用的封装的组件

  export default {
    name: "PaymentResultH5",
    data() {
      return {
        orderNum: this.$route.params.orderNum,
        productType: this.$route.params.productType,
        count: 1,
      }
    },
    created() {
      dooolyAPP.initTitle('兜礼收银台')
    },
    methods: {
      async handlerGetPayResult() {
        const res = await getPayResult(this.orderNum);
        if (res.code === 1000 || res.code === 1001) {
          //TODO: 微信支付 判断几种时的跳转


        } else if (res.code === 1002) {
          let timeOut = setTimeout(() => {
            this.handlerGetPayResult();
          }, 500)
        } else {
          MintUI.Toast.open({
            message: res.msg
          })
          // 跳转 home
          dooolyAPP.jumpIndexPage(this.$router, '/nav/newHome')
        }
      },
      goback() {
        const parser = new UAParser()
        const result = parser.getResult()
        let browser = result.browser.name
        if (browser == 'Mobile Safari') {
          // 苹果浏览器少返回一级
          window.history.go(-3);
        } else {
          window.history.go(-2);
        }
      },

      paymentRemind() {
        this.$MessageBox.alert('', {
          title: '支付提醒',
          message: '付款后请根据您的情况点击下面按钮',
          confirmButtonText: '我已完成付款',
          cancelButtonText: '重新支付',
          showCancelButton: true
        }).then(action => {
          if (action == 'confirm') {
            localStorage.isWeChatH5 = true
            this.handlerGetPayResult();
          } else {
            this.goback();
          }
        });
      },
      repayment() {
        this.$MessageBox.alert('', {
          title: '支付提醒',
          message: '未查询到您的支付结果',
          confirmButtonText: '重新支付',
        }).then(action => {
          this.goback();
        });
      },
    },
    beforeRouteEnter(to, from, next) {
      if (!from.name) {
        next(vm => {
          vm.paymentRemind();
        });
      } else {
        next(vm => {
          vm.goback();
        });
      }
    },
  }
</script>