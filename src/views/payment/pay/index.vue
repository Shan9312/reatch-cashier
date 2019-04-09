<template>
  <div class="pay-warpper">
    <!-- 支付总金额提示 -->
    <div class="content">
      需支付：
      <span class="amount">{{defaultOptions.needPayAmount}}</span>
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
              <img class="direct-pic" @click="handleWhatOrientIntergral"
                src="@/assets/images/checkout-counter/icon_why.png" alt="定向积分疑问">
            </span>
            <span class="fr direct-available">可抵扣余额:
              <label> {{item.payAmount > 0? item.payAmount.toFixed(2) : '余额不可用'}}</label>
            </span>
          </div>
          <!-- 支付选中的状态样式组件 -->
          <checkout-btn :payItem="item" @handleChoosePay="handleChoosePay">
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
            <checkout-btn :payItem="item" @handleChoosePay="handleChoosePay">
            </checkout-btn>
          </div>
        </section>
      </div>
    </div>
    <!-- 底部确认支付按钮 -->
    <div class="footer" @click="handleConfirmPay">
      确认支付
    </div>

    <!-- 键盘页面 -->
    <Keyboard ref="keybordItem" v-show="isShowKeyboard" :isShowKeyboard="isShowKeyboard"
      :isPayPassword="defaultOptions.isPayPassword" @handleCloseKeyboard="handleCloseKeyboard"
      @handleConfirmOrderPay="handleConfirmOrderPay">
    </Keyboard>
    <!-- 键盘页面 end-->
  </div>
</template>

