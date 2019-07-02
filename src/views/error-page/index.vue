<template>
  <div class="error-wrapper">
    <div class="error-img">
      <img src="@/assets/images/checkout-counter/error.png" alt>
    </div>
    <p>小兜兜迷路了</p>
    <button @click="goHomePage">重新加载</button>
  </div>
</template>
<script>
import { GlobalProperty } from "@/common/global";

export default {
  name: "ErrorPage",
  data() {
    return {};
  },
  created() {
    dooolyAPP.initTitle("出错啦");
  },
  methods: {
    // 跳转首页
    goHomePage() {
      dooolyAPP.gotoJumpJq(this.$router, `${GlobalProperty.frontendDomain.m}`);
    }
  }
};
</script>
<style lang="less">
.error-wrapper {
  padding-top: 26%;

  .error-img {
    width: 36%;
    height: auto;
    margin-left: 32%;

    img {
      width: 100%;
    }
  }

  p {
    text-align: center;
    font-size: 0.14rem;
    color: #666;
    margin-top: 21px;
  }

  button {
    border: 0;
    margin-top: 37px;
    width: 32%;
    height: 0.36rem;
    min-height: 35px;
    line-height: 0.36rem;
    border-radius: 30px;
    background-color: #ee3f44;
    color: #fff;
    font-size: 0.14rem;
  }
}
</style>