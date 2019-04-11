<template>
  <div class="pay-result-warpper" id="paymentResult">
    <!-- 大华0元礼包 -->
    <div>
      <div class="confirm_order" v-if="false">
        <div class="titeleView">
          <img class="titleImg" src="@/assets/images/checkout-counter/pay_succeed.png">
          <div class="titleText">领取成功</div>
          <div class="titleToast"><img class="titleImg"
              src="@/assets/images/checkout-counter/icon_gift.png">您的礼物正在火速打包中…
          </div>
          <ul class="label">
            <li>继续逛逛</li>
            <li>查看详情</li>
          </ul>
        </div>
        <div class="line"></div>
        <div class="myorder">
          <div class="order">
            <div>订单编号</div>
            <div>{{'1223'}}</div>
          </div>
          <div class="order">
            <div>兑换时间</div>
            <div>{{'myorderDetail.orderDate'}}</div>
          </div>
          <div class="order">
            <div>收货人</div>
            <div>{{'myorderDetail.consigneeName'}}</div>
          </div>
          <div class="order">
            <div>联系方式</div>
            <div>{{'myorderDetail.consigneeMobile'}}</div>
          </div>
          <div class="order">
            <div>收货地址</div>
            <div>{{'myorderDetail.consigneeAddr'}}</div>
          </div>
        </div>
        <img class="banner" v-show="true" src="@/assets/images/checkout-counter/banner.png">
        <div class="toast">
          <b>重要提示：</b>您的礼品将在<span>10个工作日发货</span>，您可至大华福利平台—“我的”—“我的订单”查看物流单号<br>
          有任何疑问请咨询客服电话：<span>400-158-2212</span>
        </div>
      </div>
      <!--  -->
      <div v-else-if="true">
        <div class="title">
          <span>支付成功</span>
        </div>
        <div class="price">
          <span class="mark">￥</span>{{totalAmount}}
        </div>
        <ul class="label">
          <li @click="link">查看列表</li>
          <li @click="goIndex">返回首页</li>
        </ul>
      </div>
      <div v-else>
        <div class="title error">
          <span>支付失败</span>
        </div>
        <div class="price">
          <span class="mark">￥</span>{{totalAmount}}
        </div>
        <ul class="label">
          <li class="error" @click="link">重新支付</li>
        </ul>
      </div>
    </div>
    <!-- 活动pop -->
    <div class="pop-wrap" :class="{'fix-iphonex-bottom': false}" v-if="false">
      <div class="pop-content">
        <h2 class="title-bold">关注兜礼公众号</h2>
        <h2 class="title-bold-red">代金券、全年员工折扣价马上拥有</h2>
        <p class="img-wrap">
          <img v-if="false" class="qrcode" src="@/assets/images/checkout-counter/qrcode.png" alt="">
          <img v-else class="qrcode" src="@/assets/images/checkout-counter/qrcode_christmas.png" alt="">
        </p>
        <p class="qrcode-word">长按保存图片，在微信识别</p>
        <p class="qrcode-word">或微信搜索关注公众号“兜礼”</p>
        <!-- <p>关注兜礼公众号</p> -->
        <p class="tip-grey">注：已关注兜礼的用户，请扫描二维码获得礼品</p>
      </div>
    </div>
  </div>
  <!-- 大华0元礼包 end-->
</template>

<script>
  export default {
    name: 'PaymentResult',
    data() {
      return {};
    },
  }
</script>

<style lang="less" scoped>
  .pay-result-warpper {
    overflow: hidden;
    min-height: 100%;

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

    .confirm_order {
      text-align: center;

      .titeleView {
        background: #fff;
      }

      .titleImg {
        width: 0.6rem;
        margin: 0.25rem auto 0.16rem auto;
      }

      .titleText {
        font-size: 0.18rem;
        color: #333;
        margin-bottom: 0.12rem;
      }

      .titleToast {
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

      .myorder {
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