<template>
  <div>
    <div class="confirm-order">
      <div class="titele-view">
        <img class="titele-icon" src="@/assets/images/checkout-counter/pay_succeed.png">
        <div class="titele-text">领取成功</div>
        <div class="title-toast"><img class="titele-icon"
            src="@/assets/images/checkout-counter/icon_gift.png">您的礼物正在火速打包中…
        </div>
        <ul class="label">
          <li @click="handleGoHomePage">继续逛逛</li>
          <li @click="handleCheckList">查看详情</li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="order-list">
        <div class="order">
          <div>订单编号</div>
          <div>{{ orderInformObj && orderInformObj.orderResp.orderNumber}}</div>
        </div>
        <div class="order">
          <div>兑换时间</div>
          <div>{{orderInformObj.orderResp && orderInformObj.orderResp.orderDate}}</div>
        </div>
        <div class="order">
          <div>收货人</div>
          <div>{{orderInformObj.orderResp && orderInformObj.orderResp.consigneeName}}</div>
        </div>
        <div class="order">
          <div>联系方式</div>
          <div>{{orderInformObj.orderResp && orderInformObj.orderResp.consigneeMobile}}</div>
        </div>
        <div class="order">
          <div>收货地址</div>
          <div>{{orderInformObj.orderResp && orderInformObj.orderResp.consigneeAddr}}</div>
        </div>
      </div>
      <img class="banner" src="@/assets/images/checkout-counter/banner.png" v-show="orderInformObj.hasGift == 1"
        @click="handleGiftList">
      <div class="toast">
        <b>重要提示：</b>您的礼品将在<span>10个工作日发货</span>，您可至大华福利平台—“我的”—“我的订单”查看物流单号<br>
        有任何疑问请咨询客服电话：<span>400-158-2212</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    GlobalProperty
  } from '@/common/global'
  export default {
    name: 'DahuaPage',
    data() {
      return {};
    },
    created() {},
    props: {
      orderInformObj: {
        type: Object,
        required: true,
      }
    },
    methods: {
      /**
       *大华点击: 继续逛逛 跳转
       * 
       * */
      handleGoHomePage() {
        localStorage.removeItem('isWeChatH5');
        baiduStats("大华活动-支付成功-继续逛逛", this.$route);
        dooolyAPP.gotoJumpJq(this.$router, `${GlobalProperty.frontendDomain.m}v3/home`);
      },
      /**
       * 查看列表
       * 
       * */
      handleCheckList() {
        baiduStats("支付成功-查看详情", this.$route);
        dooolyAPP.gotoJumpJq(this.$router,
          `${GlobalProperty.frontendDomain.m}myOrderList/1/all`);
      },
      /**
       *大华广告页点击跳转
       * 
       * */
      handleGiftList() {
        baiduStats("大华活动-支付成功-查看更多礼包", this.$route);
        dooolyAPP.redirectActivity('giftList');
      },
    },
  }
</script>

<style lang="less" scoped>
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
</style>