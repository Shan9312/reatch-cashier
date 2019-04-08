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

export {
    errorLog
}