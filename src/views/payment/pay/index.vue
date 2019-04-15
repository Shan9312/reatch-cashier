<template>
  <div class="pay-warpper">
    <!-- 支付总金额提示 -->
    <div class="content">
      需支付：
      <span
        class="amount">{{isShowChargePay?(defaultOptions.needPayAmount + defaultOptions.serviceCharge).toFixed(2):defaultOptions.needPayAmount.toFixed(2)}}</span>
      <label class="charge-text" v-show="isShowChargePay
                             && defaultOptions.serviceCharge>0">
        （含手续费：<span class="charge">{{defaultOptions.serviceCharge.toFixed(2) }}</span>）
      </label>
    </div>
    <div>
      <!-- 定向积分 -->
      <div class="pay-type" v-for='item in useAblePayList' :key="item.id">
        <div class="line" v-if="item.id === 1">
          <div class="center direct">
            <span class="fl direct-left names">{{item.text}}
              <img class="direct-pic" @click="handlerWhatOrientIntergral"
                src="@/assets/images/checkout-counter/icon_why.png" alt="定向积分疑问">
            </span>
            <span class="fr direct-available">可抵扣余额:
              <label> {{item.payAmount > 0? item.payAmount.toFixed(2) : '余额不可用'}}</label>
            </span>
          </div>
          <!-- 支付选中的状态样式组件 -->
          <checkout-btn :payItem="item" @handlerChoosePay="handlerChoosePay">
          </checkout-btn>
        </div>
        <!--  -->
      </div>
      <!-- 兜礼付款方式提醒 -->
      <div class="pay-title">
        兜礼方式<span>（使用该支付商户将不向个人开具发票）</span>
      </div>
      <!--/兜礼/微信/支付宝-->
      <div class="pay-type">
        <section v-for='item in useAblePayList' :key="item.id">
          <div class="line" v-if="item.id !== 1">
            <img class="picture fl" :src="item.imgSrc" />
            <div class="center">
              <span class="type-text fl names">{{item.text}}</span>
              <span class="fr available" v-if="item.id === 2">
                可用余额：<label class="point">{{item.payAmount.toFixed(2) }}</label></span>
              <span class="fr available" v-if="item.selected  && item.id >2  ">
                需支付：<label class="point">{{item.payAmount.toFixed(2) }}</label></span>
            </div>
            <!-- 支付选中的状态样式组件 -->
            <checkout-btn :payItem="item" @handlerChoosePay="handlerChoosePay">
            </checkout-btn>
          </div>
        </section>
      </div>
    </div>
    <!-- 底部确认支付按钮 -->
    <div class="footer" @click="handlerConfirmPay">
      确认支付
    </div>
    <!-- 微信/支付宝/支付的弹出框 -->
    <div class="leave-box" v-show="isShowLeaveBtn" @touchmove.prevent>
      <div class="confirm-leave">
        <p>确定要离开收银台？</p>
        <div class="input-view">
          <div @click="dooolyAPP.goBackPageIndex('1')" class="leave-input-btn left">确认离开</div>
          <div @click="continuePay" class="leave-input-btn right">继续支付</div>
        </div>
      </div>
    </div>
    <!-- 短信/密码验证错误的弹出框 -->
    <div v-if="promptDialog" class="toast-bg" @touchmove.prevent>
      <div class="toast">
        <p>温馨提示</p>
        <div class="text">{{promptText}}</div>
        <div class="input" @click="promptDialog = false">确定</div>
      </div>
    </div>
    <!-- 键盘页面 -->
    <Keyboard ref="keybordItem" v-show="isShowKeyboard" :isPayPassword="defaultOptions.isPayPassword"
      @handlerCloseKeyboard="handlerCloseKeyboard" @handlerPayOrderBtn="handlerPayOrderBtn"
      @confirmOrder="confirmOrder">
    </Keyboard>
    <!-- 键盘页面 end-->
  </div>
</template>

