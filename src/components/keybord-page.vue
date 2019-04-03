<template>
  <div class='keyboard-page'>
    <div class="content">
      <div class="keyboard-title">
        <img src="../assets/images/checkout-counter/close_icon.png" alt="">
        {{'请输入兜礼支付密码'}}
      </div>
      <!-- 密码输入框 -->
      <div class="password-list">
        <span class="password-circle" 
              v-for="item in passwordNumArr"
              :key="item.id">
              {{item.value | filterPasswordNum}}
        </span>
      </div>
      <!-- 确认支付 按钮 -->
      <div class="pay-btn" :class="{'text-color-red':true}">
          确认支付
      </div>
      <!-- 短信提示信息 -->
      <div class="message-title">
        <!-- 定向积分支付 手机验证码 -->
        <p v-if="true" class="code">
          <span v-if="false">
            验证码已发送至您的手机, 
            <label class="text-color-red">{{'60'}}s</label>
            后请重新获取
          </span>
          <span v-else>
            未收到验证码，请
            <label class="text-color-red">重新获取</label>
          </span>
        </p>
        <p v-else>
          <label class="text-color-red">忘记密码？</label>
        </p>
      </div>
      <!-- 数字键盘 -->
      <ul class="keyboard-num">
        <li v-for="(item,index) in keyboardNumArr"
              :key="index">{{item}}
        </li>
        <li>
          <img class="keyboard-delete" src="../assets/images/checkout-counter/keyboard_delete_icon.png">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'keyboard',
  props: {
  },
  data() {
    return {
       passwordNumArr:[{ value: '', id: 1 }, { value: '', id: 2 }, { value: '', id: 3 }, 
                            { value: '', id: 4 }, { value: '', id: 5 }, { value: '', id: 6 }],
       keyboardNumArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0],
    };
  },
  // 键盘输入密码 过滤器
  filters: {
    filterPasswordNum(val) {
      if(!val) return ;
      return '●';
    },
  },
}
</script>

<style lang="less" scoped>
// 键盘页面
.keyboard-page{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  .content{
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
    .password-list{
      display: inline-flex;
      border: 1px solid #9f9f9f;
      margin: 0.2rem auto 0.15rem;
        &>span {
          width: 0.55rem;
          height: 0.42rem;
          line-height: 0.42rem;
          font-size: 0.18rem;
          color: #333;
          border-right: 1px solid #ddd;
        }
    }
    .pay-btn{
      margin: 0 auto;
      width: 3.45rem;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.16rem;
      color: #fff;
      background: #ee3f44;
      opacity: 0.5;
      text-align: center;
      &.text-color-red{
        opacity: 1;
      }
    }
    .message-title{
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
    .keyboard-num{
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

