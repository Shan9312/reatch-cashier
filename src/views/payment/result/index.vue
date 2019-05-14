<template>
  <div class="pay-result-warpper" :class="{'backgroundColor': isShowPayPage === 1}">
    <div>
      <!-- 大华3.8节日-->
      <DahuaPage v-if="isShowPayPage === 1" :orderInformObj="orderInformObj"></DahuaPage>
      <!-- 支付成功 -->
      <div v-else-if="isShowPayPage === 2">
        <div class="title">
          <span>支付成功</span>
        </div>
        <div class="price">
          <span class="mark">￥</span>{{orderInformObj.totalAmount}}
        </div>
        <ul class="label">
          <li @click="handleCheckList">查看列表</li>
          <li @click="handleReturnHomePage">返回首页</li>
        </ul>
      </div>
      <!-- 支付失败  -->
      <div v-else-if="isShowPayPage === 3">
        <div class="title error">
          <span>支付失败</span>
        </div>
        <div class="price">
          <span class="mark">￥</span>{{orderInformObj.totalAmount}}
        </div>
        <ul class="label">
          <li class="error" @click="handleCheckList">重新支付</li>
        </ul>
      </div>
    </div>
    <!-- 活动类型-->
    <ActivePage v-if="activityName && (isShowPayPage === 2 || isShowPayPage === 3)"></ActivePage>
  </div>
</template>

<script>
  import {
    getPayResult
  } from '@/service'
  import {
    MintUI,
    GlobalProperty,
  } from '@/common/global' // 引用的封装的组件
  import DahuaPage from '@/components/DahuaPage.vue' // 大华页面
  import ActivePage from '@/components/ActivePage.vue' // 活动页面

  export default {
    name: 'PaymentResult',
    components: {
      DahuaPage,
      ActivePage
    },
    data() {
      return {
        orderNum: this.$route.params.orderNum,
        orderInformObj: {}, // 订单信息
        isShowPayPage: 0, // 大华:1, 支付成功:2, 支付失败:3,
        umengNameObj: {
          'AirportActivity': '机场活动',
          'ChristmasActivity': '圣诞平安夜'
        }, // 活动名称对象
        activityName: '', // 活动名称
        isWeChatH5: false, // 判断是否是微信h5
        browserName: GlobalProperty.browserName, // 浏览器名称
        backLock: false,
      };
    },
    created() {
      // 订单详情 判断显示页面
      this.getPayOrder();
      // 判断活动二维码是否显示
      this.isShowActivityPage();
      window.golastPage = function () {
        dooolyAPP.goBackPageIndex('2');
      };
      dooolyAPP.initTitle('支付结果', '2', 'golastPage()');
    },
    mounted() {
      // 支付完成后点击返回
      this.watchHistoryStatus();
    },
    methods: {
      /**
       * 支付宝h5、微信h5支付完成后点击返回，去首页
       * 
       * */
      watchHistoryStatus() {
        if (localStorage.isWeChatH5) this.isWeChatH5 = true;
        if (/method=alipay/.test(window.location.href) || this.isWeChatH5) {
          if (this.browserName !== "WeChat" && this.browserName !== "Chrome WebView" && this.browserName !== "WebKit") {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', () => {
              this.handleReturnHomePage();
            }, false);
          }
        }
      },
      /**
       * 获取订单金额 信息
       * 
       * */
      async getPayOrder() {
        const res = await getPayResult(this.orderNum);
        if (res.code === 1000 || res.code === 1001) { // 表示成功code
          this.orderInformObj = JSON.parse(JSON.stringify(res.data));
          // 判断isShowPayPage  显示哪个页面
          this.isShowPayResultPage(res.code, this.orderInformObj);
        } else {
          MintUI.Toast.open({
            message: res.msg
          })
        }
      },
      /**
       * 根据后端返回的code和data ，判断 显示哪个页面: 大华/支付成功/支付失败
       * 
       * */
      isShowPayResultPage(code, obj) {
        // 支付成功
        if (code === 1000) {
          this.isShowPayPage = 2;
        }
        // 支付失败
        else if (code === 1001) {
          this.isShowPayPage = 3;
        }
        // 大华女神节
        else if (obj.orderResp && obj.orderResp.orderId && obj.orderType === '1') {
          this.isShowPayPage = 1;
        }
      },
      /**
       * 判断 是否显示活动页面，根据localStorage是否存在 activeName
       * 
       * */
      isShowActivityPage() {
        let localStorageStr = localStorage.activity || '{}';
        // 已存的活动对象 找到订单号对应的 活动名称
        this.activityName = JSON.parse(localStorageStr)[this.orderNum];
        if (this.activityName) {
          baiduStats(this.umengNameObj[this.activityName] + "支付成功");
        }
      },
      /**
       * 查看列表
       * 
       * */
      handleCheckList() {
        baiduStats("支付成功-查看详情");
        dooolyAPP.gotoJumpJq(this.$router,
          `${GlobalProperty.frontendDomain.m}myOrderList/1/all`);
      },
      /**
       * 返回首页
       * 
       * */
      handleReturnHomePage() {
        localStorage.removeItem('isWeChatH5');
        dooolyAPP.gotoJumpJq(this.$router, `${GlobalProperty.frontendDomain.m}nav/newHome`);
      },

    },
    destroyed() {
      // 页面销毁，移除监听
      window.removeEventListener('popstate', function () {
        this.handleReturnHomePage();
      }, false);
    },
    beforeRouteLeave(to, from, next) {
      if (this.browserName !== "Chrome WebView" && this.browserName !== "WebKit") {
        if (to.name == 'Payment' && !this.backLock) {
          this.backLock = true;
          window.history.go(-1);
          return
        }
      }
      next();
    }
  }
</script>

<style lang="less" scoped>
  .backgroundColor {
    background-color: #f5f5f5 !important;
  }

  .pay-result-warpper {
    overflow: hidden;
    min-height: 100%;
    background: #fff;

    .title {
      margin-top: 0.8rem;
      margin-bottom: 0.3rem;
      height: 0.24rem;
      line-height: 0.24rem;
      background: url('~@/assets/images/checkout-counter/pay_succeed.png') no-repeat 1.34rem;
      background-size: auto 100%;
      color: #333;
      font-size: 0.18rem;
      text-align: center;
      text-indent: 0.34rem;

      &.error {
        background-image: url('~@/assets/images/checkout-counter/pay_error.png');
      }
    }

    .price {
      text-align: center;
      font-size: 0.4rem;
      color: #333;
      line-height: 100%;

      .mark {
        font-size: 0.3rem;
      }
    }

  }
</style>