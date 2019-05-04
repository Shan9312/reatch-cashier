<template>
  <div>
    <div class="pop-wrap" :class="{'fix-iphonex-bottom': isIphoneX}">
      <div class="pop-content">
        <h2 class="title-bold">关注兜礼公众号</h2>
        <h2 class="title-bold-red">代金券、全年员工折扣价马上拥有</h2>
        <p class="img-wrap">
          <img v-if="activityName === 'AirportActivity'" class="qrcode"
            src="@/assets/images/checkout-counter/qrcode.png" alt="">
          <img v-else class="qrcode" src="@/assets/images/checkout-counter/qrcode_christmas.png" alt="">
        </p>
        <p class="qrcode-word">长按保存图片，在微信识别</p>
        <p class="qrcode-word">或微信搜索关注公众号“兜礼”</p>
        <p class="tip-grey">注：已关注兜礼的用户，请扫描二维码获得礼品</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'activePage',
    props: {
      activityName: {
        type: String
      },
    },
    data() {
      return {
        isIphoneX: false, // 兼容iphoneX尺寸
      }
    },
    created() {
      // 兼容iphoneX尺寸
      this.judgeIsIphoneX();
    },
    methods: {
      /**
       * 判断若是phonex的尺寸
       * 
       * **/
      judgeIsIphoneX() {
        function testUA(str) {
          return navigator.userAgent.indexOf(str) > -1
        }
        let isIphoneX = window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 &&
          testUA('iPhone');
        this.isIphoneX = isIphoneX;
      },
    },
  }
</script>
<style lang="less" scoped>
  .pop-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    &.fix-iphonex-bottom {
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
</style>