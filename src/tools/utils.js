import CryptoJS from 'crypto-js'
import {
  JSEncrypt
} from 'jsencrypt'
/**
 * 
 * @param {2018-12-18} str 
 * @param {/或.} sign 
 */

const formatStrDate = (str, sign) => {
  let date = new Date(str)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  if (m < 10) m = '0' + m
  let d = date.getDate()
  if (d < 10) d = '0' + d
  return y + sign + m + sign + d
}
const handleUrlParams = () => {
  let url = window.location.href;
  url = url.replace(/^((http|https):\/\/|\/)\S+\?(\S+)$/, '$3')
  if (url.indexOf('=') > -1) {
    let parmasList = url.split('&')
    return parmasList.map((item, index) => {
      if (item.indexOf('=') > -1) {
        let temp = item.split('=')
        return {
          key: temp[0],
          value: temp[1]
        }
      }
    })
  }
}
/**
 * 
 * @param {获取的参数名} name 
 */
const getUrlParams = (name) => {
  let paramsArr = handleUrlParams() || []
  let value = ''
  paramsArr.map((item, index) => {
    if (item.key == name) {
      value = item.value
    }
  })
  return window.decodeURIComponent(value)
}

const convertToNumber = (num1, num2) => {
  if (num2 == undefined) {
    num2 = 0
  }
  let a = Number(num1)
  let b = Number(num2)
  return  Number((a + b).toFixed(2))
}

//encryptor加密（RSA）
const encryptors = (word) => {
  var url = window.location.href
  var encryptor = new JSEncrypt()
  if (url.indexOf("reach_dist") > 0 || url.indexOf("reachtest") > 0 || url.indexOf("localhost") > 0) {
    encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfrUN3e9QJY0fytA/s2Lw734mEKE4Xm51/Z/KwvbPW3fg2PWrpWiytrh3dPYt/LL4lSHJkYHo8dlEvcol47N8AvARbFEZjzL/NSiQMgnAMtxuujPZpBFAhLO56G5VOsjpF78Ofu0iWbDOBgwqtYJFDhTLhH/TkEMA4r3KqTZzSTQIDAQAB')
  } else {
    encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnt3x59+DvVW/NXbhXy1x+ucALectoiwaN9KgLkRkqFj1Qr79FGQeaZKnE0Bgg5TF6FUZdXoiqInD1Zkq50Re7oMP8kKNkMaEuLgUYtM5k0vBtIuyd2cifk96r1q17xc3fbfwTtb6oEnbY2zlalE9NfeldZZJsT9Xind7yMHzdUQIDAQAB')
  }
  return encryptor.encrypt(word);
}
//crypto加密（aes）
const encrypt = (word, keyStr) => {
  let url = window.location.href;
  if (url.indexOf("reach_dist") > 0 || url.indexOf("reachtest") > 0 || url.indexOf("localhost") > 0) {
    keyStr = keyStr ? keyStr : '1aa1a07778e8464f';
  } else {
    keyStr = keyStr ? keyStr : '9e0d9955a5c84869';
  }
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  var resword = encrypted.toString();
  return encryptors(resword);
}
//crypto解密
const decrypt = (word, keyStr) => {
  let url = window.location.href;
  if (url.indexOf("reach_dist") > 0 || url.indexOf("reachtest") > 0 || url.indexOf("localhost") > 0) {
    keyStr = keyStr ? keyStr : '1aa1a07778e8464f';
  } else {
    keyStr = keyStr ? keyStr : '9e0d9955a5c84869';
  }
  var key = CryptoJS.enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}


export default {
  formatStrDate,
  getUrlParams,
  convertToNumber,
  encryptors,
  encrypt,
  decrypt
}
