import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';


const UtilsFunction = {
  // encryptor加密（RSA）
  encryptors: (word) => {
    const url = window.location.href;
    const encryptor = new JSEncrypt();
    if (
      url.indexOf('reach_dist') > 0 ||
      url.indexOf('reachtest') > 0 ||
      url.indexOf('localhost') > 0
    ) {
      encryptor.setPublicKey(
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfrUN3e9QJY0fytA/s2Lw734mEKE4Xm51/Z/KwvbPW3fg2PWrpWiytrh3dPYt/LL4lSHJkYHo8dlEvcol47N8AvARbFEZjzL/NSiQMgnAMtxuujPZpBFAhLO56G5VOsjpF78Ofu0iWbDOBgwqtYJFDhTLhH/TkEMA4r3KqTZzSTQIDAQAB'
      )
    } else {
      encryptor.setPublicKey(
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnt3x59+DvVW/NXbhXy1x+ucALectoiwaN9KgLkRkqFj1Qr79FGQeaZKnE0Bgg5TF6FUZdXoiqInD1Zkq50Re7oMP8kKNkMaEuLgUYtM5k0vBtIuyd2cifk96r1q17xc3fbfwTtb6oEnbY2zlalE9NfeldZZJsT9Xind7yMHzdUQIDAQAB'
      )
    }
    return encryptor.encrypt(word)
  },

  // crypto加密（aes）
  encrypt: (word, keyStr) => {
    const url = window.location.href
    if (
      url.indexOf('reach_dist') > 0 ||
      url.indexOf('reachtest') > 0 ||
      url.indexOf('localhost') > 0
    ) {
      keyStr = keyStr || '1aa1a07778e8464f'
    } else {
      keyStr = keyStr || '9e0d9955a5c84869'
    }
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const resword = UtilsFunction.encrypted.toString()
    return encryptors(resword)
  },

  handleUrlParams: () => {
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
  },
  getUrlParams: (name) => {
    let paramsArr = UtilsFunction.handleUrlParams() || []
    let value = ''
    paramsArr.map((item, index) => {
      if (item.key == name) {
        value = item.value
      }
    })
    return window.decodeURIComponent(value)
  },
  converNumber: (num1, num2) => {
    if (!num2) num2 = 0;
    return Number((Number(num1) + Number(num2)).toFixed(2));
  }
}

export {
  UtilsFunction,
}