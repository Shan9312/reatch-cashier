<template>
    <div class="pay-warppe">
        <!-- 支付总金额提示 -->
        <div class="content">
             需支付：
            <span class="amount">100.00</span>
            <label class="col">
                 （含手续费：<span class="charge">4.70</span>）
            </label>
        </div>
        <!-- 付款方式列表 -->
        <div v-for='(item,index) in usablePayList' :key=index>
            <!-- 定向积分 -->
            <div class="pay-type">
                <div class="line" v-if='!index'>
                <div class="center direct">
                    <span class="fl direct-left names">{{item.name}}
                        <img class="direct-pic" src="../../../assets/images/payment/why.png" alt="定向积分疑问">
                    </span>
                    <span class="fr direct-available">可抵扣余额：
                        <label> {{item.payAmount}}</label>
                    </span>
                </div>
                <span  class="circle" v-if='false'>
                    <img class="pic fr" src="../../../assets/images/payment/pay_check.png" alt="定向积分选中">
                </span>
                <span  class="circle no-border" v-else>
                    <img class="pic fr" src="../../../assets/images/payment/pay_check_gray.png" alt="定向积分不可点击">
                </span>
                </div>
            </div>
            <!-- 兜礼付款方式提醒 -->
            <div class="pay-title">
                兜礼方式<span>（使用该支付商户将不向个人开具发票）</span>
            </div>
            <!--/兜礼/微信/支付宝-->
            <div class="pay-type">
                <section>
                    <div class="line">
                        <!-- <img class="pic fl" /> -->
                        <div class="center">
                        <span class="type-text fl names">{{'支付方式'}}</span>
                        <span class="fr available">可用余额：<label class="point">{{'100'}}</label></span>
                        <!-- <span class="fr available">需支付：<label class="point">{{'100'}}</label></span> -->
                        </div>
                        <span class="circle" :class="{'no-border': true}" v-if='true' >
                            <img class="pic fr"  src="../../../assets/images/payment/pay_check.png" alt="选中状态">
                        </span>
                        <span class="circle no-border" v-else>
                            <img class="pic fr" src="../../../assets/images/payment/pay_check_gray.png" alt="未选中状态">
                        </span>
                    </div>
                </section>
            </div>
        </div>
        <!-- 付款方式列表 -->
    </div>
</template>

<script>

export default {
    name: 'Payment',
    components: {},
    data () {
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
            payTypeList: [
                {
                    name: 'dooolyIntergral',
                    text: '兜礼',
                    imgSrc: require('../../../assets/images/payment/icon_1.png')
                },
                {
                    name: 'wechat',
                    text: '微信支付',
                    imgSrc: require('../../../assets/images/payment/icon_2.png')
                },
                {
                    name: 'alipay',
                    text: '支付宝支付',
                    imgSrc: require('../../../assets/images/payment/icon_3.png')
                }
            ], // 支付列表的图片
            usablePayList: [
                {
                  name: '定向积分', // 支付方式的 名称
                  usable: true, // 表示 当前支付 方式 是否可用
                  payAmount: 0, // 支付 金额
                  selected: false, // 支付选择框的 状态
                  imgSrc: '', // 图片样式
                }, // 支付方式的属性
            ], // 支付种类的列表; 如 定积分/兜礼/微信/支付宝 等等
        };
    },
    computed: {},
    created () {},
    methods: {
        /**
         * 初始化 可使用的 支付列表
         * 
         * */ 
        initUseAblePayList() {
            this.usablePayList = [];
            // 
        },
    },
}
</script>
<style lang="less" scoped>
.pay-warppe{
    img {
        width: 100%;
        height: 100%;
    }
    .content {
        padding: 0.14rem 0.15rem 0.36rem;
        font-size: 0.16rem;
        color: #333;
        background: #fff url('../../../assets/images/payment/title_bg.png') repeat-x 0
        bottom;
        background-size: auto 0.15rem;
        .amount {
            font-size: 0.18rem;
            color: #ee3f44;
        }
        .col {
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
        .pic {
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
        .circle {
            width: 0.23rem;
            height: 0.23rem;
            border-radius: 50%;
            border: 1px solid #ddd;
            box-sizing: border-box;
            &.no-border {
            border-color: transparent;
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
}
</style>



