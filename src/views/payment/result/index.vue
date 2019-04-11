<template>
  <div class="pay-result-warpper">
    <!-- 大华0元礼包 -->
    <div>
      <div class="pay-success">
        <div class="title">
          <img class="pay-success-icon" src="@/assets/images/checkout-counter/pay_succeed.png" alt=""><span>支付成功</span>
        </div>
        <div class="price">
          <span class="mark">￥</span>{{0.03}}
        </div>
        <ul class="label">
          <li>查看列表</li>
          <li>返回首页</li>
        </ul>
      </div>
    </div>
    <!-- 大华0元礼包 end-->
  </div>
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

    .pay-success-icon {
      width: 0.23rem;
      vertical-align: middle;
      margin-right: 0.05rem;
    }

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