<script>
  import Keyboard from '@/components/Keyboard'; // 手机号验证的 键盘弹框
  import CheckoutBtn from '@/components/CheckoutButton'; // 支付选中的状态样式
  import Ajax from '@/common/ajax'
  import Api from '@/common/factory-api'
  import {
    MintUI,
    GlobalProperty,
    GlobalFunction
  } from '@/common/global'

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
      }
    },
    data() {
      return {
        orderNum: this.$route.params.orderNum, // 订单号
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
          // 需要返回给后端的字段 payType， 0积分支付 1微信支付 2积分微信混合支付 6 支付宝；
          // 0,2,11:支持兜礼积分  1,2: 支持微信   6,11:支持支付宝
          isPayPassword: '1', // 后端返回：'1' :短信验证; '2' :密码支付
          payId: '', // 后端返回的 预订单ID
          dirIntegralSwitch: false, // 支付方式为 积分类型，发给后端字段
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
        errorBulletDialog: false, // 是否显示错误弹窗
        isShowKeyboard: false, // 是否显示 键盘页面
        redirectUrl: `${GlobalProperty.apiDomain.doooly}cardBuyPayResult`, // 支付宝h5支付完成的回调地址
        tradeType: 'DOOOLY_JS', // 设置交易类型
      };
    },
    created() {
      // 初始化获取用户订单付款信息
      this.getPayContentByUserId();
    },
    mounted() {},
    methods: {
      // 支付宝支付跳转接口
      apliyPayOrder(data) {
        dooolyAPP.APPpay(data, "pay_callBack", 'zfb')
      },
      wechatPayOrder(data) {

      },
      // 微信支付跳转接口
      /**
       * 积分支付： 输入手机验证/密码之后 点击确认按钮
       * 1. 输入码 验证 是否正确
       * 2. 根据返回的数据 是支付混合 还是 微信混合 在各自调用 方式
       * */
      async handleConfirmOrderPay(code) {
        const orderPayObj = {
          payId: this.defaultOptions.payId,
          payPassword: code,
          dirIntegralSwitch: this.defaultOptions.supportOrientIntergral ? '1' : '0',
          orderNum: 'N1554805648919509173',
          userId: 88441358,
        }
        const res = await Ajax.post(Api.integralPay, orderPayObj);
        console.log(res);
        if (res.code) {
          console.log(res.code);
        } else {
          MintUI.Toast.open({
            message: res.msg,
          });
        }
      },
      /**
       * 点击确定付款
       * 
       * */
      handleConfirmPay() {
        this.doThingsByBrowserName(); // 判断交易类型 tradeType:类型
        // 后段返回 payType == 1： 微信支付
        // payType == 6； 支付宝支付
        if (!this.selectedPayList.length) return false;
        // 若 已选中的支付列表中 有积分支付方式 则打开键盘页 验证短信
        const intergralList = this.selectedPayList.filter(payItem => payItem.id < 3);
        // 若是积分支付:   则 dirIntegralSwitch  = true;
        if (intergralList && intergralList.length) {
          this.defaultOptions.dirIntegralSwitch = true;
          this.confirmOrder();
          // 键盘弹出 避免手机短信重复验证 倒计时计数
          this.isShowKeyboard = true;
          this.$refs.keybordItem.handleCountdownNum();
        } else if (!this.defaultOptions.dirIntegralSwitch &&
          (this.selectedPayList.filter(payItem => payItem.name === 'wechat')).length) {
          // 微信支付
          console.log('微信支付了');
        } else if (!this.defaultOptions.dirIntegralSwitch &&
          (this.selectedPayList.filter(payItem => payItem.name === 'alipay')).length) {
          // 支付宝支付
          console.log('支付宝支付了');
        }
        // 若选择 微信，支付宝 则调用 第三方付款
      },
      /**
       * 点击确认支付按钮，先去 查询订单是否有效
       * 
       * */
      async confirmOrder() {
        const formObj = {
          orderNum: 'N1554797821350508343',
          userId: 88441358,
          payId: this.defaultOptions.payId,
          dirIntegralSwitch: this.defaultOptions.dirIntegralSwitch ? '1' : '0',
          tradeType: this.tradeType,
          payType: 0, // 0积分支付 1微信支付 2积分微信混合支付 6 支付宝
          redirectUrl: this.redirectUrl,
        }
        const res = await Ajax.post(Api.getPayForm, formObj)
        if (res.code === 1000) {
          console.log(res.data)
        } else {
          // 订单 无效 则返回数据 做弹窗 提示 信息
          // alert(res.msg);
          MintUI.Toast.open({
            message: res.msg,
          });
        }
      },
      /**
       * 根据用户的信息 获取付款页面的内容
       * 并且根据 返回的paymethods 的值 判断付款列表
       * */
      async getPayContentByUserId() {
        const res = await Ajax.post(Api.unifiedorder, {
          orderNum: 'N1554805648919509173',
          userId: 88441358,
        })
        if (res.code === 1000) {
          const data = JSON.parse(JSON.stringify(res.data));
          // 初始化订单信息值
          this.defaultOptions = {
            needPayAmount: Number(data.totalFree),
            realPayAmount: Number(data.totalFree),
            serviceCharge: Number(data.serviceCharge),
            orientIntergral: Number(data.dirIntegral),
            dooolyIntergral: Number(data.userIntegral),
            supportOrientIntergral: true,
            supportHybrid: true, // 默认可以
            supportDooolyIntergral: true,
            supportWechat: true,
            supportAlipay: true,
            payId: data.payId,
            isPayPassword: data.isPayPassword,
          }
          this.supportPayType(data.payMethod);
          // 初始化 支付方式列表
          this.initUseAblePayList();
          // 初始化 用户默认支付方式
          this.initDefaultPayType();
        }
      },
      //根据 返回的paymethods 的值 判断付款列表
      supportPayType(payMethod) {
        const arr = payMethod.split(",");
        arr.forEach(item => {
          if (item === 0 || item === 2 || item === 11) {
            this.defaultOptions.supportDooolyIntergral = true;
          } else if (item === 1 || item === 2) {
            this.defaultOptions.supportWechat = true;
          } else if (item === 6 || item === 11) {
            this.defaultOptions.supportAlipay = true;
          }
        });
      },
      /**
       * 判断当前 浏览器内核；然后根据不同的内核 做些事情： 
       * 1.tradeType类型，返回给后端的字段 【DOOOLY_APP，DOOOLY_JS,WISCO_APP,WISCO_JS其中之一】
       * 确认用户订单信息 是否有效
       * */
      doThingsByBrowserName() {
        const browser = GlobalProperty.browserName; // Mobile Safari
        if (browser === 'WeChat') {
          this.tradeType = 'DOOOLY_JS'; // 微信平台
        } else if (browser == 'WebKit' || browser == 'Chrome WebView') {
          this.tradeType = 'DOOOLY_APP'; // 兜礼 app
        } else if (browser == 'otherAPPAndroid' || browser == 'otherAPPIos') {
          this.tradeType = 'WISCO_APP'; // 其他第三方app
        } else {
          this.tradeType = 'DOOOLY_JS'; // 默认
        }
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
            imgSrc: require('@/assets/images/checkout-counter/icon_dooly.png'),
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

        if (this.result.orientIntergralFlag) {
          // 选中定向积分支付及修改需支付金额
          orientIntergralSelected = true
          orientIntergralPayAmount = this.result.orientIntergralPayAmount
        }
        if (this.result.dooolyIntergralFlag) {
          // 选中兜礼积分支付及修改需支付金额
          dooolyIntergralSelected = true
          dooolyIntergralPayAmount = this.result.dooolyIntergralPayAmount
        }
        this.useAblePayList.map(payType => {
          if (payType.name == 'orientIntergral') {
            payType.selected = orientIntergralSelected
            // payType.payAmount = orientIntergralPayAmount
          }
        })
        this.useAblePayList.map(payType => {
          if (payType.name == 'dooolyIntergral') {
            payType.selected = dooolyIntergralSelected
            // payType.payAmount = dooolyIntergralPayAmount
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
        // 暂且只有一种情况：不支持混合支付 && 定向积分+兜礼积分 < 实际金额 && 是选中状态;则为 禁用状态；
        let usable = true
        let intergralArr = ['orientIntergral', 'dooolyIntergral']
        if (!this.defaultOptions.supportHybrid &&
          ((this.defaultOptions.orientIntergral + this.defaultOptions.dooolyIntergral) <
            (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) &&
          this.useAblePayList.filter(payItem => intergralArr.includes(payItem.name) && payItem.selected).length == 0
        ) {
          usable = false
        }
        this.useAblePayList.map((payItem) => {
          // 定向积分 判断是否禁用：定向积分数 =0 就禁用
          if (payItem.name === 'orientIntergral') {
            if (this.defaultOptions.orientIntergral === 0) {
              payItem.usable = false;
            } else {
              payItem.usable = usable;
            }
          }
          // 兜礼积分 判断是否禁用: 兜礼数值 =0 或 定向积分数值 > 付款实际金额
          if (payItem.name === 'dooolyIntergral') {
            if (this.defaultOptions.dooolyIntergral == 0 || this.defaultOptions.orientIntergral >= this
              .defaultOptions.needPayAmount) {
              payItem.usable = false;
            } else {
              payItem.usable = usable;
            }
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
        // 定项积分足够支付时 不计算手续费
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
        // debugger
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
      handleChoosePay(item) {
        console.log(item);
        let orientIntergralItem, dooolyIntergralItem, wechatItem, alipayItem,
          orientIntergralPayAmount, dooolyIntergralPayAmount

        orientIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'orientIntergral')
        dooolyIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'dooolyIntergral')
        // debugger
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
            // 单项积分足够的情况下再选现金支付，直接切换为现金支付
            if (orientIntergralPayAmount >= this.defaultOptions.needPayAmount ||
              dooolyIntergralPayAmount >= (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
              this.useAblePayList.map(payItem => {
                if (!cashTypeArr.includes(payItem.name)) {
                  payItem.selected = false
                  payItem.payAmount = 0
                }
              })
            }
            // 定向积分+兜礼积分组合够的情况下，选择现金支付，默认取消兜礼，使用定向+现金 
            else if ((orientIntergralPayAmount + dooolyIntergralPayAmount) >= (this.defaultOptions.needPayAmount + this
                .defaultOptions.serviceCharge)) {
              this.useAblePayList.map(payItem => {
                if (payItem.name == 'dooolyIntergral') {
                  payItem.selected = false
                  // payItem.payAmount = 0 ;// 兜礼积分 不为0
                }
              })
            }
            // // 定向积分+兜礼积分组合 不够的情况下，选择现金支付，使用定向+ 兜礼+ 现金 
            // else if ((orientIntergralPayAmount + dooolyIntergralPayAmount) < (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)){
            // }
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
        this.initDefaultPayType(optionsClone)
      },
      // 关闭 键盘页面
      handleCloseKeyboard(v) {
        this.isShowKeyboard = v;
      },

      /**
       * 定向积分定义解释
       * 
       * */
      handleWhatOrientIntergral() {
        MintUI.MessageBox.open({
          title: '什么是定向积分？',
          message: '定向积分是只能在兜礼固定商品分类、固定商户才能消费的特殊积分，它是企业对员工的另一种特殊关怀。当该商品支持定向积分时，可用余额默认勾选，你可以选择使用或者不使用。当该商品不支持定向积分时，可用余额显示不可用。',
          showCancelButton: false,
        })
      },
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
  }
</style>