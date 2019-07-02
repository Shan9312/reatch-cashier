<template>
  <div>
    <div class="pay-warpper" v-if="usablePayList.length">
      <div class="content">
        需支付:
        <!-- 日常的商品手续费 -->
        <span v-if="defaultOptions.serviceCharge">
          <span
            class="amount"
          >{{isShowChargePay?(defaultOptions.needPayAmount + defaultOptions.serviceCharge): defaultOptions.needPayAmount | fixedNum }}</span>
          <label class="charge-text" v-show="isShowChargePay && defaultOptions.serviceCharge>0">
            （含手续费：
            <span class="charge">{{defaultOptions.serviceCharge | fixedNum }}</span>）
          </label>
        </span>
        <!-- 特殊企业/商品的 手续费3% -->
        <span v-else>
          <span class="amount" v-if="!isShowChargePay">{{ defaultOptions.needPayAmount | fixedNum }}</span>
          <span
            class="amount"
            v-else
          >{{ (defaultOptions.needPayAmount + realServiceCharge) | fixedNum }}</span>
          <span class="charge-text" v-show="realServiceCharge>0 && isShowChargePay ">
            （含手续费：
            <span class="charge">{{realServiceCharge | fixedNum }}</span>）
          </span>
        </span>
      </div>
      <div>
        <!-- 定向积分 -->
        <div class="pay-type" v-for="item in usablePayList" :key="item.id">
          <div class="line" v-if="item.id === 1">
            <div class="center direct">
              <span class="fl direct-left names">
                {{item.text}}
                <img
                  class="direct-pic"
                  @click="handleWhatOrientIntergral"
                  src="@/assets/images/checkout-counter/icon_why.png"
                  alt="定向积分疑问"
                />
              </span>
              <span class="fr direct-available">
                可抵扣余额:
                <label>{{item.payAmount ? Number(item.payAmount).toFixed(2) : '余额不可用' }}</label>
              </span>
            </div>
            <!-- 支付选择状态 组件 -->
            <checkout-btn :payItem="item" @handleChoosePay="handleChoosePay"></checkout-btn>
          </div>
        </div>
        <!-- 兜礼付款方式提醒 -->
        <div class="pay-title">
          兜礼方式
          <span>（使用该支付，商户将不向个人开具发票）</span>
        </div>
        <!--/兜礼/微信/支付宝-->
        <div class="pay-type">
          <section v-for="item in usablePayList" :key="item.id">
            <div class="line" v-if="item.id !== 1">
              <img
                class="picture fl"
                :src="item.imgSrc"
                :class="{'union-right': item.name === 'unionPay'}"
              />
              <div class="center" :class="{'union-text': item.name === 'unionPay'}">
                <div class="fl">
                  <span class="type-text names">{{item.text}}</span>
                </div>
                <span class="fr available" v-if="item.id === 2">
                  可用余额：
                  <label class="point">{{item.payAmount? item.payAmount :0 | fixedNum }}</label>
                </span>
                <span class="fr available" v-if="item.selected  && item.id >2">
                  需支付：
                  <label class="point">{{item.payAmount | fixedNum }}</label>
                </span>
              </div>
              <!-- 支付选择状态 组件 -->
              <checkout-btn :payItem="item" @handleChoosePay="handleChoosePay"></checkout-btn>
            </div>
          </section>
        </div>
      </div>
      <!-- 底部确认支付按钮 -->
      <div class="footer" @click="handleConfirmPay" data-baidu-stats="兜礼收银台-确认支付">确认支付</div>
      <!-- 现金支付的弹  出框 -->
      <div class="leave-box" v-show="isShowLeaveBtn" @touchmove.prevent>
        <div class="confirm-leave">
          <p>支付尚未完成，确认要离开？</p>
          <div class="input-view">
            <div @click="handleReturnPrePage" class="leave-input-btn left">离开</div>
            <div @click="continuePay(false)" class="leave-input-btn right">继续支付</div>
          </div>
        </div>
      </div>
      <!-- 短信/密码验证 错误的弹出框 -->
      <div v-if="promptDialog" class="toast-bg" @touchmove.prevent>
        <div class="toast">
          <p>温馨提示</p>
          <div class="text">{{promptText}}</div>
          <div class="input" @click="promptDialog = false">确定</div>
        </div>
      </div>
      <!-- 键盘页面 组件-->
      <Keyboard
        ref="keybordItem"
        v-show="isShowKeyboard"
        :isPayPassword="defaultOptions.isPayPassword"
        @handleCloseKeyboard="handleCloseKeyboard"
        @handlePayOrderBtn="handlePayOrderBtn"
        @confirmOrder="confirmOrder"
      ></Keyboard>
    </div>
  </div>
</template>

<script>
import Keyboard from "@/components/Keyboard";
import CheckoutBtn from "@/components/CheckoutButton";
import { unifiedorder, getPayForm, integralPay, getPayResult } from "@/service"; // 接口调试方法
import { UtilsFunction } from "@/common/utils.js"; // 引用的数据格式处理的 函数
import { MintUI, GlobalProperty, GlobalFunction } from "@/common/global"; // 引用的封装的组件

