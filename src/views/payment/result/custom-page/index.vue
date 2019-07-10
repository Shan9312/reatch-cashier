<template>
  <div class="pay-result-warpper" :class="{'backgroundColor': isShowPayPage === 1}">
    <div>
      <PickUpGoods :orderInformObj="orderInformObj"></PickUpGoods>
    </div>
  </div>
</template>

<script>
import { getPayResult } from "@/service";
import { MintUI, GlobalProperty } from "@/common/global"; // 引用的封装的组件
import PickUpGoods from "@/components/PickUpGoods.vue"; // 大华页面

export default {
  name: "PaymentResult",
  components: {
    PickUpGoods
  },
  data() {
    return {
      orderNum: this.$route.params.orderNum,
      orderInformObj: {}, // 订单信息
      isShowPayPage: 0, // 大华:1, 支付成功:2, 支付失败:3,
      umengNameObj: {
        AirportActivity: "机场活动",
        ChristmasActivity: "圣诞平安夜"
      }, // 活动名称对象
      activityName: "", // 活动名称
      isWeChatH5: false, // 判断是否是微信h5
      browserName: GlobalProperty.browserName, // 浏览器名称
      backLock: false,
      isShowHomeBtn: true
    };
  },
  created() {
    // 订单详情 判断显示页面
    // this.getPayOrder();
    // dooolyAPP.initTitle("支付结果", "2", "isConfirmShow()");
  },
  mounted() {
  },
  methods: {
    /**
     * 获取订单金额 信息
     *
     * */
    async getPayOrder() {
      const res = await getPayResult(this.orderNum);
      if (res.code === 1000 || res.code === 1001) {
        // 工商的不显示 返回首页按钮
        if (res.data.orderType == "2") this.isShowHomeBtn = false;
        // 表示成功code
        this.orderInformObj = JSON.parse(JSON.stringify(res.data));
        // 判断isShowPayPage  显示哪个页面
        this.isShowPayResultPage(res.code, this.orderInformObj);
      } else {
        MintUI.Toast.open({
          message: res.msg
        });
      }
    },
    /**
     * 返回首页
     *
     * */
    handleReturnHomePage() {
      // localStorage.removeItem("isWeChatH5");
      dooolyAPP.jumpIndexPage(`${GlobalProperty.frontendDomain.m}v3/home`);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.browserName != "Chrome WebView" && this.browserName != "WebKit") {
      if (to.name == "Payment" && !this.backLock) {
        this.backLock = true;
        window.history.go(-1);
        return;
      }
    }
    next();
  }
};
</script>

<style lang="less" scoped>
.backgroundColor {
  background-color: #f5f5f5 !important;
}

.pay-result-warpper {
  overflow: hidden;
  min-height: 100%;
  background: #fff;
}
</style>