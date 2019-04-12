<template>
  <div class="pay-result-warpper" :class="{'backgroundColor': isShowPayPage === 1}">
    <div>
      <!-- 大华3.8节日-->
      <div class="confirm-order" v-if="isShowPayPage === 1">
        <div class="titele-view">
          <img class="titele-icon" src="@/assets/images/checkout-counter/pay_succeed.png">
          <div class="titele-text">领取成功</div>
          <div class="title-toast"><img class="titele-icon"
              src="@/assets/images/checkout-counter/icon_gift.png">您的礼物正在火速打包中…
          </div>
          <ul class="label">
            <li @click="handleGoHomePage">继续逛逛</li>
            <li @click="handlerCheckList">查看详情</li>
          </ul>
        </div>
        <div class="line"></div>
        <div class="order-list">
          <div class="order">
            <div>订单编号</div>
            <div>{{orderInformObj.orderNum}}</div>
          </div>
          <div class="order">
            <div>兑换时间</div>
            <div>{{orderInformObj.orderResp.orderDate}}</div>
          </div>
          <div class="order">
            <div>收货人</div>
            <div>{{orderInformObj.orderResp.consigneeName}}</div>
          </div>
          <div class="order">
            <div>联系方式</div>
            <div>{{orderInformObj.orderResp.consigneeMobile}}</div>
          </div>
          <div class="order">
            <div>收货地址</div>
            <div>{{orderInformObj.orderResp.consigneeAddr}}</div>
          </div>
        </div>
        <img class="banner" src="@/assets/images/checkout-counter/banner.png" v-show="orderInformOb.hasGift == 1"
          @click="handlerGiftList">
        <div class="toast">
          <b>重要提示：</b>您的礼品将在<span>10个工作日发货</span>，您可至大华福利平台—“我的”—“我的订单”查看物流单号<br>
          有任何疑问请咨询客服电话：<span>400-158-2212</span>
        </div>
      </div>
      <!-- 支付成功 -->
      <div v-else-if="isShowPayPage === 2">
        <div class="title">
          <span>支付成功</span>
        </div>
        <div class="price">
          <span class="mark">￥</span>{{orderInformObj.totalAmount}}
        </div>
        <ul class="label">
          <li @click="handlerCheckList">查看列表</li>
          <li @click="handlerReturnHomePage">返回首页</li>
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
          <li class="error">重新支付</li>
        </ul>
      </div>
    </div>
    <!-- 活动类型-->
    <div class="pop-wrap" :class="{'fix-iphonex-bottom': true}"
      v-if="activityName && (isShowPayPage === 2 || isShowPayPage === 3)">
      <div class="pop-content">
        <h2 class="title-bold">关注兜礼公众号</h2>
        <h2 class="title-bold-red">代金券、全年员工折扣价马上拥有</h2>
        <p class="img-wrap">
          <img v-if="true" class="qrcode" src="@/assets/images/checkout-counter/qrcode.png" alt="">
          <img v-else class="qrcode" src="@/assets/images/checkout-counter/qrcode_christmas.png" alt="">
        </p>
        <p class="qrcode-word">长按保存图片，在微信识别</p>
        <p class="qrcode-word">或微信搜索关注公众号“兜礼”</p>
        <!-- <p>关注兜礼公众号</p> -->
        <p class="tip-grey">注：已关注兜礼的用户，请扫描二维码获得礼品</p>
      </div>
    </div>
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

  export default {
    name: 'PaymentResult',
    data() {
      return {
        webSite: 'http://localhost:8081/#', //window.location.href.substring(0, window.location.href.indexOf('#') + 1),
        orderNum: this.$route.params.orderNum,
        orderInformObj: {}, // 订单信息
        isShowPayPage: 0, // 大华:1, 支付成功:2, 支付失败:3,
        umengNameObj: {
          'AirportActivity': '机场活动',
          'ChristmasActivity': '圣诞平安夜'
        }, // 活动名称对象
        activityName: '', // 活动名称
      };
    },
    created() {
      // 订单详情 判断显示页面
      this.getPayOrder();
      // 判断活动二维码是否显示
      this.isShowActivityPage();
      // 设置头部标题
      dooolyAPP.initTitle('支付结果', '2', 'golastPage()');
    },
    methods: {
      /**
       * 获取订单金额 信息
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
       * 判断 显示哪个页面： 大华/支付成功/支付失败
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
          // this.$BaiduStats(this.umengNameObj[this.activityName] + "支付成功");
        }
      },
      /**
       * 点击返回2级
       * */
      golastPage() {
        dooolyAPP.goBackPageIndex('2');

      },
      /**
       *TODO: 大华点击: 继续逛逛 跳转
       * 
       * */
      handleGoHomePage() {

      },
      /**
       *TODO: 大华广告页点击跳转
       * 
       * */
      handlerGiftList() {

      },
      /**
       * 查看列表
       * */
      handlerCheckList() {
        // this.$BaiduStats("支付成功-查看详情");
        // dooolyAPP.jumpIndexPage(this.$router, '/myOrderList/1/all');
        window.location.href = `${this.webSite}/nav/newHome`;
      },
      /**
       * 返回首页
       * */
      handlerReturnHomePage() {
        localStorage.removeItem('isWeChatH5');
        dooolyAPP.gotoJumpJq(this.$router, `${this.webSite}/nav/newHome`);
      },

    },
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
      background: url('~/assets/images/checkout-counter/pay_succeed.png') no-repeat 1.34rem;
      background-size: auto 100%;
      color: #333;
      font-size: 0.18rem;
      text-align: center;
      text-indent: 0.34rem;

      &.error {
        background-image: url('~/assets/images/checkout-counter/pay_error.png');
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

    .label {
      margin-top: 0.6rem;
      padding-bottom: 0.2rem;
      text-align: center;

      li {
        display: inline-block;
        width: 1.2rem;
        height: 0.36rem;
        line-height: 0.36rem;
        font-size: 0.14rem;
        color: #333;
        border-radius: 0.05rem;
        border: 1px solid #ddd;

        &:nth-child(1) {
          margin-right: 0.2rem;
        }
      }

      .error {
        border-color: #ee3f44;
        color: #ee3f44;
      }
    }

    /* pop */
    .pop-wrap {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      &.fix-iphonex-bottom {
        // padding-bottom: 34px;
        bottom: 34px;
      }

      .pop-content {
        padding: 0.3rem 0.34rem 0.14rem;
        text-align: center;
        font-size: 0.14rem;
        color: #333;

        h2 {
          font-size: 0.14rem;
        }
      }

      .title-bold {
        color: #333;
        font-weight: bold;
      }

      .title-bold-red {
        color: #ee3f44;
        font-weight: bold;
      }

      .img-wrap {
        overflow: hidden;

        // padding-bottom: 0.34rem;
        img {
          width: 1.44rem;
        }

        .qrcode {
          padding-top: 0.06rem;
        }
      }

      .tip-grey {
        font-size: 0.12rem;
        padding-top: 0.08rem;
        color: #999999;
      }
    }

    .confirm-order {
      text-align: center;

      .titele-view {
        background: #fff;
      }

      .titele-icon {
        width: 0.6rem;
        margin: 0.25rem auto 0.16rem auto;
      }

      .titele-text {
        font-size: 0.18rem;
        color: #333;
        margin-bottom: 0.12rem;
      }

      .title-toast {
        font-size: 0.14rem;
        color: #999;
        display: flex;
        justify-content: center;

        img {
          width: 0.18rem;
          height: 0.18rem;
          margin: 0;
          margin-right: 0.06rem;
        }
      }

      .label {
        margin-top: 0.17rem;
      }

      .line {
        width: 100%;
        height: 0.1rem;
        background: #f5f5f5;
      }

      .order-list {
        padding: 0.12rem 0;
        background: #fff;

        .order {
          display: flex;
          justify-content: space-between;
          padding: 0.05rem 0.15rem;
          font-size: 0.12rem;
          color: #333;

          div:first-child {
            color: #999;
          }
        }
      }

      .banner {
        width: 3.45rem;
        margin-top: 0.2rem;
      }

      .toast {
        font-size: 0.12rem;
        color: #999;
        padding: 0 0.15rem;
        text-align: left;
        margin-top: 0.18rem;

        b {
          color: #666;
        }

        span {
          color: #ee3f44;
        }
      }
    }
  }
</style>