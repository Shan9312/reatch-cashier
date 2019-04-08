import Host from '@/common/host.js'

const Api = {
  unifiedorder: Host.mainWebsite + '/Doooly/jersey/doooly/payment/unifiedorder/V2', // 查询订单信息接口
  getPayForm: Host.mainWebsite + '/Doooly/jersey/doooly/payment/getPayForm/V2', // 检查订单id是否有效
}

export default Api;