<script>
  import Keyboard from '@/components/Keyboard'; // 手机号验证的 键盘弹框
  import CheckoutBtn from '@/components/CheckoutButton'; // 支付选中的状态样式
  import {
    unifiedorder,
    getPayForm,
    integralPay,
    getPayResult,
  } from '@/service'; // 接口调试方法
  import {
    UtilsFunction
  } from '@/common/utils.js'; // 引用的数据格式处理的 函数
  import {
    MintUI,
    GlobalProperty,
    GlobalFunction
  } from '@/common/global' // 引用的封装的组件


  export default {
    name: 'Payment',
    components: {
      Keyboard,
      CheckoutBtn
    },
    computed: {
      selectedPayList() {
        // 集中获取 被选中的支付列表
        return this.useAblePayList.filter(payItem => payItem.selected)
      },
    },
    data() {
      return {
        orderNum: this.$route.params.orderNum, // 订单号
        userId: 88441358, //localStorage.userId || UtilsFunction.getUrlParams('userId'),
        defaultOptions: {
          needPayAmount: 100, // 需支付金额
          realPayAmount: 100, // 实际支付金额 传入值跟需支付金额一样即可
          serviceCharge: 2, // 手续费
          orientIntergral: 20, // 定向积分
          dooolyIntergral: 30, // 兜礼积分
          supportDooolyIntergral: true, // 是否支持兜礼积分
          supportHybrid: true, // 是否支持混合支付
          supportWechat: true, // 是否支持微信支付
          supportAlipay: true, // 是否支持支付宝
          isPayPassword: '1', // 后端返回：'1' :短信验证; '2' :密码支付
          payId: '', // 后端返回的 预订单ID
          dirIntegralSwitch: false, // 支付方式为 定向积分，发给后端字段
          commonIntegralSwitch: false, // 支付方式为 兜礼积分，发给后端字段
          productType: '', // 后端返回的 商品类型
        },
        usableOptions: {}, // 实际的支付对象
        result: {
          orientIntergralFlag: false, // 是否添加定向积分支付
          dooolyIntergralFlag: false, // 是否添加兜礼积分支付
          orientIntergralPayAmount: 0, // 定向积分需要支付的金额
          dooolyIntergralPayAmount: 0 // 兜礼积分需要支付的金额
        },
        isShowChargePay: false, // 是否显示手续费
        useAblePayList: [
          // {
          //   text: '定向积分', // 支付方式的 名称
          //   name: 'orientIntergral', //支付方式 英文名称
          //   usable: false, // 表示 当前支付 方式 是否可用
          //   payAmount: 0, // 支付 金额
          //   selected: false, // 支付选择框的 状态
          //   imgSrc: '', // 图片样式
          //   id: 1, // id 标示唯一的值
          // }, // 支付方式的属性
        ], // 支付种类的列表; 如 定积分/兜礼/微信/支付宝 等等
        integralList: [], // 含积分的数组
        isShowKeyboard: false, // 是否显示 键盘页面
        redirectUrl: '', // TODO:支付成功页面；从接口取得返回地址，接口有值给后台就传接口的值
        responseRedirectUrl: false, // 判断 unifiedorder接口获取的地址是否有
        tradeType: 'DOOOLY_JS', // 设置交易类型 默认 DOOOLY_JS
        payType: 0, // 设置付款类型
        meituanObj: {}, // 美团支付信息
        isShowLeaveBtn: false,
        browserName: GlobalProperty.browserName, // 浏览器名称
        promptText: '', // 温馨提示标题
        promptDialog: false, // 温馨提示框
      };
    },
    created() {
      // 获取用户 订单信息
      this.getPayContentByUserId();
    },
    mounted() {
      // 监听 且无刷新的 在浏览历史中添加/修改记录
      this.handlerReplaceState(1);
    },
    methods: {
      /**
       * 根据用户的信息 获取付款页面的内容
       * 并且根据 返回的paymethods 的值 判断付款列表
       * */
      async getPayContentByUserId() {
        const res = await unifiedorder(this.orderNum, this.userId, this.redirectUrl);
        if (res.code === 1000) {
          const data = res.data;
          // 初始化订单信息值
          this.defaultOptions = {
            needPayAmount: Number(data.totalFree),
            realPayAmount: Number(data.totalFree),
            serviceCharge: Number(data.serviceCharge),
            orientIntergral: Number(data.dirIntegral),
            dooolyIntergral: Number(data.userIntegral),
            payId: data.payId,
            isPayPassword: data.isPayPassword,
            productType: data.productType,
            supportOrientIntergral: true,
            supportHybrid: true,
            supportDooolyIntergral: true,
            supportWechat: true,
            supportAlipay: true,
            dirIntegralSwitch: false,
            commonIntegralSwitch: false,
          }
          // 特殊情况：判断 欧飞 公司 不支持 混合
          if (data.company === '兜礼') {
            this.defaultOptions.supportHybrid = false;
          }
          // 若后端有返回 redirect地址 就用后端返回的
          if (data && data.redirectUrl) {
            this.redirectUrl = res.data.redirectUrl;
          }
          this.supportPayType(data.payMethod);
          // 初始化 支付方式列表
          this.initUseAblePayList();
          // 初始化 用户默认支付方式
          this.initDefaultPayType();
        } else {
          MintUI.Toast.open({
            message: res.msg
          })
        }
      },
      /**
       * 根据 返回的paymethods 的值 判断付款列表
       * 
       * */
      supportPayType(payMethod) {
        const arr = payMethod.split(",");
        arr.forEach(item => {
          if (item === 0 || item === 2 || item === 11) { // 兜礼列表
            this.defaultOptions.supportDooolyIntergral = true;
          } else if (item === 1 || item === 2) { // 微信列表
            this.defaultOptions.supportWechat = true;
          } else if (item === 6 || item === 11) { // 支付宝列表
            this.defaultOptions.supportAlipay = true;
          }
        });
      },
      /**
       * 初始化可使用的 支付方式列表；
       * 
       * */
      initUseAblePayList() {
        this.useAblePayList = [];
        // 定向积分：不管任何情况都会显示，通过积分是否大于0来判断是否可用
        this.useAblePayList.push({
          text: '定向积分',
          name: 'orientIntergral',
          usable: this.defaultOptions.orientIntergral > 0,
          payAmount: this.defaultOptions.orientIntergral,
          selected: false,
          imgSrc: '',
          id: 1,
        })
        // 兜礼积分：后台可配置是否显示，通过积分是否大于0来判断是否可用
        if (this.defaultOptions.supportDooolyIntergral) {
          this.useAblePayList.push({
            text: '兜礼积分',
            name: 'dooolyIntergral',
            usable: this.defaultOptions.dooolyIntergral > 0,
            payAmount: this.defaultOptions.dooolyIntergral,
            selected: true,
            imgSrc: require('@/assets/images/checkout-counter/icon_doooly.png'),
            id: 2,
          })
        }
        // 微信支付：后台可配置是否显示
        if (this.defaultOptions.supportWechat) {
          this.useAblePayList.push({
            text: '微信支付',
            name: 'wechat',
            usable: true,
            payAmount: 0,
            selected: false,
            imgSrc: require('@/assets/images/checkout-counter/icon_wechat.png'),
            id: 3,
          })
        }
        // 支付宝：后台可配置是否显示
        if (this.defaultOptions.supportAlipay) {
          this.useAblePayList.push({
            text: '支付宝支付',
            name: 'alipay',
            usable: true,
            payAmount: 0,
            selected: false,
            imgSrc: require('@/assets/images/checkout-counter/icon_alipay.png'),
            id: 4,
          })
        }
      },
      /**
       * 初始化 推荐 用户默认使用的支付方式
       * 
       * */
      initDefaultPayType(options) {
        this.usableOptions = options || JSON.parse(JSON.stringify(this.defaultOptions));
        this.calcDisabledPayType(); // 判断计算禁用使用支付情况
        this.calaNeedServiceCharge(); // 判断计算需要手续费情况
        this.orientIntergralPayType(); // 初始化使用支付方式 以及实际支付积分数 或 金额数
        let orientIntergralSelected = false
        let orientIntergralPayAmount = 0
        let dooolyIntergralSelected = false
        let dooolyIntergralPayAmount = 0

        if (this.result.orientIntergralFlag) { // 选中定向积分支付及修改需支付金额
          orientIntergralSelected = true
          orientIntergralPayAmount = this.result.orientIntergralPayAmount
        }
        if (this.result.dooolyIntergralFlag) { // 选中兜礼积分支付及修改需支付金额
          dooolyIntergralSelected = true
          dooolyIntergralPayAmount = this.result.dooolyIntergralPayAmount
        }
        this.useAblePayList.map(payType => {
          if (payType.name == 'orientIntergral') {
            payType.selected = orientIntergralSelected
          }
          if (payType.name == 'dooolyIntergral') {
            payType.selected = dooolyIntergralSelected
          }
        })
        // 重置判断
        this.result = {
          orientIntergralFlag: false,
          dooolyIntergralFlag: false,
          orientIntergralPayAmount: 0,
          dooolyIntergralPayAmount: 0
        }
      },
      /**
       * 判断哪些情况会 被禁止使用
       * 
       * */
      calcDisabledPayType() {
        let usable = true;
        let intergralArr = ['orientIntergral', 'dooolyIntergral'];
        // 暂且只有一种情况：不支持混合支付 && 定向积分+兜礼积分 < 实际金额 && 是选中状态;则为 禁用状态；
        if (!this.defaultOptions.supportHybrid &&
          ((this.defaultOptions.orientIntergral + this.defaultOptions.dooolyIntergral) <
            (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) &&
          this.useAblePayList.filter(payItem => intergralArr.includes(payItem.name) && payItem.selected).length == 0
        ) {
          usable = false
        }
        this.useAblePayList.map((payItem) => {
          if (payItem.name === 'orientIntergral') { //  判断 定向积分 是否禁用：定向积分数 =0 就禁用
            payItem.usable = this.defaultOptions.orientIntergral ? usable : false;
          }
          if (payItem.name === 'dooolyIntergral') { //  判断 兜礼积分 是否禁用: 兜礼数值 =0
            payItem.usable = this.defaultOptions.dooolyIntergral ? usable : false;
          }
        })
      },
      /**
       * 判断是否哪种支付方式需要 手续费 
       * 
       * */
      calaNeedServiceCharge() {
        this.isShowChargePay = false;
        // 不支持兜礼积分或兜礼积分为0 不计算手续费
        if (!this.usableOptions.supportDooolyIntergral || this.usableOptions.dooolyIntergral == 0) return false
        // 定项积分足够支付 不计算手续费
        if (this.usableOptions.orientIntergral >= this.usableOptions.needPayAmount) return false
        // 定向积分 + 兜礼积分不能支付时，并且不支持混合支付时，这时会采取现金支付，不计算手续费
        if ((this.usableOptions.orientIntergral + this.usableOptions.dooolyIntergral) <
          (this.usableOptions.needPayAmount + this.usableOptions.serviceCharge) &&
          !this.usableOptions.supportHybrid) return false
        this.usableOptions.realPayAmount = this.usableOptions.needPayAmount + this.usableOptions.serviceCharge;
        this.isShowChargePay = true;
      },
      // 定向积分： 支付方式
      orientIntergralPayType() {
        // 定向积分大于0，默认一定会选中定向积分
        if (this.usableOptions.orientIntergral > 0) {
          this.result.orientIntergralFlag = true // 选中定向积分
          // 如果定向积分足够支付 则默认只选择定向积分 定向积分需支付金额为实际需支付金额
          if (this.usableOptions.orientIntergral >= this.usableOptions.realPayAmount) {
            this.result.orientIntergralPayAmount = this.usableOptions.realPayAmount
          } else {
            this.result.orientIntergralPayAmount = this.usableOptions.orientIntergral // 定向积分不够时需支付金额为全部定向积分
            this.initDooolyIntergral() // 往下判断兜礼积分支付
          }
        } else {
          this.result.orientIntergralFlag = false // 定向积分不足时不选中
          this.initDooolyIntergral() // 往下判断兜礼积分支付
        }
      },
      // 兜礼积分： 支付方式
      initDooolyIntergral() {
        // 判断是否支持兜礼积分支付并且余额大于0 如果大于0则一定会默认选中兜礼积分
        if (this.usableOptions.supportDooolyIntergral && this.usableOptions.dooolyIntergral > 0) {
          this.result.dooolyIntergralFlag = true // 选中兜礼积分
          // 判断定向积分+兜礼积分是否足够支付，足够的话兜礼积分需支付积分则为 realPayAmount - orientIntergral
          if ((this.usableOptions.orientIntergral + this.usableOptions.dooolyIntergral) >=
            (this.usableOptions.needPayAmount + this.usableOptions.serviceCharge)) {
            this.result.dooolyIntergralPayAmount = this.usableOptions.realPayAmount - this.usableOptions.orientIntergral
          } else {
            this.result.dooolyIntergralPayAmount = this.usableOptions.dooolyIntergral // 兜礼积分不够时需支付金额为全部兜礼积分
            this.initHybrid() //往下判断混合支付
          }
        } else {
          this.result.dooolyIntergralFlag = false // 不支持兜礼积分支付时不选中
          this.initHybrid()
        }
      },
      // 混合支付方式
      initHybrid() {
        // 定向积分+兜礼积分<需支付总金额并且不支持混合支付时，不选中定向积分及兜礼积分
        if (!this.usableOptions.supportHybrid) {
          this.result.orientIntergralFlag = false
          this.result.dooolyIntergralFlag = false
        }
        this.initWechat()
      },
      // 微信： 支付方式
      initWechat() {
        if (this.usableOptions.supportWechat) {
          let wechatPayAmount = 0
          if (this.usableOptions.supportHybrid) {
            wechatPayAmount = this.usableOptions.realPayAmount - this.result.orientIntergralPayAmount - this.result
              .dooolyIntergralPayAmount
          } else {
            wechatPayAmount = this.usableOptions.realPayAmount
          }
          // 选中微信支付及修改需支付金额
          this.useAblePayList.map(payType => {
            if (payType.name == 'wechat') {
              payType.selected = true
              payType.payAmount = wechatPayAmount
            }
          })
        } else {
          this.initAlipay()
        }
      },
      // 支付宝： 支付方式
      initAlipay() {
        // 判断是否支持支付宝支付
        if (this.usableOptions.supportAlipay) {
          let alipayPayAmount = 0
          if (this.usableOptions.supportHybrid) {
            alipayPayAmount = this.usableOptions.realPayAmount - this.result.orientIntergralPayAmount - this.result
              .dooolyIntergralPayAmount
          } else {
            alipayPayAmount = this.usableOptions.realPayAmount
          }
          // 选中支付宝支付及修改需支付金额
          this.useAblePayList.map(payType => {
            if (payType.name == 'alipay') {
              payType.selected = true
              payType.payAmount = alipayPayAmount
            }
          })
        } else {
          throw Error('error')
        }
      },
      /**
       * 点击切换支付方式
       * 
       * */
      handlerChoosePay(item) {
        let orientIntergralItem, dooolyIntergralItem, wechatItem, alipayItem,
          orientIntergralPayAmount, dooolyIntergralPayAmount

        orientIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'orientIntergral')
        dooolyIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'dooolyIntergral')
        if (orientIntergralItem.length > 0) {
          orientIntergralPayAmount = orientIntergralItem[0].payAmount
        }
        if (dooolyIntergralItem.length > 0) {
          dooolyIntergralPayAmount = dooolyIntergralItem[0].payAmount
        }
        // 当前支付方式不可用则直接返回
        if (!item.usable) return false
        // 当前只选中一种支付方式的情况下不允许取消选中
        if (this.selectedPayList.length == 1 &&
          this.selectedPayList[0].name == item.name &&
          item.selected) {
          return false
        }
        let cashTypeArr = ['wechat', 'alipay'] //现金支付类型
        // 不可取消微信支付及支付宝支付
        if (item.selected && cashTypeArr.includes(item.name)) return false
        // 定向积分+兜礼积分点击 取消时
        if (item.selected && !cashTypeArr.includes(item.name)) {
          if ((this.defaultOptions.orientIntergral >= this.defaultOptions.needPayAmount && item.name ==
              'dooolyIntergral') ||
            (this.defaultOptions.dooolyIntergral >= (this.defaultOptions.needPayAmount + this.defaultOptions
              .serviceCharge) && item.name == 'orientIntergral')) {
            // 单项积分足够时，可以取消另一项
            (this.useAblePayList.filter(payItem => payItem.id === item.id)).selected = false;
          } else {
            if (!this.defaultOptions.supportHybrid) { // 不支持混合支付，并且单项积分不够支付时 不允许取消其中一项
              return false
            } else {
              // 开启微信支付及支付宝支付
              this.useAblePayList.map(payItem => {
                if (cashTypeArr.includes(payItem.name)) {
                  payItem.selected = true
                }
              })
            }
          }
        }
        // 微信选中时点击支付宝则切换到支付宝并取消微信选中，反之一样
        if (cashTypeArr.includes(item.name) && !item.selected) {
          let cashItem = this.selectedPayList.filter(payItem => cashTypeArr.includes(payItem.name))
          // 当我已经选中微信/支付宝时，这个时候为切换现金支付方式
          if (cashItem.length > 0) {
            let payAmount = cashItem[0].payAmount
            this.useAblePayList.map(payItem => {
              if (payItem.name == item.name) {
                payItem.selected = true
                payItem.payAmount = payAmount
              }
              if (cashTypeArr.includes(payItem.name) && payItem.name != item.name) {
                payItem.selected = false
                payItem.payAmount = 0
              }
            })
            return false
          }
          if (this.defaultOptions.supportHybrid) {
            // 单向积分 都满足的足够的情况下再选现金支付，直接切换为现金支付
            if (orientIntergralPayAmount >= this.defaultOptions.needPayAmount &&
              dooolyIntergralPayAmount >= (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
              this.useAblePayList.map(payItem => {
                if (!cashTypeArr.includes(payItem.name)) {
                  payItem.selected = false
                  payItem.payAmount = 0
                }
              })
            } else if (
              (orientIntergralPayAmount + dooolyIntergralPayAmount) >= (this.defaultOptions.needPayAmount + this
                .defaultOptions.serviceCharge)) {
              // 定向积分+兜礼积分组合够的情况下，选择现金支付，默认取消兜礼，使用定向+现金 
              this.useAblePayList.map(payItem => {
                if (payItem.name == 'dooolyIntergral') {
                  payItem.selected = false
                  payItem.payAmount = 0;
                }
              })
            } else if (dooolyIntergralPayAmount >= (this.defaultOptions.needPayAmount + this.defaultOptions
                .serviceCharge) || orientIntergralPayAmount >= this.defaultOptions.needPayAmount) {
              // 定向 或者 兜里 单个积分大于需要付款时, 清除当前的积分值
              this.useAblePayList.map(payItem => {
                if (payItem.name == 'dooolyIntergral' || payItem.name == 'orientIntergral') {
                  payItem.selected = false
                  payItem.payAmount = 0;
                }
              })
            }
          } else { // 不支持混合支付 直接切换为现金支付
            this.useAblePayList.map(payItem => {
              if (!cashTypeArr.includes(payItem.name)) {
                payItem.selected = false
                payItem.payAmount = 0
              }
            })
          }
        }
        // 不支持混合支付时当前选中现金支付时切换到积分支付
        if (!item.selected && !cashTypeArr.includes(item.name)) {
          // 定向积分或着兜礼积分单项满足时，可以直接选中单项
          if ((item.name == 'orientIntergral' && this.defaultOptions.orientIntergral >= this.defaultOptions
              .needPayAmount) ||
            item.name == 'dooolyIntergral' && this.defaultOptions && this.defaultOptions.dooolyIntergral >=
            (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)
          ) {
            if (item.name == 'dooolyIntergral') {
              this.useAblePayList.map(payItem => {
                if (payItem.name == 'orientIntergral') {
                  payItem.selected = false
                }
              })
            }
          } else {
            if ((this.defaultOptions.orientIntergral + this.defaultOptions.dooolyIntergral) >=
              (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
              // 点击定向积分时 顺带打开兜礼积分
              if (item.name == 'orientIntergral') {
                this.useAblePayList.map(payItem => {
                  if (payItem.name == 'dooolyIntergral') {
                    payItem.selected = true
                  }
                })
              } else {
                this.useAblePayList.map(payItem => {
                  if (payItem.name == 'orientIntergral') {
                    payItem.selected = true
                  }
                })
              }
            }
          }
        }
        item.selected = !item.selected
        // copy返回的数值
        let optionsClone = JSON.parse(JSON.stringify(this.defaultOptions))
        // 从选中的支付列表中， 判断是哪个付款方式
        orientIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'orientIntergral')
        dooolyIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'dooolyIntergral')
        wechatItem = this.selectedPayList.filter(payItem => payItem.name == 'wechat')
        alipayItem = this.selectedPayList.filter(payItem => payItem.name == 'alipay')
        // 初始化 付款方式
        if (!orientIntergralItem.length) {
          optionsClone.orientIntergral = 0
        }
        if (!dooolyIntergralItem.length) {
          optionsClone.dooolyIntergral = 0
        }
        if (!wechatItem.length) {
          optionsClone.supportWechat = false
        }
        if (!alipayItem.length) {
          optionsClone.supportAlipay = false
        } else {
          optionsClone.supportWechat = false
        }
        //
        this.initUseAblePayList();
        // 切换后的  付款方式。
        this.initDefaultPayType(optionsClone);
      },
      /**
       * 关闭 键盘页面
       * 
       * */
      handlerCloseKeyboard(v) {
        this.isShowKeyboard = v;
        this.$refs.keybordItem.verificationCodeArr = [];
      },
      /**
       * 定向积分定义解释
       * 
       * */
      handlerWhatOrientIntergral() {
        MintUI.MessageBox({
          title: '什么是定向积分？',
          message: '定向积分是只能在兜礼固定商品分类、固定商户才能消费的特殊积分，它是企业对员工的另一种特殊关怀。当该商品支持定向积分时，可用余额默认勾选，你可以选择使用或者不使用。当该商品不支持定向积分时，可用余额显示不可用。',
          showCancelButton: false,
        })
      },
      /**
       * 点击确定付款
       * 
       * */
      handlerConfirmPay() {
        // 判断payType类型,选中的支付列表 并做出对应的支付情况
        this.payTypeByselectedPayList();
        // 判断交易平台的tradeType:类型
        this.tradeTypeByBrowserName();
        // 如果 积分支付，倒计时在 60s 内，重新打开键盘页面，不重复发送 短信
        if (!this.payType) {
          if (this.$refs.keybordItem.countdownNum > 0 && this.$refs.keybordItem.countdownNum < 60) {
            this.isShowKeyboard = true;
            return
          }
        }
        // 确认订单情况
        this.confirmOrder();
      },
      /**
       * 判断 payType 类型 发送给后端 ，及 支付方式
       * 0 积分支付 1微信支付  6 支付宝；
       * */
      payTypeByselectedPayList() {
        if (!this.selectedPayList.length) return false;
        this.integralList = this.selectedPayList.filter(payItem => payItem.id < 3);
        this.selectedPayList.forEach(obj => {
          if (obj.name === 'orientIntergral' || obj.name === 'dooolyIntergral') { // 定向 积分支付:0
            this.payType = 0;
            this.defaultOptions.dirIntegralSwitch = true;
          } else if (obj.name === 'dooolyIntergral') { // 兜里 积分支付:0
            this.payType = 0;
            this.defaultOptions.commonIntegralSwitch = true;
          } else if (this.integralList.length && obj.name === 'wechat') { // 微信积分混合:2
            this.payType = 2;
          } else if (this.integralList.length && obj.name === 'alipay') { // 支付宝积分混合:11
            this.payType = 11;
          } else if (!this.integralList.length && obj.name === 'wechat') { // 微信支付:1
            this.payType = 1;
          } else if (!this.integralList.length && obj.name === 'alipay') { // 支付宝支付:6
            this.payType = 6;
          }
        })
      },
      /**
       * 首次点击确认按钮，先去 查询订单是否有效
       *  确认订单OK后：1.判断选中的支付类型 做对于的 付款跳转
       * */
      async confirmOrder() {
        const res = await getPayForm(
          this.orderNum,
          this.userId,
          this.redirectUrl,
          this.defaultOptions.payId,
          this.tradeType,
          this.payType,
          this.defaultOptions.commonIntegralSwitch ? '1' : '0',
          this.defaultOptions.dirIntegralSwitch ? '1' : '0',
        );
        if (res.code === 1000) {
          if (this.integralList.length) { // 只要含有积分,就键盘弹出 倒计时计数 
            this.isShowKeyboard = true;
            this.$refs.keybordItem.handlerCountdownNum();
          } else if (this.payType === 1) { // 微信接口支付
            this.wechatPayOrder(res.data);
          } else if (this.payType === 6) { // 支付宝接口支付
            this.apliyPayOrder(res.data);
          }
        } else {
          // 订单 无效 则返回数据 做弹窗 提示 信息
          MintUI.Toast.open({
            message: res.msg,
          });
        }
      },
      /**
       * 判断当前 浏览器内核；然后根据不同的内核 做些事情： 
       * 1.tradeType类型，返回给后端的字段 【DOOOLY_APP，DOOOLY_JS,WISCO_APP,WISCO_JS其中之一】
       * */
      tradeTypeByBrowserName() {
        if (this.browserName === 'WeChat') {
          if (localStorage.token == localStorage.wiscoToken) {
            this.tradeType = 'WISCO_JS'
          } else {
            this.tradeType = 'DOOOLY_JS'
          }
        } else if (this.browserName == 'WebKit' || this.browserName == 'Chrome WebView') {
          this.tradeType = 'DOOOLY_APP'; // 兜礼 app
        } else if (this.browserName == 'otherAPPAndroid' || this.browserName == 'otherAPPIos') {
          this.tradeType = 'WISCO_APP'; // 其他第三方app
        } else if (this.payType === 1 || this.payType === 2) { // 含微信的支付，不在微信和app中，用微信h5调起微信
          this.tradeType = 'DOOOLY_H5'
        } else {
          this.tradeType = 'DOOOLY_JS'; // 默认
        }
      },
      /**
       * 子传父组件：确认支付按钮
       * 1.根据密码/验证码 确认付款。
       * 2.根据后端返回的数据 是支付混合 还是 微信混合 在各自调用 方式
       * */
      async handlerPayOrderBtn(code) {
        if (this.defaultOptions.isPayPassword === '2') { // 密码输入 需要加密
          code = UtilsFunction.encrypt(code);
        }
        const res = await integralPay(
          this.orderNum,
          this.userId,
          this.defaultOptions.payId,
          code,
          this.defaultOptions.supportOrientIntergral ? '1' : '0', );
        if (res.code === 1000) {
          this.isShowKeyboard = false; // 检验密码通过。可以支付了
          if (this.payType === 2) { // 微信混合支付
            this.wechatPayOrder(res.data);
          } else if (this.payType === 11) { // 支付宝混合支付
            this.apliyPayOrder(res.data);
          } else {
            this.payResponseMsg(); // 付款成功后返回的消息 跳转
          }
        } else if (res.code === 1016 || res.code === 1017) { // 1016:手机验证码失败; 1017:验证码已过期，请重新获取
          this.promptDialog = true;
          this.promptText = res.code === 1016 ? '您输入的短信验证码有误，请重新输入（5分钟内有效）！' : '您输入的短信验证码超时，请重新获取！';
        } else if (res.code === 1007) { // 密码输入错误 
          MintUI.Toast.open({
            message: '支付密码错误，请重新输入',
          });
        } else {
          MintUI.Toast.open({
            message: res.msg,
          });
        }
      },

      // 支付宝支付跳转接口
      apliyPayOrder(data) {
        dooolyAPP.appPay(data, "payResponseMsg", 'zfb');
      },
      // 微信支付跳转接口
      wechatPayOrder(data) {
        const currentBaseUrl = window.location.href.substring(0, window.location.href.indexOf('#') + 1);
        if (this.browserName === 'WeChat') { // 微信支付
          this.wechatBridgePay(data);
        } else if (this.tradeType == 'DOOOLY_H5') { // 微信公众号
          let redirect_url = window.encodeURIComponent(
            `${currentBaseUrl}/cardBuyPayResultH5/${this.orderNum}/${this.defaultOptions.productType}`)
          if (this.responseRedirectUrl) { // 判断 unifiedorder接口获取的地址
            redirect_url = window.encodeURIComponent(
              `${currentBaseUrl}/middle?redirect_url=${window.encodeURIComponent(this.redirectUrl)}`)
            window.location.href = `${data.mwebUrl}&redirect_url=${redirect_url}`;
          } else if (this.handlerThirdJudge()) { // 判断 美团h5支付，支付完成去return_url
            redirect_url = window.encodeURIComponent(
              `${currentBaseUrl}/middle?redirect_url=${window.encodeURIComponent(this.meituanInfo.return_url)}`
            )
            window.location.href = `${data.mwebUrl}&redirect_url=${redirect_url}`;
          } else {
            window.location.href = `${data.mwebUrl}&redirect_url=${redirect_url}`;
          }

        } else {
          dooolyAPP.appPay(data, "payResponseMsg", 'wx') // doooly app
        }

      },
      // 若是 微信环境 则微信接口跳转支付接口
      wechatBridgePay(data) {
        const _this = this;
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": data.appId,
          "timeStamp": data.timeStamp,
          "nonceStr": data.nonceStr,
          "package": data.package,
          "signType": data.signType, // 微信签名方式:
          "paySign": data.paySign // 微信签名
        }, function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            MintUI.Toast.open({
              message: '支付成功',
            });
            _this.payResponseMsg();
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            MintUI.Toast.open({
              message: '用户取消支付!',
            });
          } else {
            MintUI.Toast.open({
              message: '支付失败!',
            });
            _this.payResponseMsg();
          }
        })
      },
      /**
       * 付款成功后返回的值
       *
       * */
      async payResponseMsg() {
        const res = await getPayResult(this.orderNum);
        if (res.code === 1000 || res.code === 1001) {
          // 根据支付环境 跳转到不同的页面
          if (res.data && res.data.redirectUrl) { // 接口有值，直接跳接口的
            dooolyAPP.gotoJumpJq(this.$router, res.data.redirectUrl);
          } else if (this.handlerThirdJudge()) { // 若有美团接口 之间跳转美团
            dooolyApp.gotoJumpJq(this.$router, this.meituanInfo.return_url)
          } else if (this.defaultOptions.productType == 7) { // 活动页面
            const {
              code,
              totalAmount,
              orderId,
              orderNum,
              activityParam
            } = res.data;
            dooolyAPP.gotoJumpJq(this.$router,
              `${GlobalProperty.frontendDomain.thirdWebSite}activity_cardBuyPayResult/${code}/${totalAmount}/${orderId}/${orderNum}/${activityParam}/${this.defaultOptions.productType}`
            )
          } else { // 支付结果页面 
            dooolyAPP.gotoJumpVue(this.$router, `/cardBuyPayResult/${this.orderNum}`)
          }

        } else {
          MintUI.Toast.open({
            message: res.msg,
          });
        }
      },
      // 判断第三方 美团支付付款情况
      handlerThirdJudge() {
        if (UtilsFunction.getUrlParams('orderSource') === 'meituan') { // 若是美团支付 需把信息集合
          this.meituanObj = {
            userId: UtilsFunction.getUrlParams('userId'),
            orderSource: UtilsFunction.getUrlParams('orderSource'),
            return_url: UtilsFunction.getUrlParams('return_url'),
          }
          return true;
        }
      },
      // 点击 继续支付
      continuePay() {
        this.isShowLeaveBtn = false;
        this.handlerReplaceState(2);
      },
      // 监听：在浏览添 前进/后退 添加修改记录。
      handlerReplaceState(v) {
        if (this.browserName == 'WeChat' || this.browserName == 'enterpriseWX') {
          setTimeout(function () {
            v === 1 ? history.pushState(null, null, document.URL) : history.replaceState(null, null, document.URL);
            window.addEventListener('popstate', function () {
              this.isShowLeaveBtn = true;
            }, false);
          }, 0)
        }
      },
    },
    destroyed() {
      // 页面销毁，移除监听
      window.removeEventListener('popstate', function () {
        this.isShowLeaveBtn = true
      }, false);
    },
  }
