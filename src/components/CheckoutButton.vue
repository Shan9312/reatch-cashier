<template>
  <div class="checkout-warrper">
    <!-- 若支付方式使用：则看是否是选择状态  -->
    <span class="circle" v-if="payItem.usable" :class="{'no-border': payItem.selected}" @click="handlerChoose(payItem)">
      <img class="picture fr" v-if="payItem.selected" src="@/assets/images/checkout-counter/pay_check.png" alt="定向积分选中">
    </span>
    <!-- 若支付方式不能使用 则是为 禁止状态 -->
    <span class="circle no-border" v-if="!payItem.usable">
      <img class="picture fr" src="@/assets/images/checkout-counter/pay_check_gray.png" alt="定向积分不可点击">
    </span>
  </div>
</template>

<script>
  export default {
    name: 'checkout-button',
    props: {
      payItem: {
        type: Object,
      }
    },
    data() {
      return {};
    },
    created() {},
    mounted() {},
    methods: {
      handlerChoose(v) {
        this.$emit("handlerChoosePay", v);
      }
    },
    computed: {},
    watch: {},
  }
</script>

<style lang="less" scoped>
  .checkout-warrper {

    .picture {
      width: 0.23rem;
      height: 0.23rem;
    }

    .circle {
      display: inline-block;
      width: 0.23rem;
      height: 0.23rem;
      border-radius: 50%;
      border: 1px solid #ddd;

      &.no-border {
        border-color: transparent;
      }
    }
  }
</style>