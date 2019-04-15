import {
    GlobalProperty
} from '@/common/global'
import Ajax from '@/common/ajax'

/**
 * Record error logs
 * @param {*} timestamp current timestamp
 * @param {*} clientChannel client channel with types H5、IOS、Android
 * @param {*} sign md5 sign that can be empty
 * @param {*} logStr error message
 * @param {*} terminaModel model and system of current phone
 * @param {*} userId user id
 * @param {*} appVersion current version of current phone
 * @param {*} pageUrl // request url of current page 
 */
const errorLog = (timestamp, clientChannel, sign, logStr, terminaModel, userId, appVersion, pageUrl) => {
    return Ajax.post(`${GlobalProperty.apiDomain.doooly}jersey/app/error-log/save/v1`, {
        timestamp,
        clientChannel,
        sign,
        param: {
            logStr,
            terminaModel,
            userId,
            appVersion,
            pageUrl
        }
    })
}
/**
 * 获取订单信息
 * @param {*} orderNum: 订单号 
 * @param {*} userId: 用户id 
 * @param {*} redirectUrl: 重定向地址
 * */
const unifiedorder = (orderNum, userId, redirectUrl) => {
    return Ajax.post(`${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/unifiedorder/V2`, {
        orderNum,
        userId,
        redirectUrl
    })
}
/**
 * 根据支付列表，点击确认按钮
 * @param {*} orderNum: 订单号
 * @param {*} userId: 用户ID
 * @param {*} redirectUrl: 重定向地址
 * @param {*} payId: 预付款ID
 * @param {*} tradeType: 交易平台类型
 * @param {*} commonIntegralSwitch: 兜礼积分开关状态 
 * @param {*} dirIntegralSwitch: 定向积分开关状态
 * */
const getPayForm = (orderNum, userId, redirectUrl, payId, tradeType, payType, commonIntegralSwitch, dirIntegralSwitch) => {
    return Ajax.post(`${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/getPayForm/V2`, {
        orderNum,
        userId,
        redirectUrl,
        payId,
        tradeType,
        payType,
        commonIntegralSwitch,
        dirIntegralSwitch
    })
}
/**
 * 根据验证码/密码 确认支付
 * @param {*} orderNum: 订单号
 * @param {*} userId: 用户ID
 * @param {*} payId: 预订单ID
 * @param {*} payPassword: 验证码/密码
 * @param {*} dirIntegralSwitch: 定向积分选中状态
 * */
const integralPay = (orderNum, userId, payId, payPassword, dirIntegralSwitch) => {
    return Ajax.post(`${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/integralPay/V2`, {
        orderNum,
        userId,
        payId,
        payPassword,
        dirIntegralSwitch
    })
}
/**
 * 获取订单支付情况
 * @param {*} orderNum: 订单号
 * */
const getPayResult = (orderNum) => {
    return Ajax.post(`${GlobalProperty.apiDomain.doooly}jersey/doooly/payment/getPayResult/V2`, {
        orderNum
    })
}
export {
    errorLog,
    unifiedorder,
    getPayForm,
    integralPay,
    getPayResult,
}