</script>
<style lang="less" scoped>
  .pay-warpper {
    img {
      width: 100%;
      height: 100%;
    }

    .content {
      padding: 0.14rem 0.15rem 0.36rem;
      font-size: 0.16rem;
      color: #333;
      background: #fff url('~/assets/images/checkout-counter/title_background.png') repeat-x 0 bottom;
      background-size: auto 0.15rem;

      .amount {
        font-size: 0.18rem;
        color: #ee3f44;
      }

      .charge-text {
        font-size: 0.12rem;
        color: #999;

        .charge {
          color: #ee3f44;
        }
      }
    }

    .pay-type {
      background: #fff;
      padding: 0 0.15rem;
      font-size: 0.14rem;
      color: #333;

      .picture {
        width: 0.23rem;
        height: 0.23rem;
      }

      .line {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        .center {
          width: 78%;

          &.direct {
            width: 91%;
            font-size: 0.14rem;

            .direct-left {
              position: relative;
              color: #999;
            }

            .direct-pic {
              width: 0.14rem;
              height: 0.14rem;
              position: absolute;
              right: -0.18rem;
              top: 50%;
              transform: translateY(-50%);
            }

            .direct-available {
              color: #333;
            }
          }

          .available {
            font-size: 0.12rem;
            color: #999;

            .point {
              color: #ee3f44;
            }
          }
        }
      }
    }

    .pay-title {
      padding: 0 0.15rem;
      font-size: 0.14rem;
      color: #333;
      line-height: 0.39rem;
      text-align: left;

      span {
        font-size: 0.12rem;
        color: #999;
      }
    }

    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0.5rem;
      line-height: 0.5rem;
      background: #ee3f44;
      color: #fff;
      font-size: 0.16rem;
      text-align: center;
    }

    .leave-box {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(51, 51, 51, 0.8);
      z-index: 9999;

      .confirm-leave {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2.7rem;
        height: 1.6rem;
        background: #fff;
        transform: translate(-50%, -50%);
        border-radius: 0.1rem;

        p {
          font-size: 0.18rem;
          padding: 0.4rem 0.1rem 0;
          color: #333;
        }

        .input-view {
          display: flex;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 0.5rem;
          border-top: 1px solid #ececec;

          .leave-input-btn {
            flex: 1;
            text-align: center;
            font-size: 0.18rem;
            line-height: 0.5rem;
          }

          .left {
            color: #333;
            border-right: 1px solid #ececec;
          }

          .right {
            color: #ee3f44;
          }
        }
      }
    }

    .toast-bg {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(51, 51, 51, 0.8);
      z-index: 9999;

      .toast {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2.7rem;
        height: 1.78rem;
        background: #fff;
        transform: translate(-50%, -50%);
        border-radius: 0.1rem;
        text-align: center;

        p {
          font-size: 0.18rem;
          padding-top: 0.36rem;
          color: #333;
          font-weight: bold;
        }

        .text {
          font-size: 0.14rem;
          color: #999;
          padding: 0.2rem 0.1rem;
        }

        .input {
          width: 100%;
          height: 0.5rem;
          line-height: 0.5rem;
          position: absolute;
          left: 0;
          bottom: 0;
          border-top: 1px solid #ececec;
          font-size: 0.18rem;
          color: #ee3f44;
        }
      }
    }
  }
</style>