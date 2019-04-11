<template>
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
</template>

<script>
  export default {
    name: 'PaymentResultH5',
    data() {
      return {}
    },
  }
</script>

<style lang="less" scoped></style>