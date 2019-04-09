import {
  GlobalProperty
} from '@/common/global'

const Api = {
  unifiedorder: `${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/unifiedorder/V2`, // 查询订单信息接口
  getPayForm: `${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/getPayForm/V2`, // 检查订单id是否有效
  integralPay: `${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/integralPay/V2`, // 兜礼积分支付接口
}

export default Api;