<template>
  <div id="payment" v-if="!isNaN(orderInfo.totalFree)">
    <div class="content">
      需支付：<span class="amount">{{isShowCharge?totalAmount:orderInfo.totalFree}}</span><label class="col" v-show="isShowCharge && orderInfo.serviceCharge>0">（含手续费：<span class="charge">{{orderInfo.serviceCharge}}</span>）</label>
    </div>
    <div v-if="orderInfo.orderType != 1">
      <div class="pay-type" v-for="(item,index) in usablePayList" :key="index">
        <div class="line" v-if="index === 0">
          <div class="center direct">
            <span class="fl direct-left">定向积分
              <img class="direct-pic" @click="answer" src="../../../assets/images/payment/why.png" alt="定向积分疑问">
            </span>

            <span class="fr direct-available">可抵扣余额：<label>{{Number(orderInfo.dirIntegral)>0?orderInfo.dirIntegral:'余额不可用'}}</label></span>
          </div>
          <span v-if='item.usable' class="circle" :class="{'no-border': item.selected}" @click="handlerChoose(item)">
            <img class="pic fr" v-if='item.selected' src="../../../assets/images/payment/pay_check.png" alt="定向积分选中">
          </span>
          <span v-if='!item.usable' class="circle no-border">
            <img class="pic fr" src="../../../assets/images/payment/pay_check_gray.png" alt="定向积分不可点击">
          </span>
        </div>
      </div>

      <div class="pay-title">
        兜礼方式<span>（使用该支付商户将不向个人开具发票）</span>
      </div>
      <div class="pay-type">
        <section v-for="(item,index) in usablePayList" :key="index">
          <div v-if="index >0" class="line">
            <img class="pic fl" :src="item.imgSrc" />
            <div class="center">
              <span class="type-text fl">{{item.text}}</span>
              <span v-if="item.name === 'dooolyIntergral'" class="fr available">可用余额：<label class="point">{{userInfo.availablePoints}}</label></span>
              <span v-if="item.name !== 'dooolyIntergral' && item.selected" class="fr available">需支付：<label class="point">{{item.payAmount}}</label></span>
            </div>
            <span v-if='item.usable' class="circle" :class="{'no-border': item.selected}" @click="handlerChoose(item)">
              <img class="pic fr" v-if='item.selected' src="../../../assets/images/payment/pay_check.png" alt="选中积分支付">

            </span>
            <span v-if='!item.usable' class="circle no-border">
              <img class="pic fr" src="../../../assets/images/payment/pay_check_gray.png" alt="积分灰色">
            </span>
          </div>
        </section>

      </div>
    </div>
    <div class="footer" @click="confirm">
      确认支付
    </div>
    <!-- 确认弹出框 -->
    <div class="isLeave_bg" v-show="isConfirm_show" @touchmove.prevent>
      <div class="isLeave">
        <p>确定要离开收银台？</p>
        <div class="input_view">
          <div @click="cancel_orderNun()" class="inputBtn left">确认离开</div>
          <div @click="goOn" class="inputBtn right">继续支付</div>
        </div>
      </div>
    </div>
    <!-- 错误弹出框 -->
    <div v-if="alr_show" class="toast_bg" @touchmove.prevent>
      <div class="toast">
        <p>温馨提示</p>
        <div class="text">{{to_hint}}</div>
        <div class="input" @click="alr_show = false">确定</div>
      </div>
    </div>
    <!-- 键盘 -->
    <key-board ref='keyBoard' v-show='showKeyBoard' v-on:closeKeyBoard="closeKeyBoard" v-on:openConfirm="openConfirm" v-on:openAlert="openAlert" v-on:confirm="confirm" :isPayPassword='userInfo.isPayPassword' :orderNum="orderNum" :orderInfo="orderInfo" :payType="payType" :tradeType="tradeType" :meituanInfo="meituanInfo" :dirIntegralSwitch="dirIntegralSwitch" :payVersion='payVersion' :httpRedirectUrl="httpRedirectUrl"></key-board>
  </div>
</template>
<script>
// :supportPayType="orderInfo.supportPayType" :productType="orderInfo.productType" :payId="orderInfo.payId"
import payment from './payment.js'
export default payment
</script>
<style lang="less">
@import './payment.less';
</style>


