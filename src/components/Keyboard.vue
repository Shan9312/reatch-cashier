<template>
  <div class='keyboard-page'>
    <div class="content">
      <div class="keyboard-title">
        <img src="@/assets/images/checkout-counter/icon_close.png" alt="" @click="handlerClose">
        {{isPayPassword == '1' ? '请输入短信验证码' : '请输入兜礼支付密码'}}
      </div>
      <!-- 密码输入框 -->
      <div class="password-list">
        <span :class="{'password-point': item <= verificationCodeArr.length}" v-for="item in 6" :key="item">
        </span>
      </div>
      <!-- 确认支付 按钮 -->
      <div class="pay-btn" :class="{'text-color-red':verificationCodeArr.length === 6}" @click="handlerPayBtn">
        确认支付
      </div>
      <!-- 短信提示信息 -->
      <div class="message-title">
        <!-- 定向积分支付 手机验证码 -->
        <p v-if="isPayPassword === '1'" class="code">
          <span v-if="countdownNum === 0 || countdownNum === 60">
            未收到验证码，请
            <label class="text-color-red" @click="handlerRepeatVerificat">重新获取</label>
          </span>
          <span v-else>
            验证码已发送至您的手机,
            <label class="text-color-red">{{countdownNum}}s</label>
            后请重新获取
          </span>
        </p>
        <p v-else>
          <label class="text-color-red" @click="handlerForgetPassword">忘记密码？</label>
        </p>
      </div>
      <!-- 数字键盘 -->
      <ul class="keyboard-num">
        <li v-for="(item,index) in keyboardNumArr" :key="index" @click="handlerEntryNum(item)">{{item}}
        </li>
        <li>
          <img class="keyboard-delete" @click="handlerDelNum"
            src="../assets/images/checkout-counter/keyboard_delete_icon.png">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {
    GlobalProperty
  } from '@/common/global'

  export default {
    name: 'keyboard',
    props: {
      isPayPassword: {
        type: String,
      }, // 1: 短信 ,2: 密码支付,默认显示1
      handlerCloseKeyboard: {
        type: Function,
      },
      handlerPayOrderBtn: {
        type: Function,
      },
      confirmOrder: {
        type: Function,
      },
    },
    data() {
      return {
        keyboardNumArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0],
        countdownNum: 60,
        verificationCodeArr: [],
        verificationTimer: null,
      };
    },
    created() {
      console.log(GlobalProperty.apiDomain);
    },
    methods: {
      /**
       * 确认订单支付按钮： 把密码/验证值 传给父，在父组件中执行订单支付
       * */
      handlerPayBtn() {
        if (!this.verificationCodeArr || this.verificationCodeArr.length != 6) return false
        this.$emit('handlerPayOrderBtn', this.verificationCodeArr.join(''));
      },
      /**
       * 手动输入密码
       * */
      handlerEntryNum(num) {
        if (this.verificationCodeArr.length >= 6) return;
        this.verificationCodeArr.push(num);
      },
      /**
       * 手动删除输入的数值盘
       * */
      handlerDelNum() {
        if (this.verificationCodeArr.length) {
          this.verificationCodeArr.pop();
        }
      },
      /**
       * 忘记密码 就调用外链接跳转
       * */
      handlerForgetPassword() {
        dooolyAPP.gotoJumpJq(this.$router, `${GlobalProperty.frontendDomain.thirdWebSite}verification/0/2`);
      },
      /**
       * 若是积分付款则 60s倒计时
       * */
      handlerCountdownNum() {
        this.countdownNum--;
        clearInterval(this.verificationTimer)
        this.verificationTimer = null;
        this.verificationTimer = setInterval(() => {
          this.countdownNum--;
          if (this.countdownNum === 0) {
            clearInterval(this.verificationTimer);
            this.verificationTimer = null;
            this.countdownNum = 60;
          }
        }, 1000);
      },
      /**
       * 重新获取手机验证码
       * */
      handlerRepeatVerificat() {
        this.$emit('confirmOrder', true);
      },
      /**
       * 关闭keyBoard页面
       * */
      handlerClose() {
        this.$emit('handlerCloseKeyboard', false);
      },
    },
    watch: {},
  }
</script>

<style lang="less" scoped>
  // 键盘页面
  .keyboard-page {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;

    .content {
      position: absolute;
      padding: 0;
      left: 0;
      bottom: 0;
      max-height: 4.15rem;
      width: 100%;
      text-align: center;
      background: #fff;

      .keyboard-title {
        height: 0.44rem;
        line-height: 0.44rem;
        font-size: 0.16rem;
        color: #333;
        border-bottom: 1px solid #ececec;

        &>img {
          width: 0.14rem;
          height: 0.14rem;
          position: absolute;
          left: 0.15rem;
          top: 0.15rem;
        }
      }

      .password-list {
        display: inline-flex;
        border: 1px solid #9f9f9f;
        margin: 0.2rem auto 0.15rem;

        &>span {
          position: relative;
          width: 0.55rem;
          height: 0.42rem;
          line-height: 0.42rem;
          font-size: 0.18rem;
          color: #333;
          border-right: 1px solid #ddd;

          &.password-point:before {
            content: '';
            position: absolute;
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            background: #000;
            transform: translate(-50%, -50%);
          }
        }



      }

      .pay-btn {
        margin: 0 auto;
        width: 3.45rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.16rem;
        color: #fff;
        background: #ee3f44;
        opacity: 0.5;
        text-align: center;

        &.text-color-red {
          opacity: 1;
        }
      }

      .message-title {
        &>p {
          margin: 0.07rem auto 0.11rem;
          width: 3.45rem;
          font-size: 0.12rem;
          color: #999;
          text-align: right;

          .text-color-red {
            color: #ee3f44;
          }

          &.code {
            text-align: center;
          }
        }
      }

      .keyboard-num {
        display: inline-flex;
        flex-wrap: wrap;
        background: rgba(210, 213, 219, 0.9);
        height: 2.17rem;
        justify-content: center;
        align-content: center;

        li {
          width: 1.16rem;
          margin: 0.03rem 0.04rem;
          height: 0.47rem;
          line-height: 0.47rem;
          background: #ffffff;
          box-shadow: 0 1px 0 0 #848688;
          border-radius: 0.05rem;
          font-size: 0.21rem;
          text-align: center;

          &:nth-child(10) {
            opacity: 0;
          }

          &:nth-child(12) {
            background: rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0;

            img {
              width: 0.24rem;
              height: auto;
            }
          }
        }
      }
    }
  }
</style>