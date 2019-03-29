export default {
  name: '',
  data() {
    return {
      defaultOptions: {
        needPayAmount: 0, // 需支付金额
        realPayAmount: 0, // 实际支付金额 传入值跟需支付金额一样即可
        serviceCharge: 0, // 手续费
        orientIntergral: 0, // 定向积分
        dooolyIntergral: 0, // 兜礼积分
        supportDooolyIntergral: false, // 是否支持兜礼积分
        supportHybrid: false, // 是否支持混合支付
        supportWechat: false, // 是否支持微信支付
        supportAlipay: false // 是否支持支付宝
      },
      usableOptions: {},
      result: {
        orientIntergralFlag: false, // 是否添加定向积分支付
        dooolyIntergralFlag: false, // 是否添加兜礼积分支付
        orientIntergralPayAmount: 0, // 定向积分需要支付的金额
        dooolyIntergralPayAmount: 0 // 兜礼积分需要支付的金额
      },
      usablePayList: []
    };
  },
  computed: {
    selectedPayList() {
      return this.usablePayList.filter(payItem => payItem.selected)
    }
  },
  created() {
    // this.defaultOptions = {
    //   needPayAmount: parseInt(this.$route.query.needPayAmount),
    //   realPayAmount: parseInt(this.$route.query.realPayAmount),
    //   serviceCharge: parseInt(this.$route.query.serviceCharge),
    //   orientIntergral: parseInt(this.$route.query.orientIntergral),
    //   dooolyIntergral: parseInt(this.$route.query.dooolyIntergral),
    //   supportDooolyIntergral: this.$route.query.supportDooolyIntergral == 'true',
    //   supportHybrid: this.$route.query.supportHybrid == 'true',
    //   supportWechat: this.$route.query.supportWechat == 'true',
    //   supportAlipay: this.$route.query.supportAlipay == 'true'
    // }
    // this.initUsablePayList()
    // this.initDefaultPayType()
  },
  methods: {
    // 初始化可用支付方式列表
    initUsablePayList() {
      this.usablePayList = []
      // 定向积分不管任何情况都会显示，通过积分是否大于0来判断是否可用
      this.usablePayList.push({
        name: 'orientIntergral',
        usable: this.defaultOptions.orientIntergral > 0,
        payAmount: 0,
        selected: false
      })
      // 兜礼积分后台可配置是否显示，通过积分是否大于0来判断是否可用
      if (this.defaultOptions.supportDooolyIntergral) {
        this.usablePayList.push({
          name: 'dooolyIntergral',
          usable: this.defaultOptions.dooolyIntergral > 0,
          payAmount: 0,
          selected: false
        })
      }
      // 微信支付后台可配置是否显示
      if (this.defaultOptions.supportWechat) {
        this.usablePayList.push({
          name: 'wechat',
          usable: true,
          payAmount: 0,
          selected: false
        })
      }
      // 支付宝微信后台可配置是否显示
      if (this.defaultOptions.supportAlipay) {
        this.usablePayList.push({
          name: 'alipay',
          usable: true,
          payAmount: 0,
          selected: false
        })
      }
    },
    // 初始化默认支付方式
    initDefaultPayType(options) {
      this.usableOptions = options || JSON.parse(JSON.stringify(this.defaultOptions))

      this.calaDisabledPayType()
      this.calaNeedServiceCharge()
      this.initOrientIntergral()

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

      this.usablePayList.map(payType => {
        if (payType.name == 'orientIntergral') {
          payType.selected = orientIntergralSelected
          payType.payAmount = orientIntergralPayAmount
        }
      })
      this.usablePayList.map(payType => {
        if (payType.name == 'dooolyIntergral') {
          payType.selected = dooolyIntergralSelected
          payType.payAmount = dooolyIntergralPayAmount
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
    // 计算需要禁用哪些支付选项，目前只有一种情况，
    // 不支持混合支付并且定向积分小于支付金额，
    // 并且定向积分+兜礼积分不足够支付，
    // 并且当前选中的是现金支付
    calaDisabledPayType() {
      let orientUseable = true
      let dooolyUseable = true

      let intergralArr = ['orientIntergral', 'dooolyIntergral']
      if (!this.defaultOptions.supportHybrid) {
        if ((this.$Utils.convertToNumber(this.defaultOptions.orientIntergral) <
            this.$Utils.convertToNumber(this.defaultOptions.needPayAmount)) &&
          (this.$Utils.convertToNumber(this.defaultOptions.orientIntergral + this.defaultOptions.dooolyIntergral) <
            this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) &&
          this.usablePayList.filter(payItem => intergralArr.includes(payItem.name) && payItem.selected).length == 0
        ) {
          orientUseable = false
          dooolyUseable = false
        } else {
          // 一个够一个不够的情况
          if ((this.$Utils.convertToNumber(this.defaultOptions.orientIntergral) <
              this.$Utils.convertToNumber(this.defaultOptions.needPayAmount)) && (this.$Utils.convertToNumber(this.defaultOptions.dooolyIntergral) >=
              this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge))) {
            // a<c b>=c
            orientUseable = false
            dooolyUseable = true
          } else if ((this.$Utils.convertToNumber(this.defaultOptions.orientIntergral) >=
              this.$Utils.convertToNumber(this.defaultOptions.needPayAmount)) && (this.$Utils.convertToNumber(this.defaultOptions.dooolyIntergral) <
              this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge))) {
            // a>=c b<c
            orientUseable = true
            dooolyUseable = false
          }
        }
      }

      this.usablePayList.map(payItem => {
        if (payItem.name == 'orientIntergral') {
          if (this.defaultOptions.orientIntergral == 0) {
            payItem.usable = false
          } else {
            payItem.usable = orientUseable
          }
        }
        if (payItem.name == 'dooolyIntergral') {
          if (this.defaultOptions.dooolyIntergral == 0 || this.defaultOptions.orientIntergral >= this.defaultOptions.needPayAmount) {
            payItem.usable = false
          } else {
            payItem.usable = dooolyUseable
          }
        }
      })
    },
    // 判断是否需要添加手续费
    calaNeedServiceCharge() {
      // 不支持兜礼积分或兜礼积分为0 不计算手续费
      if (!this.usableOptions.supportDooolyIntergral || this.usableOptions.dooolyIntergral == 0) return false
      // 定项积分足够支付时 不计算手续费
      if (this.usableOptions.orientIntergral >= this.usableOptions.needPayAmount) return false
      // 定向积分 + 兜礼积分不能支付时，并且不支持混合支付时，这时会采取现金支付，不计算手续费
      if (this.$Utils.convertToNumber(this.usableOptions.orientIntergral + this.usableOptions.dooolyIntergral) <
        this.$Utils.convertToNumber(this.usableOptions.needPayAmount + this.usableOptions.serviceCharge) &&
        !this.usableOptions.supportHybrid) return false

      this.usableOptions.realPayAmount = this.usableOptions.needPayAmount + this.usableOptions.serviceCharge
    },
    // 初始化定向积分支付
    initOrientIntergral() {
      // 定向积分大于0，默认一定会选中定向积分
      if (this.usableOptions.orientIntergral > 0) {
        this.result.orientIntergralFlag = true // 选中定向积分
        // 如果定向积分足够支付 则默认只选择定向积分 定向积分需支付金额为实际需支付金额
        if (this.$Utils.convertToNumber(this.usableOptions.orientIntergral >= this.usableOptions.realPayAmount)) {
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
    // 初始化兜礼积分支付
    initDooolyIntergral() {
      // 判断是否支持兜礼积分支付并且余额大于0 如果大于0则一定会默认选中兜礼积分
      if (this.usableOptions.supportDooolyIntergral && this.usableOptions.dooolyIntergral > 0) {
        this.result.dooolyIntergralFlag = true // 选中兜礼积分
        // 判断定向积分+兜礼积分是否足够支付，足够的话兜礼积分需支付积分则为 realPayAmount - orientIntergral
        if ((this.usableOptions.orientIntergral + this.usableOptions.dooolyIntergral) >= (this.usableOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
          this.result.dooolyIntergralPayAmount = this.usableOptions.realPayAmount - this.usableOptions.orientIntergral
        } else {
          this.result.dooolyIntergralPayAmount = this.usableOptions.dooolyIntergral // 兜礼积分不够时需支付金额为全部兜礼积分
          this.initHybrid() // 往下判断混合支付
        }
      } else {
        this.result.dooolyIntergralFlag = false // 不支持兜礼积分支付时不选中
        this.initHybrid()
      }
    },
    // 初始化混合支付
    initHybrid() {
      // 定向积分+兜礼积分<需支付总金额并且不支持混合支付时，不选中定向积分及兜礼积分
      if (!this.usableOptions.supportHybrid) {
        this.result.orientIntergralFlag = false
        this.result.dooolyIntergralFlag = false
      }

      this.initWechat()
    },
    // 初始化微信支付
    initWechat() {
      if (this.usableOptions.supportWechat) {
        let wechatPayAmount = 0
        if (this.usableOptions.supportHybrid) {
          wechatPayAmount = Number((this.usableOptions.realPayAmount - this.result.orientIntergralPayAmount - this.result.dooolyIntergralPayAmount).toFixed(2))
        } else {
          wechatPayAmount = this.usableOptions.realPayAmount
        }

        // 选中微信支付及修改需支付金额
        this.usablePayList.map(payType => {
          if (payType.name == 'wechat') {
            payType.selected = true
            payType.payAmount = wechatPayAmount
          }
        })
      } else {
        this.initAlipay()
      }
    },
    // 初始化支付宝支付
    initAlipay() {
      // 判断是否支持支付宝支付
      if (this.usableOptions.supportAlipay) {
        let alipayPayAmount = 0
        if (this.usableOptions.supportHybrid) {
          alipayPayAmount = Number((this.usableOptions.realPayAmount - this.result.orientIntergralPayAmount - this.result.dooolyIntergralPayAmount).toFixed(2))
        } else {
          alipayPayAmount = this.usableOptions.realPayAmount
        }

        // 选中支付宝支付及修改需支付金额
        this.usablePayList.map(payType => {
          if (payType.name == 'alipay') {
            payType.selected = true
            payType.payAmount = alipayPayAmount
          }
        })
      } else {
        throw Error('error')
      }
    },
    handlerChoose(item) {
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
      let cashTypeArr = ['wechat', 'alipay'] // 现金支付类型
      // 不可取消微信支付及支付宝支付
      if (item.selected && cashTypeArr.includes(item.name)) return false
      // 定向积分+兜礼积分点击取消时
      if (item.selected && !cashTypeArr.includes(item.name)) {
        if ((this.defaultOptions.orientIntergral >= this.defaultOptions.needPayAmount && item.name ==
            'dooolyIntergral') ||
          (this.defaultOptions.dooolyIntergral >= this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge) &&
            item.name == 'orientIntergral')) {
          // 单项积分足够时，可以取消另一项
        } else {
          if (!this.defaultOptions.supportHybrid) { // 不支持混合支付，并且单项积分不够支付时 不允许取消其中一项
            return false
          } else {
            // 开启微信支付及支付宝支付
            this.usablePayList.map(payItem => {
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

          this.usablePayList.map(payItem => {
            if (payItem.name == item.name) {
              payItem.selected = true
              payItem.payAmount = payAmount
            }
            if (cashTypeArr.includes(payItem.name) && payItem.name != item.name) {
              payItem.selected = false
              payItem.payAmount = 0
            }
          })
          this.judgePayType()
          return false
        }

        if (this.defaultOptions.supportHybrid) {
          // 单项积分足够的情况下再选现金支付，直接切换为现金支付
          if (orientIntergralPayAmount >= this.defaultOptions.needPayAmount ||
            dooolyIntergralPayAmount >= this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
            this.usablePayList.map(payItem => {
              if (!cashTypeArr.includes(payItem.name)) {
                payItem.selected = false
                payItem.payAmount = 0
              }
            })
          } else if (this.$Utils.convertToNumber(orientIntergralPayAmount + dooolyIntergralPayAmount) >= this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
            // 定向积分+兜礼积分组合够的情况下，选择现金支付，默认取消兜礼，使用定向+现金
            this.usablePayList.map(payItem => {
              if (payItem.name == 'dooolyIntergral') {
                payItem.selected = false
                payItem.payAmount = 0
              }
            })
          }
        } else { // 不支持混合支付 直接切换为现金支付
          this.usablePayList.map(payItem => {
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
        if ((item.name == 'orientIntergral' && this.defaultOptions.orientIntergral >= this.defaultOptions.needPayAmount) ||
          (item.name == 'dooolyIntergral' && this.defaultOptions && this.defaultOptions.dooolyIntergral >=
            (this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge))
        ) {
          if (item.name == 'dooolyIntergral') {
            this.usablePayList.map(payItem => {
              if (payItem.name == 'orientIntergral') {
                payItem.selected = false
              }
            })
          }
        } else {
          if (this.$Utils.convertToNumber(this.defaultOptions.orientIntergral + this.defaultOptions.dooolyIntergral) >=
            this.$Utils.convertToNumber(this.defaultOptions.needPayAmount + this.defaultOptions.serviceCharge)) {
            // 点击定向积分时 顺带打开兜礼积分
            if (item.name == 'orientIntergral') {
              this.usablePayList.map(payItem => {
                if (payItem.name == 'dooolyIntergral') {
                  payItem.selected = true
                }
              })
            } else {
              this.usablePayList.map(payItem => {
                if (payItem.name == 'orientIntergral') {
                  payItem.selected = true
                }
              })
            }
          }
        }
      }

      item.selected = !item.selected

      let optionsClone = JSON.parse(JSON.stringify(this.defaultOptions))
      orientIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'orientIntergral')
      dooolyIntergralItem = this.selectedPayList.filter(payItem => payItem.name == 'dooolyIntergral')
      wechatItem = this.selectedPayList.filter(payItem => payItem.name == 'wechat')
      alipayItem = this.selectedPayList.filter(payItem => payItem.name == 'alipay')

      if (orientIntergralItem.length == 0) {
        optionsClone.orientIntergral = 0
      }
      if (dooolyIntergralItem.length == 0) {
        optionsClone.dooolyIntergral = 0
      }
      if (wechatItem.length == 0) {
        optionsClone.supportWechat = false
      }
      if (alipayItem.length == 0) {
        optionsClone.supportAlipay = false
      } else {
        optionsClone.supportWechat = false
      }
      this.initUsablePayList()
      this.initDefaultPayType(optionsClone)
      this.judgePayType()
    }
  },
  watch: {

  },
  components: {

  }
};