export default {
  name: "Payment",
  components: {
    Keyboard,
    CheckoutBtn
  },
  data() {
    return {
      orderNum: this.$route.params.orderNum, // 订单号
      userId:
        localStorage.userId ||
        this.$Cookies.get("userId") ||
        UtilsFunction.getUrlParams("userId"), // 用户ID
      defaultOptions: {
        needPayAmount: 0, // 需支付金额
        realPayAmount: 0, // 实际支付金额 传入值跟需支付金额一样即可
        serviceCharge: 0, // 手续费
        orientIntergral: 0, // 定向积分
        dooolyIntergral: 0, // 兜礼积分
        supportDooolyIntergral: false, // 是否支持兜礼积分
        supportHybrid: true, // 是否支持混合支付
        supportWechat: false, // 是否支持微信支付
        supportAlipay: false, // 是否支持支付宝
        supportUnionpay: false, // 是否支付云闪付
        isPayPassword: "1", // 后端返回：'1' / '0':短信验证; '2' :密码支付
        payId: "", // 后端返回的 预订单ID
        dirIntegralSwitch: false, // 支付方式为 定向积分，发给后端字段
        commonIntegralSwitch: false, // 支付方式为 兜礼积分，发给后端字段
        productType: "" // 后端返回的 商品类型
      },
      usableOptions: {}, // 实际的支付对象列表
      result: {
        orientIntergralFlag: false, // 是否添加定向积分支付
        dooolyIntergralFlag: false, // 是否添加兜礼积分支付
        orientIntergralPayAmount: 0, // 定向积分需要支付的金额
        dooolyIntergralPayAmount: 0 // 兜礼积分需要支付的金额
      },
      isShowChargePay: false, // 是否显示手续费
      usablePayList: [], // 支付种类的列表; 如 定积分/兜礼/微信/支付宝 等等
      isShowKeyboard: false, // 是否显示 键盘页面
      redirectUrl: `${GlobalProperty.frontendDomain.cashier}cardBuyPayResult/`, // 支付成功页面；从接口取得返回地址，接口有值给后台就传接口的值
      responseRedirectUrl: false, // 判断 unifiedorder接口获取的地址是否有
      tradeType: "DOOOLY_JS", // 设置交易类型 默认 DOOOLY_JS
      payType: 0, // 设置付款类型
      meituanObj: {}, // 美团支付信息
      isShowLeaveBtn: false,
      browserName: GlobalProperty.browserName, // 浏览器名称
      promptText: "", // 温馨提示标题
      promptDialog: false, // 温馨提示框
      realServiceCharge: 0, // 实际需要支付的手续费
      isHandleConfirm: false, // 确定用户再次选支付列表
      stashArr: [], // 临时存储上一次支付列表
      isShowMsg: false // 若商品无是否方式提醒
    };
  },
  filters: {
    fixedNum(num) {
      if (!num) return 0;
      return Number(num).toFixed(2);
    }
  },
  computed: {
    // 集中获取 被选中的支付列表
    selectedPayList() {
      return this.usablePayList.filter(payItem => payItem.selected);
    }
  },
  created() {
    let userAgent = window.navigator.userAgent;
    let isICBC = /ICBC/.test(userAgent);
    if (isICBC) {
      window.location.replace(
        `${GlobalProperty.frontendDomain.ICBCCashier}?orderNum=${this.orderNum}`
      );
      return;
    }

    // 美团进入收银台, 获取美团地址中信息
    this.handleThirdJudge();
    // 获取用户 订单信息
    this.getPayContentByUserId();
    const _this = this;
    // 付款成功后返回的值
    window.pay_callBack = async function() {
      const res = await getPayResult(_this.orderNum);
      if (res.code === 1000 || res.code === 1001) {
        // 根据支付环境 跳转到不同的页面
        if (res.data && res.data.redirectUrl) {
          // 接口有值，直接跳接口的
          dooolyAPP.gotoJumpJq(_this.$router, res.data.redirectUrl);
        } else if (_this.handleThirdJudge()) {
          // 若有美团接口 之间跳转美团
          dooolyApp.gotoJumpJq(_this.$router, _this.meituanObj.return_url);
        } else if (_this.defaultOptions.productType == 7) {
          // 活动页面
          const {
            code,
            totalAmount,
            orderId,
            orderNum,
            activityParam
          } = res.data;
          dooolyAPP.gotoJumpJq(
            _this.$router,
            `${GlobalProperty.frontendDomain.m}activity_cardBuyPayResult/${code}/${totalAmount}/${orderId}/${orderNum}/${activityParam}/${_this.defaultOptions.productType}`
          );
        } else {
          // 支付结果页面
          dooolyAPP.gotoJumpVue(
            _this.$router,
            `/cardBuyPayResult/${_this.orderNum}`
          );
        }
      } else {
        MintUI.Toast.open({
          message: res.msg
        });
      }
    };
    window.altNoticeAndriod = function() {
      _this.handleCloseKeyboard(false);
      if (
        _this.browserName == "Chrome WebView" ||
        _this.browserName == "otherAPPAndroid"
      ) {
        RHNativeJS.visablePtrFrame("false");
        HNativeJS.setTopDialog("true");
      }
    };
    window.altNotice = function() {
      if (_this.browserName == "WebKit" || _this.browserName == "otherAPPIos") {
        window.webkit.messageHandlers.hideNavgationBar.postMessage("1");
      }
      _this.handleCloseKeyboard(false);
    };
    window.isConfirmShow = function() {
      // 确认离开弹框
      _this.continuePay(true);
      _this.handleCloseKeyboard(false);
    };
    dooolyAPP.initTitle("订单支付", "2", "isConfirmShow()");
  },
  mounted() {},
  methods: {
    /**
     * 根据用户的信息 获取付款页面的内容
     * 并且根据 返回的paymethods 的值 判断付款列表
     * */
    async getPayContentByUserId() {
      const res = await unifiedorder(
        this.orderNum,
        this.userId,
        this.redirectUrl
      );
      if (res.code === 1000) {
        const data = res.data;
        this.stashArr = [];
        // 初始化订单信息值
        this.defaultOptions = {
          needPayAmount: UtilsFunction.converNumber(data.totalFree),
          realPayAmount: UtilsFunction.converNumber(data.totalFree),
          serviceCharge: UtilsFunction.converNumber(data.serviceCharge),
          orientIntergral: UtilsFunction.converNumber(data.dirIntegral),
          dooolyIntergral: UtilsFunction.converNumber(data.userIntegral),
          payId: data.payId,
          isPayPassword: data.isPayPassword,
          productType: data.productType,
          supportOrientIntergral: false,
          supportHybrid: true,
          supportDooolyIntergral: false,
          supportWechat: false,
          supportAlipay: false,
          supportUnionpay: false,
          dirIntegralSwitch: false,
          commonIntegralSwitch: false,
          supportPayType: data.supportPayType,
          orientServiceCharge: UtilsFunction.converNumber(data.serviceCharge)
            ? UtilsFunction.converNumber(data.serviceCharge)
            : UtilsFunction.converNumber(data.dirIntegralServiceCharge), // 定向积分足够 服务费
          dooolyServiceCharge: UtilsFunction.converNumber(data.serviceCharge)
            ? UtilsFunction.converNumber(data.serviceCharge)
            : UtilsFunction.converNumber(data.commonIntegralServiceCharge), // 兜里积分足够的 服务费
          totalServiceCharge: UtilsFunction.converNumber(data.serviceCharge)
            ? UtilsFunction.converNumber(data.serviceCharge)
            : UtilsFunction.converNumber(data.totalServiceCharge)
        };

        // 特殊情况：判断 不支持混合的公司 测试环境 欧飞 正式环境 是 兜礼
        if (data.company === "兜礼" || data.company === "欧·飞") {
          this.defaultOptions.supportHybrid = false;
        }
        // 若后端有返回 redirect地址 就用后端返回的
        if (data && data.redirectUrl) {
          this.redirectUrl = data.redirectUrl;
          this.responseRedirectUrl = true;
        }
        this.supportPayType(data.payMethod);
      } else {
        if (res.msg) {
          MintUI.Toast.open({
            message: res.msg
          });
        } else {
          MintUI.Toast.open({
            message: "数据获取失败"
          });
        }
      }
    },
    /**
     * 根据 返回的paymethods 的值 判断付款列表
     *
     * */
    supportPayType(payMethod) {
      let arr = [];
      arr = payMethod.split(",");
      arr.forEach(item => {
        if (item == "0" || item == 2 || item == 11) {
          // 兜礼列表
          this.defaultOptions.supportDooolyIntergral = true;
        } else if (item == 1 || item == 2) {
          // 微信列表
          this.defaultOptions.supportWechat = true;
        } else if (item == 6 || item == 11) {
          // 支付宝列表
          this.defaultOptions.supportAlipay = true;
        } else if (item == 3) {
          this.defaultOptions.supportOrientIntergral = true;
        } else if (item == 14) {
          this.defaultOptions.supportUnionpay = true;
        }
      });
      if (!this.defaultOptions.supportOrientIntergral) {
        this.defaultOptions.orientIntergral = 0;
        this.defaultOptions.orientServiceCharge = 0;
      }
      if (!this.defaultOptions.supportDooolyIntergral) {
        this.defaultOptions.dooolyIntergral = 0;
        this.defaultOptions.dooolyServiceCharge = 0;
      }
      // 若不支持现金支付 则禁止混合支付的功能
      // 暂时默认只要有 云闪付 就不支持混合
      if (
        (!this.defaultOptions.supportWechat &&
          !this.defaultOptions.supportAlipay) ||
        this.defaultOptions.supportUnionpay
      ) {
        this.defaultOptions.supportHybrid = false;
      }

      // 初始化 支付方式列表
      this.initUseAblePayList();
      // 初始化 用户默认支付方式
      this.initDefaultPayType();
    },
    /**
     * 初始化可使用的 支付方式列表；
     *
     * */
    initUseAblePayList() {
      this.usablePayList = [];
      // 定向积分：不管任何情况都会显示，通过积分是否大于0来判断是否可用
      if (this.defaultOptions.supportOrientIntergral) {
        this.usablePayList.push({
          text: "定向积分",
          name: "orientIntergral",
          usable: this.defaultOptions.orientIntergral > 0,
          payAmount: this.defaultOptions.orientIntergral,
          selected: false,
          imgSrc: "",
          id: 1
        });
      }
      // 兜礼积分：后台可配置是否显示，通过积分是否大于0来判断是否可用
      if (this.defaultOptions.supportDooolyIntergral) {
        this.usablePayList.push({
          text: "兜礼积分",
          name: "dooolyIntergral",
          usable: this.defaultOptions.dooolyIntergral > 0,
          payAmount: this.defaultOptions.dooolyIntergral,
          selected: false,
          imgSrc: require("@/assets/images/checkout-counter/icon_doooly.png"),
          id: 2
        });
      }
      // 微信支付：后台可配置是否显示
      if (this.defaultOptions.supportWechat) {
        this.usablePayList.push({
          text: "微信支付",
          name: "wechat",
          usable: true,
          payAmount: 0,
          selected: false,
          imgSrc: require("@/assets/images/checkout-counter/icon_wechat.png"),
          id: 3
        });
      }
      // 支付宝：后台可配置是否显示
      // 若是微信环境 则无支付宝列表线上
      if (this.defaultOptions.supportAlipay && this.browserName !== "WeChat") {
        this.usablePayList.push({
          text: "支付宝支付",
          name: "alipay",
          usable: true,
          payAmount: 0,
          selected: false,
          imgSrc: require("@/assets/images/checkout-counter/icon_alipay.png"),
          id: 4
        });
      }
      // 云闪付：后台可配置是否显示
      //  默认 微信环境支持云闪付
      if (this.defaultOptions.supportUnionpay) {
        this.usablePayList.push({
          text: "",
          name: "unionPay",
          usable: true,
          payAmount: 0,
          selected: false,
          imgSrc: require("@/assets/images/checkout-counter/icon_cloud_unionPay.png"),
          id: 5
        });
      }

      if (!this.usablePayList.length) this.isShowMsg = true;
    },
    /**
     * 初始化 推荐 用户默认使用的支付方式
     *
     * */
    initDefaultPayType(options) {
      this.usableOptions =
        options || JSON.parse(JSON.stringify(this.defaultOptions));
      this.calcDisabledPayType(); // 判断计算禁用使用支付情况
      this.calaNeedServiceCharge(); // 判断计算需要手续费情况
      this.orientIntergralPayType(); // 初始化使用支付方式 以及实际支付积分数 或 金额数
      let [
        orientIntergralSelected,
        dooolyIntergralSelected,
        orientIntergralPayAmount,
        dooolyIntergralPayAmount
      ] = [false, false, 0, 0];
      if (this.result.orientIntergralFlag) {
        // 选中定向积分支付及修改需支付金额
        orientIntergralSelected = true;
        orientIntergralPayAmount = this.result.orientIntergralPayAmount;
      }
      if (this.result.dooolyIntergralFlag) {
        // 选中兜礼积分支付及修改需支付金额
        dooolyIntergralSelected = true;
        dooolyIntergralPayAmount = this.result.dooolyIntergralPayAmount;
      }
      this.usablePayList.map(payType => {
        if (payType.name == "orientIntergral") {
          payType.selected = orientIntergralSelected;
        }
        if (payType.name == "dooolyIntergral") {
          payType.selected = dooolyIntergralSelected;
        }
      });
      // 重置判断
      this.result = {
        orientIntergralFlag: false,
        dooolyIntergralFlag: false,
        orientIntergralPayAmount: 0,
        dooolyIntergralPayAmount: 0
      };
    },
    /**
     * 判断哪些情况会 被禁止使用
     *
     * */
    calcDisabledPayType() {
      let [orientUsable, dooolyUsable] = [true, true];
      let intergralArr = ["orientIntergral", "dooolyIntergral"];
      if (!this.defaultOptions.supportHybrid) {
        let {
          orientIntergral,
          dooolyIntergral,
          needPayAmount,
          totalServiceCharge,
          orientServiceCharge,
          dooolyServiceCharge,
          serviceCharge
        } = this.defaultOptions;
        // 只要 2个积分组合不满足 支付 就都禁止掉
        if (
          UtilsFunction.converNumber(orientIntergral, dooolyIntergral) <
          UtilsFunction.converNumber(needPayAmount, totalServiceCharge)
        ) {
          [orientUsable, dooolyUsable] = [false, false];
        } else if (
          orientIntergral >=
            UtilsFunction.converNumber(needPayAmount, orientServiceCharge) &&
          dooolyIntergral <
            UtilsFunction.converNumber(needPayAmount, dooolyServiceCharge)
        ) {
          [orientUsable, dooolyUsable] = [true, false];
          // 定向 & 兜礼 都不满足
        } else {
          [orientUsable, dooolyUsable] = [true, true];
        }
      }
      // 积分小于0 都禁用
      this.usablePayList.map(payItem => {
        if (payItem.name === "orientIntergral") {
          payItem.usable = this.defaultOptions.orientIntergral
            ? orientUsable
            : false;
        }
        if (payItem.name === "dooolyIntergral") {
          payItem.usable = this.defaultOptions.dooolyIntergral
            ? dooolyUsable
            : false;
        }
      });
    },
    /**
     * 判断是否哪种支付方式需要 手续费
     *
     * */
    calaNeedServiceCharge() {
      this.isShowChargePay = false;
      // 不支持兜礼积分或兜礼积分为0 定项积 不计算手续费
      if (
        (!this.usableOptions.supportDooolyIntergral ||
          !this.usableOptions.dooolyIntergral) &&
        (!this.usableOptions.supportOrientIntergral ||
          !this.usableOptions.orientIntergral)
      )
        return false;
      // 定向积分 + 兜礼积分不能支付时，并且不支持混合支付时，这时会采取现金支付，不计算手续费
      if (
        UtilsFunction.converNumber(
          this.usableOptions.orientIntergral,
          this.usableOptions.dooolyIntergral
        ) <
          UtilsFunction.converNumber(
            this.usableOptions.needPayAmount,
            this.usableOptions.totalServiceCharge
          ) &&
        !this.usableOptions.supportHybrid
      )
        return false;
      this.isShowChargePay = true;
      if (this.usableOptions.serviceCharge) {
        this.usableOptions.realPayAmount =
          this.usableOptions.needPayAmount + this.usableOptions.serviceCharge;
      }
    },
    // 定向积分： 支付方式
    orientIntergralPayType() {
      // 定向积分大于0，默认一定会选中定向积分
      if (
        this.usableOptions.orientIntergral &&
        this.defaultOptions.supportOrientIntergral
      ) {
        this.result.orientIntergralFlag = true; // 选中定向积分
        // 如果定向积分足够支付 则默认只选择定向积分
        if (
          this.usableOptions.orientIntergral >=
          UtilsFunction.converNumber(
            this.usableOptions.needPayAmount,
            this.usableOptions.orientServiceCharge
          )
        ) {
          this.result.orientIntergralPayAmount =
            this.usableOptions.needPayAmount +
            this.usableOptions.orientServiceCharge;
          // 实际支付手续费 = 定向支付的手续费
          this.realServiceCharge = this.usableOptions.orientServiceCharge;
        } else {
          // 定向积分不够时需支付金额为全部定向积分
          this.result.orientIntergralPayAmount = this.usableOptions.orientIntergral;
          if (this.result.orientIntergralFlag)
            this.realServiceCharge = this.defaultOptions.orientServiceCharge;
          this.initDooolyIntergral(); // 往下判断兜礼积分支付
        }
      } else {
        this.result.orientIntergralFlag = false; // 定向积分不足时不选中
        this.initDooolyIntergral(); // 往下判断兜礼积分支付
      }
    },
    // 兜礼积分： 支付方式
    initDooolyIntergral() {
      // 判断是否支持兜礼积分支付并且余额大于0 如果大于0则一定会默认选中兜礼积分
      if (
        this.usableOptions.supportDooolyIntergral &&
        this.usableOptions.dooolyIntergral
      ) {
        this.result.dooolyIntergralFlag = true;
        // 兜礼实际支付
        this.result.dooolyIntergralPayAmount =
          this.usableOptions.needPayAmount +
          this.usableOptions.dooolyServiceCharge;
        // 如果 当选中定向 且 兜礼积分 大于 实际兜礼支付
        if (
          this.usableOptions.dooolyIntergral >=
            this.result.dooolyIntergralPayAmount &&
          this.result.orientIntergralFlag
        ) {
          //  实际总支付手续费 = 定向手续费+ 兜礼手续费
          this.realServiceCharge = this.usableOptions.totalServiceCharge;
          this.result.dooolyIntergralPayAmount =
            this.usableOptions.realPayAmount -
            this.result.orientIntergralPayAmount;
        } // 如果当 定向积分没选中 兜里积分足够的情况
        else if (
          this.usableOptions.dooolyIntergral >=
            this.result.dooolyIntergralPayAmount &&
          !this.result.orientIntergralFlag
        ) {
          this.realServiceCharge = this.usableOptions.dooolyServiceCharge;
          // 如果当 2个积分都选中 且 组合满足支付
        } else if (
          UtilsFunction.converNumber(
            this.usableOptions.orientIntergral,
            this.usableOptions.dooolyIntergral
          ) >=
            UtilsFunction.converNumber(
              this.usableOptions.needPayAmount,
              this.usableOptions.totalServiceCharge
            ) &&
          this.result.orientIntergralFlag
        ) {
          this.result.dooolyIntergralPayAmount =
            this.usableOptions.realPayAmount -
            this.usableOptions.orientIntergral -
            this.usableOptions.orientServiceCharge;
          this.realServiceCharge = this.usableOptions.totalServiceCharge;
        } else {
          //如果 兜礼积分不够的情况下
          this.result.dooolyIntergralPayAmount = this.usableOptions.dooolyIntergral;
          if (this.result.orientIntergralFlag) {
            this.realServiceCharge = this.usableOptions.totalServiceCharge;
          } else {
            this.realServiceCharge = this.usableOptions.dooolyServiceCharge;
          }
          this.initHybrid(); //往下判断混合支付
        }
      } else {
        this.result.dooolyIntergralFlag = false; // 不支持兜礼积分支付时不选中
        if (!this.result.orientIntergralFlag) this.realServiceCharge = 0;
        this.initHybrid();
      }
    },
    // 混合支付方式
    initHybrid() {
      // 定向积分+兜礼积分<需支付总金额并且不支持混合支付时，不选中定向积分及兜礼积分
      if (!this.usableOptions.supportHybrid) {
        this.result.orientIntergralFlag = false;
        this.result.dooolyIntergralFlag = false;
      }
      this.initWechat();
    },
    // 微信： 支付方式
    initWechat() {
      if (this.usableOptions.supportWechat) {
        let wechatPayAmount = 0;
        if (this.defaultOptions.serviceCharge) {
          this.realServiceCharge = 0;
        }
        if (this.usableOptions.supportHybrid) {
          wechatPayAmount =
            this.usableOptions.realPayAmount +
            this.realServiceCharge -
            this.result.orientIntergralPayAmount -
            this.result.dooolyIntergralPayAmount;
        } else {
          wechatPayAmount = this.usableOptions.realPayAmount;
        }
        // 选中微信支付及修改需支付金额
        this.usablePayList.map(payType => {
          if (payType.name == "wechat") {
            payType.selected = true;
            payType.payAmount = wechatPayAmount;
          }
        });
      } else {
        this.initAlipay();
      }
    },
    // 支付宝： 支付方式
    initAlipay() {
      // 判断是否支持支付宝支付
      if (this.usableOptions.supportAlipay) {
        let alipayPayAmount = 0;
        if (this.defaultOptions.serviceCharge) {
          this.realServiceCharge = 0;
        }
        if (this.usableOptions.supportHybrid) {
          alipayPayAmount =
            this.usableOptions.realPayAmount +
            this.realServiceCharge -
            this.result.orientIntergralPayAmount -
            this.result.dooolyIntergralPayAmount;
        } else {
          alipayPayAmount = this.usableOptions.realPayAmount;
        }
        // 选中支付宝支付及修改需支付金额
        this.usablePayList.map(payType => {
          if (payType.name == "alipay") {
            payType.selected = true;
            payType.payAmount = alipayPayAmount;
          }
        });
      } else {
        this.initUnionPay();
      }
    },
    // 云闪付： 支付方式
    initUnionPay() {
      // 判断是否支持支付宝支付
      if (this.usableOptions.supportUnionpay) {
        let applePayAmount = 0;
        if (this.defaultOptions.serviceCharge) {
          this.realServiceCharge = 0;
        }
        if (this.usableOptions.supportHybrid) {
          applePayAmount =
            this.usableOptions.realPayAmount +
            this.realServiceCharge -
            this.result.orientIntergralPayAmount -
            this.result.dooolyIntergralPayAmount;
        } else {
          applePayAmount = this.usableOptions.realPayAmount;
        }
        // 选中支付宝支付及修改需支付金额
        this.usablePayList.map(payType => {
          if (payType.name == "unionPay") {
            payType.selected = true;
            payType.payAmount = applePayAmount;
          }
        });
      } else {
        throw Error("error");
      }
    },
    /**
     * 点击切换支付方式
     *
     * */
    handleChoosePay(item) {
      let orientIntergralItem,
        dooolyIntergralItem,
        wechatItem,
        alipayItem,
        orientIntergralPayAmount,
        dooolyIntergralPayAmount,
        applePayItem;
      let {
        orientIntergral,
        dooolyIntergral,
        needPayAmount,
        totalServiceCharge,
        orientServiceCharge,
        dooolyServiceCharge
      } = this.defaultOptions;

      orientIntergralItem = this.selectedPayList.filter(
        payItem => payItem.name == "orientIntergral"
      );
      dooolyIntergralItem = this.selectedPayList.filter(
        payItem => payItem.name == "dooolyIntergral"
      );

      if (orientIntergralItem.length > 0) {
        orientIntergralPayAmount = orientIntergralItem[0].payAmount;
      }
      if (dooolyIntergralItem.length > 0) {
        dooolyIntergralPayAmount = dooolyIntergralItem[0].payAmount;
      }
      // 当前支付方式不可用则直接返回
      if (!item.usable) return false;
      // 当前只选中一种支付方式的情况下不允许取消选中
      if (
        this.selectedPayList.length == 1 &&
        this.selectedPayList[0].name == item.name &&
        item.selected
      ) {
        return false;
      }
      let cashTypeArr = ["wechat", "alipay", "unionPay"]; //现金支付类型
      // 不可取消微信支付及支付宝支付
      if (item.selected && cashTypeArr.includes(item.name)) return false;
      // 定向积分+兜礼积分点击 取消时
      if (item.selected && !cashTypeArr.includes(item.name)) {
        // 单项积分足够时，可以取消另一项
        if (
          (orientIntergral >=
            UtilsFunction.converNumber(needPayAmount, orientServiceCharge) &&
            item.name == "dooolyIntergral") ||
          (dooolyIntergral >=
            UtilsFunction.converNumber(needPayAmount, dooolyServiceCharge) &&
            item.name == "orientIntergral")
        ) {
          // 单项积分足够时，可以取消另一项
          this.usablePayList.filter(
            payItem => payItem.id === item.id
          ).selected = false;
        } else {
          if (!this.defaultOptions.supportHybrid) {
            // 不支持混合支付，并且单项积分不够支付时 不允许取消其中一项
            return false;
          } else {
            let cashArr = [];
            this.usablePayList.map(child => {
              if (child.id >= 3) cashArr.push(child.id);
            });
            // 开启微信支付 或者 支付宝支付 或者 云闪付
            // 如果选中的列表中包括现金支付，则让现金支付选中。否则 默认让现金的第一个选中;
            if (cashArr.length) {
              let isChooseCash = false;
              this.selectedPayList.map(payItem => {
                if (
                  cashTypeArr.includes(payItem.name) &&
                  cashArr.includes(payItem.id)
                ) {
                  payItem.selected = true;
                  isChooseCash = true;
                }
              });
              if (!isChooseCash) {
                this.usablePayList.map(child => {
                  if (child.id == cashArr[0]) child.selected = true;
                });
              }
            } else {
              return false;
            }
          }
        }
      }

      // 微信选中时点击支付宝则切换到支付宝并取消微信选中，反之一样
      if (cashTypeArr.includes(item.name) && !item.selected) {
        let cashItem = this.selectedPayList.filter(payItem =>
          cashTypeArr.includes(payItem.name)
        );
        // 当我已经选中微信/支付宝时，这个时候为切换现金支付方式
        if (cashItem.length > 0) {
          let payAmount = cashItem[0].payAmount;
          this.usablePayList.map(payItem => {
            if (payItem.name == item.name) {
              payItem.selected = true;
              payItem.payAmount = payAmount;
            }
            if (
              cashTypeArr.includes(payItem.name) &&
              payItem.name != item.name
            ) {
              payItem.selected = false;
              payItem.payAmount = 0;
            }
          });
          return false;
        }
        if (this.defaultOptions.supportHybrid) {
          // 定向积分+兜礼积分组合够的情况下，选择现金支付，默认取消兜礼，使用定向+现金
          if (
            orientIntergralPayAmount + dooolyIntergralPayAmount >=
            UtilsFunction.converNumber(needPayAmount, totalServiceCharge)
          ) {
            this.usablePayList.map(payItem => {
              if (payItem.name == "dooolyIntergral") {
                payItem.selected = false;
                payItem.payAmount = 0;
              }
            });
          }
          // 定向 或者 兜里 单个积分大于需要付款时, 清除当前的积分值
          if (
            dooolyIntergralPayAmount >=
              UtilsFunction.converNumber(needPayAmount, totalServiceCharge) ||
            dooolyIntergralPayAmount >=
              UtilsFunction.converNumber(needPayAmount, dooolyServiceCharge)
          ) {
            this.usablePayList.map(payItem => {
              if (payItem.name == "dooolyIntergral") {
                payItem.selected = false;
                payItem.payAmount = 0;
              }
            });
          }
          if (
            orientIntergralPayAmount >=
            UtilsFunction.converNumber(orientServiceCharge, needPayAmount)
          ) {
            this.usablePayList.map(payItem => {
              if (payItem.name == "orientIntergral") {
                payItem.selected = false;
                payItem.payAmount = 0;
              }
            });
          }
        } else {
          // 不支持混合支付 直接切换为现金支付
          this.usablePayList.map(payItem => {
            if (!cashTypeArr.includes(payItem.name)) {
              payItem.selected = false;
              payItem.payAmount = 0;
            }
          });
        }
      }

      // 不支持混合支付时当前选中现金支付时切换到积分支付
      if (!item.selected && !cashTypeArr.includes(item.name)) {
        // 定向积分或着兜礼积分单项满足时，可以直接选中单项
        if (
          (item.name == "orientIntergral" &&
            orientIntergral >=
              UtilsFunction.converNumber(needPayAmount, orientServiceCharge)) ||
          (item.name == "dooolyIntergral" &&
            dooolyIntergral >=
              UtilsFunction.converNumber(needPayAmount, dooolyServiceCharge))
        ) {
          if (item.name == "dooolyIntergral") {
            this.usablePayList.map(payItem => {
              if (payItem.name == "orientIntergral") {
                payItem.selected = false;
              }
            });
          }
        } else {
          //  定向+兜礼 大于 实际付款
          if (
            UtilsFunction.converNumber(orientIntergral, dooolyIntergral) >=
            UtilsFunction.converNumber(needPayAmount, totalServiceCharge)
          ) {
            if (item.name == "orientIntergral") {
              // 点击定向积分时 顺带打开兜礼积分
              this.usablePayList.map(payItem => {
                if (payItem.name == "dooolyIntergral") {
                  payItem.selected = true;
                }
              });
            } else {
              this.usablePayList.map(payItem => {
                if (payItem.name == "orientIntergral") {
                  payItem.selected = true;
                }
              });
            }
          }
        }
      }

      item.selected = !item.selected;
      // copy返回的数值
      let optionsClone = JSON.parse(JSON.stringify(this.defaultOptions));
      // 从选中的支付列表中， 判断是哪个付款方式
      orientIntergralItem = this.selectedPayList.filter(
        payItem => payItem.name == "orientIntergral"
      );
      dooolyIntergralItem = this.selectedPayList.filter(
        payItem => payItem.name == "dooolyIntergral"
      );
      wechatItem = this.selectedPayList.filter(
        payItem => payItem.name == "wechat"
      );
      alipayItem = this.selectedPayList.filter(
        payItem => payItem.name == "alipay"
      );
      applePayItem = this.selectedPayList.filter(
        payItem => payItem.name == "unionPay"
      );

      // 初始化 付款方式
      if (!wechatItem.length) {
        optionsClone.supportWechat = false;
      }
      if (!orientIntergralItem.length) {
        optionsClone.orientIntergral = 0;
      } else {
        // 当前选中了定向积分，&& 定向积分够付 && 兜礼积分不够付的情况 && 支持混合的情况
        //点击兜礼积分取消定向积分，选中兜礼积分，并选中微信或者支付宝
        if (
          orientIntergral >=
            UtilsFunction.converNumber(needPayAmount, orientServiceCharge) &&
          dooolyIntergral <
            UtilsFunction.converNumber(needPayAmount, dooolyServiceCharge) &&
          this.usableOptions.supportHybrid
        ) {
          this.usablePayList.map(payItem => {
            if (payItem.name === "dooolyIntergral") {
              if (item.name === payItem.name) {
                payItem.selected = true;
                optionsClone.orientIntergral = 0;
                // 并开启 现金支付 支付宝未选就开启微信
                if (!alipayItem.length) {
                  optionsClone.supportWechat = true;
                }
              }
            }
          });
        }
      }
      if (!dooolyIntergralItem.length) {
        optionsClone.dooolyIntergral = 0;
      }
      if (!alipayItem.length) {
        optionsClone.supportAlipay = false;
      }
      // 云闪付
      if (!applePayItem.length) {
        optionsClone.supportUnionpay = false;
      }
      // 初始化 支付列表
      this.initUseAblePayList();
      // 切换后的  付款方式。
      this.initDefaultPayType(optionsClone);
    },
    /**
     * 关闭 键盘页面
     *
     * */
    handleCloseKeyboard(v) {
      this.isShowKeyboard = v;
      this.isHandleConfirm = !v;
      this.$refs.keybordItem.verificationCodeArr = [];
    },
    /**
     * 定向积分定义解释
     *
     * */
    handleWhatOrientIntergral() {
      MintUI.MessageBox({
        title: "什么是定向积分？",
        message:
          "定向积分是只能在兜礼固定商品分类、固定商户才能消费的特殊积分，它是企业对员工的另一种特殊关怀。当该商品支持定向积分时，可用余额默认勾选，你可以选择使用或者不使用。当该商品不支持定向积分时，可用余额显示不可用。",
        showCancelButton: false
      });
    },
    /**
     * 点击确定付款
     *
     * */
    handleConfirmPay() {
      // 判断payType类型,选中的支付列表 并做出对应的支付情况
      this.payTypeByselectedPayList();
      // 判断交易平台的tradeType:类型
      this.tradeTypeByBrowserName();
      // 若用户是短信支付 && 更改支付列表 && 选择列表数量相等 && 列表含有积分支付 就进行短信优化判断
      if (
        this.defaultOptions.isPayPassword != 2 &&
        this.isHandleConfirm &&
        this.stashArr.length === this.selectedPayList.length &&
        this.selectedPayList.filter(payItem => payItem.id < 3).length
      ) {
        let statusType = false;
        for (let i = 0; i < this.selectedPayList.length; i++) {
          // 如果列表相等含有积分支付 && 倒计时在 60s 内，重新打开键盘页面，不重复发送 短信
          if (this.stashArr[i].id === this.selectedPayList[i].id) {
            statusType = true;
          } else {
            statusType = false;
          }
        }
        if (
          this.$refs.keybordItem.countdownNum > 0 &&
          this.$refs.keybordItem.countdownNum < 60 &&
          statusType
        ) {
          this.isShowKeyboard = true;
          return;
        } else {
          this.$refs.keybordItem.countdownNum = 60;
          this.stashArr = JSON.parse(JSON.stringify(this.selectedPayList));
        }
      } else {
        // 第一次点击确认支付时 存储用户支付列表
        this.stashArr = JSON.parse(JSON.stringify(this.selectedPayList));
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
      let integralList = this.selectedPayList.filter(payItem => payItem.id < 3);
      let cashList = this.selectedPayList.filter(payItem => payItem.id >= 3);

      this.selectedPayList.forEach(obj => {
        if (obj.name === "orientIntergral") {
          // 定向 积分支付:0
          this.payType = 3;
          this.defaultOptions.dirIntegralSwitch = true;
        } else if (obj.name === "dooolyIntergral") {
          // 兜里 积分支付:0
          this.payType = 0;
        } else if (integralList.length == 2 && !cashList.length) {
          // 只选则 兜里和定向时
          this.payType = 0;
        } else if (integralList.length && obj.name === "wechat") {
          // 微信积分混合:2
          this.payType = 2;
        } else if (integralList.length && obj.name === "alipay") {
          // 支付宝积分混合:11
          this.payType = 11;
        } else if (!integralList.length && obj.name === "wechat") {
          // 微信支付:1
          this.payType = 1;
        } else if (!integralList.length && obj.name === "alipay") {
          // 支付宝支付:6
          this.payType = 6;
        } else if (!integralList.length && obj.name === "unionPay") {
          // 云闪付
          this.payType = 14;
        }
      });
      const orientIntergralItem = this.selectedPayList.filter(
        payItem => payItem.name == "orientIntergral"
      );
      const dooolyIntergralItem = this.selectedPayList.filter(
        payItem => payItem.name == "dooolyIntergral"
      );
      if (orientIntergralItem.length && orientIntergralItem[0].selected) {
        this.defaultOptions.dirIntegralSwitch = true;
      } else {
        this.defaultOptions.dirIntegralSwitch = false;
      }
      if (dooolyIntergralItem.length && dooolyIntergralItem[0].selected) {
        this.defaultOptions.commonIntegralSwitch = true;
      } else {
        this.defaultOptions.commonIntegralSwitch = false;
      }
    },
    /**
     * 判断当前 支付平台 ；然后根据不同的类型 ：
     * 判断tradeType类型，返回给后端的字段 【DOOOLY_APP，DOOOLY_JS,WISCO_APP,WISCO_JS其中之一】
     * */
    tradeTypeByBrowserName() {
      if (this.browserName === "WeChat") {
        if (localStorage.token == localStorage.wiscoToken) {
          this.tradeType = "WISCO_JS";
        } else {
          this.tradeType = "DOOOLY_JS";
        }
      } else if (
        this.browserName == "WebKit" ||
        this.browserName == "Chrome WebView"
      ) {
        this.tradeType = "DOOOLY_APP"; // 兜礼 app
      } else if (
        this.browserName == "otherAPPAndroid" ||
        this.browserName == "otherAPPIos"
      ) {
        this.tradeType = "WISCO_APP"; // 其他第三方app
      } else if (this.payType === 1 || this.payType === 2) {
        // 含微信的支付，不在微信和app中，用微信h5调起微信
        this.tradeType = "DOOOLY_H5";
      } else {
        this.tradeType = "DOOOLY_JS"; // 默认
      }
      if (this.defaultOptions.supportPayType == 0) {
        this.tradeType = "doooly_zero";
        this.payType = 0;
      }
    },
    /**
     * 首次点击确认按钮，先去 查询订单是否有效
     *  确认订单OK后：1.判断选中的支付类型 做对于的 付款跳转
     * */
    async confirmOrder() {
      // 若改商品 无支付列表，确认支付时禁止付款
      if (!this.selectedPayList.length) {
        MintUI.Toast.open({
          message: "余额不足"
        });
        this.payType = null;
        return false;
      }
      const res = await getPayForm(
        this.orderNum,
        this.userId,
        this.redirectUrl,
        this.defaultOptions.payId,
        this.tradeType,
        this.payType,
        this.defaultOptions.commonIntegralSwitch ? "1" : "0",
        this.defaultOptions.dirIntegralSwitch ? "1" : "0"
      );
      if (this.defaultOptions.supportPayType == 0 && res.code === 1000) {
        this.handlePayOrderBtn();
        return;
      }
      if (res.code === 1000) {
        if (this.selectedPayList.filter(payItem => payItem.id < 3).length) {
          // 只要含有积分,就键盘弹出 倒计时计数
          this.isShowKeyboard = true;
          this.$refs.keybordItem.handleCountdownNum();
        } else if (this.payType === 1) {
          // 微信接口支付
          this.wechatPayOrder(res.data);
        } else if (this.payType === 6) {
          // 支付宝接口支付
          this.apliyPayOrder(res.data);
        } else if (this.payType === 14) {
          // 云闪付支付
          this.applePayOrder(res.data);
        }
      } else {
        // 订单 无效 则返回数据 做弹窗 提示 信息
        MintUI.Toast.open({
          message: res.msg
        });
      }
    },
    /**
     * 子传父组件：确认支付按钮
     * 1.根据密码/验证码 确认付款。
     * 2.根据后端返回的数据 是支付混合 还是 微信混合 在各自调用 方式
     * */
    async handlePayOrderBtn(code) {
      if (this.defaultOptions.isPayPassword === "2") {
        // 密码输入 需要加密
        code = UtilsFunction.encrypt(code);
      }
      // 若 是0元支付金额 就默认验证码 111111
      this.defaultOptions.supportPayType == 0
        ? (code = "11111")
        : (code = code);

      const res = await integralPay(
        this.orderNum,
        this.userId,
        this.defaultOptions.payId,
        code,
        this.defaultOptions.supportOrientIntergral ? "1" : "0"
      );
      this.$refs.keybordItem.verificationCodeArr = [];
      if (this.defaultOptions.supportPayType == 0 && res.code === 1000) {
        dooolyAPP.gotoJumpVue(
          this.$router,
          `/cardBuyPayResult/${this.orderNum}`
        );
        return;
      }
      if (res.code === 1000) {
        this.isShowKeyboard = false;
        if (this.payType === 2) {
          // 微信混合支付
          this.wechatPayOrder(res.data);
        } else if (this.payType === 11) {
          // 支付宝混合支付
          this.apliyPayOrder(res.data);
        } else {
          window.pay_callBack();
        }
      } else if (res.code === 1016 || res.code === 1017) {
        // 1016:手机验证码失败; 1017:验证码已过期，请重新获取
        this.promptDialog = true;
        this.promptText =
          res.code === 1016
            ? "您输入的短信验证码有误，请重新输入（5分钟内有效）！"
            : "您输入的短信验证码超时，请重新获取！";
      } else if (res.code === 1007) {
        // 密码输入错误
        MintUI.Toast.open({
          message: "支付密码错误，请重新输入"
        });
      } else {
        MintUI.Toast.open({
          message: res.msg
        });
      }
    },

    // 支付宝支付跳转接口
    apliyPayOrder(data) {
      dooolyAPP.appPay(data, "pay_callBack", "zfb");
    },
    // 微信支付跳转接口
    wechatPayOrder(data) {
      const currentBaseUrl = window.location.href.substring(
        0,
        window.location.href.indexOf("#") + 1
      );
      if (this.browserName === "WeChat") {
        // 微信 支付
        this.wechatBridgePay(data);
      } else if (this.tradeType == "DOOOLY_H5") {
        // h5支付
        let redirect_url = window.encodeURIComponent(
          `${currentBaseUrl}/cardBuyPayResultH5/${this.orderNum}/${this.defaultOptions.productType}`
        );

        if (this.handleThirdJudge()) {
          // 判断 美团h5支付，支付完成跳转页面
          redirect_url = window.encodeURIComponent(
            `${currentBaseUrl}/middle?redirect_url=${window.encodeURIComponent(
              this.meituanObj.return_url
            )}`
          );
          window.location.href = `${data.mwebUrl}&redirect_url=${redirect_url}`;
        } else {
          window.location.href = `${data.mwebUrl}&redirect_url=${redirect_url}`;
        }
      } else {
        dooolyAPP.appPay(data, "pay_callBack", "wx"); // doooly app
      }
    },

    // 云闪付支付跳转接口
    applePayOrder(data) {
      let form = data.unionPayUrl;
      let div = document.createElement("div");
      div.innerHTML = form;
      document.body.appendChild(div);
      document.all.pay_form.submit();
    },

    // 若是 微信环境 则微信接口跳转支付接口
    wechatBridgePay(data) {
      const _this = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: data.appId,
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType, // 微信签名方式:
          paySign: data.paySign // 微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            MintUI.Toast.open({
              message: "支付成功"
            });
            window.pay_callBack();
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            MintUI.Toast.open({
              message: "用户取消支付!"
            });
          } else {
            MintUI.Toast.open({
              message: "支付失败!"
            });
            window.pay_callBack();
          }
        }
      );
    },
    // 判断第三方 美团支付付款情况
    handleThirdJudge() {
      if (UtilsFunction.getUrlParams("orderSource") === "meituan") {
        // 若是美团支付 需把信息集合
        this.userId = UtilsFunction.getUrlParams("userId");
        this.redirectUrl = UtilsFunction.getUrlParams("return_url");
        this.meituanObj = {
          userId: UtilsFunction.getUrlParams("userId"),
          orderSource: UtilsFunction.getUrlParams("orderSource"),
          return_url: UtilsFunction.getUrlParams("return_url")
        };
        return true;
      }
    },

    // 微信/支付宝 点击 继续支付
    continuePay(v) {
      this.isShowLeaveBtn = v;
    },

    // 点击返回上一页
    handleReturnPrePage() {
      dooolyAPP.goBackPageIndex("1");
    }
  }
};
</script>
<style lang="less" scoped>
.pay-warpper {
  .union-text {
    width: 58% !important;
  }
  img {
    width: 100%;
    height: 100%;
  }

  .content {
    padding: 0.14rem 0.15rem 0.36rem;
    font-size: 0.16rem;
    color: #333;
    background: #fff
      url("~@/assets/images/checkout-counter/title_background.png") repeat-x 0
      bottom;
    background-size: auto 0.15rem;

    .amount {
      font-size: 0.18rem;
      color: #ee3f44;
    }

    .charge-text {
      font-size: 0.12rem;
      color: #999;

      .charge-img {
        width: 0.14rem;
        height: 0.14rem;
        position: relative;
        top: 0.02rem;
        left: -0.02rem;
      }

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
    .union-text {
      color: #ee3f44;
      font-size: 0.12rem;
    }
    .union-right {
      width: auto;
    }

    .line {
      height: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;

      .center {
        width: 78%;
        position: relative;
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
.msg-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 1999;
  p {
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 0.1rem 0.05rem;
    text-align: center;
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    border-radius: 0.05rem !important;
    width: 2.7rem !important;
    font-size: 0.15rem;
    // overflow: hidden;
  }
}
</style>