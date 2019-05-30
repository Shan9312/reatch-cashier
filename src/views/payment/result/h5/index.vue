<template>
  <div>
    <!-- 微信h5页面跳转 -->
  </div>
</template>

<script>
import { getPayResult } from "@/service";
import { MintUI, GlobalProperty } from "@/common/global"; // 引用的封装的组件
import { UtilsFunction } from "@/common/utils.js"; // 引用的数据格式处理的 函数

export default {
  name: "PaymentResultH5",
  data() {
    return {
      orderNum: this.$route.params.orderNum,
      productType: this.$route.params.productType,
      count: 0,
      browserName: GlobalProperty.browserName // 浏览器名称
    };
  },
  created() {
    dooolyAPP.initTitle("兜礼收银台");
  },
  methods: {
    /**
     * 付款成功后 调转
     * */
    async handleGetPayResult() {
      this.count++;
      if (this.count > 5) {
        this.repayment();
        Mint.Indicator.close();
        return;
      }
      alert(1);
      const res = await getPayResult(this.orderNum);
      if (res.code === 1000 || res.code === 1001) {
        // 根据支付环境 跳转到不同的页面
        if (res.data && res.data.redirectUrl) {
          alert(2);
          // 接口有值，直接跳接口的
          dooolyAPP.gotoJumpJq(this.$router, res.data.redirectUrl);
        } else {
          // 支付结果页面
          dooolyAPP.gotoJumpVue(
            this.$router,
            `/cardBuyPayResult/${this.orderNum}`
          );
        }
      } else if (res.code === 1002) {
        let timeOut = setTimeout(() => {
          this.handleGetPayResult();
        }, 500);
      } else {
        MintUI.Toast.open({
          message: res.msg
        });
        window.location.href = `${GlobalProperty.frontendDomain.m}v3/home`;
      }
    },
    /**
     * 回退的判断
     * */
    handleGoBack() {
      if (this.browserName == "Mobile Safari") {
        // 苹果浏览器少返回一级
        window.history.go(-3);
      } else {
        window.history.go(-2);
      }
    },
    /**
     * 支付成功
     * */
    paymentRemind() {
      MintUI.MessageBox.alert("", {
        title: "支付提醒",
        message: "付款后请根据您的情况点击下面按钮",
        confirmButtonText: "我已完成付款",
        cancelButtonText: "重新支付",
        showCancelButton: true
      }).then(action => {
        if (action == "confirm") {
          alert("确认支付");
          localStorage.isWeChatH5 = true;
          this.handleGetPayResult();
        } else {
          alert("重新支付");
          this.handleGoBack();
        }
      });
    },
    /**
     * 支付未成功
     * */
    repayment() {
      MintUI.MessageBox.alert("", {
        title: "支付提醒",
        message: "未查询到您的支付结果",
        confirmButtonText: "重新支付"
      }).then(action => {
        this.handleGoBack();
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    // 若是第三方app 嵌套我们h5页面 积分支付时 点击回退 2个
    alert(from.name);
    if (!from.name) {
      next(vm => {
        vm.paymentRemind();
      });
    } else {
      next(vm => {
        vm.handleGoBack();
      });
    }
  }
};
</script>