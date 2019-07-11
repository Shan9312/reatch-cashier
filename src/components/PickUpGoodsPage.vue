<template>
  <div>
    <div class="confirm-order">
      <div class="titele-view">
        <img class="titele-icon" src="@/assets/images/checkout-counter/pay_succeed.png">
        <div class="titele-text">领取成功</div>
        <div class="title-toast">
          <img class="titele-icon" src="@/assets/images/checkout-counter/icon_gift.png">您的礼物正在火速打包中…
        </div>
        <ul class="label">
          <li @click="handleGoHomePage" data-baidu-stats="大华活动-支付成功-继续逛逛">继续逛逛</li>
          <li @click="handleCheckList" data-baidu-stats="支付成功-查看详情">查看详情</li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="order-list">
        <div class="order">
          <div>订单编号</div>
          <div>{{ orderInfo && orderInfo.orderNumber}}</div>
        </div>
        <div class="order">
          <div>兑换时间</div>
          <div>{{orderInfo && orderInfo.orderDate}}</div>
        </div>
        <div class="order">
          <div>收货人</div>
          <div>{{orderInfo && orderInfo.consigneeName}}</div>
        </div>
        <div class="order">
          <div>联系方式</div>
          <div>{{orderInfo && orderInfo.consigneeMobile}}</div>
        </div>
        <div class="order">
          <div>收货地址</div>
          <div>{{orderInfo && orderInfo.consigneeAddr}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GlobalProperty } from "@/common/global";
import { getPickUpGoodsPayResult } from "@/service";
export default {
  name: "PickUpGoodsPage",
  data() {
    return {
      orderInfo: {}
    };
  },
  created() {
    this.getPayOrder();
  },
  props: {
    orderNo: {
      type: String,
      required: true
    }
  },
  methods: {
    async getPayOrder() {
      const res = await getPickUpGoodsPayResult(this.orderNo);
      this.orderInfo = res.data && res.data.orderResp;
      // if (res.code === 1000 || res.code === 1001) {
      //   // 工商的不显示 返回首页按钮
      //   if (res.data.orderType == "2") this.isShowHomeBtn = false;
      //   // 表示成功code
      //   this.orderInfo = JSON.parse(JSON.stringify(res.data));
      //   // 判断isShowPayPage  显示哪个页面
      //   this.isShowPayResultPage(res.code, this.orderInfo);
      // } else {
      //   MintUI.Toast.open({
      //     message: res.msg
      //   });
      // }
    },
    /**
     * 继续逛逛 跳转
     *
     * */
    handleGoHomePage() {
      localStorage.removeItem("isWeChatH5");
      dooolyAPP.gotoJumpJq(
        this.$router,
        `${GlobalProperty.frontendDomain.m}v3/home`
      );
    },
    /**
     * 查看列表
     *
     * */
    handleCheckList() {
      dooolyAPP.gotoJumpJq(
        this.$router,
        `${GlobalProperty.frontendDomain.m}myOrderList/1/all`
      );
    }
  }
};
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