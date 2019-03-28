import Browser from '@/common/global'

/**
 * 原生应用交互方法
 */
const DooolyApp = () => {
    let browserName = Browser.getName()
    //1.获取定位信息
    this.homeLocationVector = (channelName, typeName) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.getLocationJson.postMessage('1')
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.homeLocationVector(channelName, typeName) //(1) channelName渠道名称(2)  typeName:类型名称OPENPERMMISON弹出权限提示框OTHERVALUE 不弹出权限提示框 必填字段
        }
    }
    //2.检测版本升级(关于兜礼)
    this.checkAppVersion = (methods) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.checkUpdateVersion.postMessage('1')
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.checkAppVersion()
        } else {
            this.$toast('系统升级中')
        }
    }
    //3.获取版本号方法1.0(关于兜礼)
    this.getAppVersionName = (methods) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.getAppVersionName.postMessage(methods)
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.getAppVersionName(methods)
        }
    }
    //4.返回登陆页方法(会员激活)
    this.forceLoginOut = () => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.forceLoginOut.postMessage('1')
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.goBackLogin()
        } else {
            this.$router.push('/')
        }
    }
    //5.获取设备号方法(会员激活)
    this.getPhoneDeviceId = (methods) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.getPhoneDeviceId.postMessage(methods)
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.getPhoneDeviceId(methods)
        }
    }
    //6.返回首页(支付完成)
    this.jumpIndexPage = (url) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.jumpTabarItemIndex.postMessage('0')
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.jumpIndexPage()
        } else {
            window.location.replace(url)
        }
    }
    //7.拨打电话方法(商户详情,常见问题,帮助中心)
    this.callPhone = (methods) => {
        if (browserName == 'otherAPPAndroid' || browserName == 'Chrome WebView') {
            RHNativeJS.callPhone(methods)
        } else if (browserName == 'otherAPPIos' || browserName == 'WebKit') {
            window.webkit.messageHandlers.callPhone.postMessage(methods)
        } else {
            window.location.href = 'tel:' + methods
        }
    }
    //8.打开京东首页方法(商户详情)
    this.openJDHome = (methods) => {
        if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
            window.webkit.messageHandlers.openJDHome.postMessage('1')
        } else if (
            browserName == 'Chrome WebView' ||
            browserName == 'otherAPPAndroid'
        ) {
            RHNativeJS.openJDHome()
        }
    }
    //9.打开APP地图(商户详情,我的福利)
    this.openMapView = (company, id) => {
        var jsonObj = {
            jumpType: 'InsideJump',
            jumpUrl: 'MapView',
            company: company,
            id: id,
        }
        if (browserName == 'WebKit') {
            //判断iPhone|iPad|iPod|iOS
            window.webkit.messageHandlers.gotoNativeJump.postMessage(
                JSON.stringify(jsonObj)
            )
        } else if (browserName == 'Chrome WebView') {
            //判断Android
            RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
        } else {
            localStorage.storeMapCompany = company
            this.$router.push({
                path: '/storeMap/' + id,
            })
        }
    }
    //10.打开扫码优惠(商户详情)
    this.openScanDiscount = () => {
        if (browserName == 'WebKit') {
            var json = {
                businessId: this.adBusiness.businessId,
                company: this.adBusiness.company,
                id: this.adBusiness.id,
                miniLogo: this.adBusiness.miniLogo,
            }
            window.webkit.messageHandlers.openScanDiscount.postMessage(
                JSON.stringify(json)
            )
        } else if (browserName == 'Chrome WebView') {
            var json = {
                businessId: this.adBusiness.businessId,
                company: this.adBusiness.company,
                dealType: this.adBusiness.dealType,
                delFlag: this.adBusiness.delFlag,
                id: this.adBusiness.id,
                isSupportIntegral: this.adBusiness.isSupportIntegral,
                miniLogo: this.adBusiness.miniLogo,
                scanImageUrl: this.adBusiness.scanImageUrl,
            }
            RHNativeJS.openScanDiscount(JSON.stringify(json))
        } else {
            this.emitDate.dealType = this.adBusiness.dealType
            this.emitDate.id = this.adBusiness.id
            this.emitDate.businessId = this.adBusiness.id
            this.emitDate.company = this.adBusiness.company
            this.emitDate.miniLogo = this.adBusiness.miniLogo
            this.emitDate.userId = localStorage.userId
            this.emitDate.groupShortName = localStorage.groupShortName
            this.addScanAction(this.emitDate)
            this.$router.push({
                path: '/scanDetail/' + this.adBusiness.company,
            })
        }
    }
    //11.隐藏头部导航栏及禁止下拉刷新()
    this.hideNavgationBar = () => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.hideNavgationBar.postMessage('true')
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.setTopDialog(true)
            RHNativeJS.visablePtrFrame(false)
        }
    }
    //12.显示头部导航栏及恢复下拉刷新()
    this.showNavgationBar = () => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.hideNavgationBar.postMessage('false')
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.setTopDialog(false)
            RHNativeJS.visablePtrFrame(true)
        }
    }
    //13.返回上级页面(支付完成)
    // index传1 设置默认返回方法
    this.goBackPageIndex = (index) => {
        if (browserName == 'WebKit') {
            // ios
            window.webkit.messageHandlers.goBackPageIndex.postMessage(index)
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.backWebPage(index)
        } else {
            window.history.go(-index)
        }
    }
    //14.跳转联系客服(我的申诉)
    this.AppealAgainst = (jsonObj, type) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.gotoNativeJump.postMessage(
                JSON.stringify(jsonObj)
            )
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
        } else {
            this.$router.push({
                name: 'appeal',
                params: {
                    dataType: type,
                },
            })
        }
    }
    //15.打开手机通讯录(家属邀请)
    //返回参数(tel,name)
    this.openTelePhoneList = (methods) => {
        if (browserName == 'WebKit') {
            window.webkit.messageHandlers.getAddressBook.postMessage(methods)
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.openTelePhoneList(methods)
        }
    }
    //16.app选择上传照片(线下订单)
    this.photographNative = (methods) => {
        if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
            window.webkit.messageHandlers.photographNative.postMessage(methods)
        } else if (
            browserName == 'Chrome WebView' ||
            browserName == 'otherAPPAndroid'
        ) {
            RHNativeJS.photographNative(methods)
        }
    }
    //17.修改APP本地支付方式
    this.getPaymentType = (data) => {
        if (browserName == 'WebKit') {
            // ios
            window.webkit.messageHandlers.getPaymentType.postMessage(
                JSON.stringify(data)
            )
        } else if (browserName == 'Chrome WebView') {
            RHNativeJS.successPay(JSON.stringify(data)) //保存修改之后的值告诉android
        } else {
            localStorage.isPayPassword = data
        }
    }
    //18设置头部方法封装(类型待整理)
    this.initTitle = (titleText, key, funcName) => {
        document.title = titleText
        var jsonObj
        if (key == 1) {
            jsonObj = {
                title: {
                    text: titleText,
                },
                leftButton: {
                    name: 'lbs',
                    text: '城市',
                    func: 'goLastPage()',
                    visable: 'true',
                },
                rightButton: {
                    name: 'notice',
                    visable: 'true',
                },
                visable: 'true',
            }
        } else if (key == 2) {
            if (window.location.href.indexOf('/dist/') > -1) {
                //app旧版本兼容
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            } else {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: funcName,
                        visable: 'true',
                    },
                    visable: 'true',
                }
            }
        } else if (key == 3) {
            //导购规则的弹窗
            if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    rightButton: {
                        name: 'request',
                        func: 'altNotice()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            } else if (
                browserName == 'Chrome WebView' ||
                browserName == 'otherAPPAndroid'
            ) {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    rightButton: {
                        name: 'request',
                        func: 'altNoticeAndriod()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            }
        } else if (key == 13) {
            if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'false',
                    },
                    rightButton: {
                        name: 'request',
                        func: 'altNotice()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            } else if (
                browserName == 'Chrome WebView' ||
                browserName == 'otherAPPAndroid'
            ) {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'false',
                    },
                    rightButton: {
                        name: 'request',
                        func: 'altNoticeAndriod()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            }
        } else if (key == 4) {
            //导购文章分享
            if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    rightButton: {
                        name: 'request',
                        func: 'altNotice()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            } else if (
                browserName == 'Chrome WebView' ||
                browserName == 'otherAPPAndroid'
            ) {
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    rightButton: {
                        name: 'share',
                        func: 'shareShopping()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            }
        } else if (key == 8) {
            //积分充值
            if (browserName == 'WebKit' || browserName == 'otherAPPIos') {
                //判断iPhone|iPad|iPod|iOS
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    rightButton: {
                        name: '疑问提示',
                        func: 'APP_card_question()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            } else if (
                browserName == 'Chrome WebView' ||
                browserName == 'otherAPPAndroid'
            ) {
                //判断Android
                jsonObj = {
                    title: {
                        text: titleText,
                    },
                    leftButton: {
                        name: 'return',
                        text: '返回',
                        func: 'goLastPage()',
                        visable: 'true',
                    },
                    rightButton: {
                        name: 'request',
                        func: 'APP_card_question()',
                        visable: 'true',
                    },
                    visable: 'true',
                }
            }
        } else if (key == 5) {
            //发现
            jsonObj = {
                title: {
                    text: titleText,
                },
                leftButton: {
                    name: 'lbs',
                    text: '城市',
                    func: 'goLastPage()',
                    visable: 'false',
                },
                rightButton: {
                    name: 'notice',
                    visable: 'false',
                },
                visable: 'true',
            }
        } else if (key == 6) {
            //我的
            jsonObj = {
                title: {
                    text: '我的',
                    name: 'WhiteTextView',
                },
                leftButton: {
                    name: 'whiteSetting',
                    func: 'systemSetting()',
                    visable: 'true',
                },
                rightButton: {
                    name: 'whiteNotice',
                    visable: 'true',
                },
                visable: 'true',
            }
        } else {
            jsonObj = {
                title: {
                    text: titleText,
                },
                leftButton: {
                    name: 'return',
                    text: '返回',
                    func: 'goLastPage()',
                    visable: 'true',
                },
                visable: 'true',
            }
        }
        if (browserName == 'WebKit') {
            //判断iPhone|iPad|iPod|iOS
            // jsonObj.title.text += "ios"//测试
            window.webkit.messageHandlers.initPageTitle.postMessage(
                JSON.stringify(jsonObj)
            )
            window.webkit.messageHandlers.hiddenBotomTabBar.postMessage('true')
        } else if (browserName == 'otherAPPIos') {
            window.webkit.messageHandlers.initPageTitle.postMessage(
                JSON.stringify(jsonObj)
            )
        } else if (browserName == 'Chrome WebView') {
            //判断Android
            RHNativeJS.initPageTitle(JSON.stringify(jsonObj))
            if (key == 6) {
                RHNativeJS.setPersonalCenterHeader(true)
            }
            RHNativeJS.hideWaitPanel()
        } else if (browserName == 'otherAPPAndroid') {
            RHNativeJS.initPageTitle(JSON.stringify(jsonObj))
        }
    }
    //19.内部跳转
    this.internalJump = (url, dataType) => {
        var jsonObj = {
            "jumpType": "InsideJump",
            "jumpUrl": window.location.href.substring(0, window.location.href.indexOf('#') + 1) + url
        }
        if (browserName == 'Chrome WebView') {
            RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
        } else if (browserName == "WebKit") { //判断iPhone|iPad|iPod|iOS
            let _jsonObj = null
            if (dataType && dataType[browserName]) {
                _jsonObj = Object.assign({}, jsonObj, dataType[browserName])
            } else {
                _jsonObj = jsonObj
            }
            window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(_jsonObj))
        } else { // h5和微信
            this.$router.push(url)
        }
    }
    //20.外部跳转链接
    this.externalJump = (url) => {
        let jsonObj = {
            "jumpType": "InsideJump",
            "jumpUrl": url
        }
        if (browserName == "WebKit") { //判断iPhone|iPad|iPod|iOS
            window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj))
        } else if (browserName == "Chrome WebView") { //判断Android
            RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
        } else {
            window.location.href = url
        }
    }
    //22.跳转活动项目
    this.redirectActivity = (url) => {
        if (window.location.href.indexOf('dist2.2.1') > -1) {
            url = url.replace('/activity/', '/activity_v2.2.1/')
        } else if (window.location.href.indexOf('dist2.2.0') > -1) {
            url = url.replace('/activity/', '/activity_v2.2.1/')
        }
        this.externalJump(url)
    }
    //21.app支付
    this.appPay = (data, funcName, type) => { //支付参数,回调函数名,支付方式 ('wx'微信支付,'zfb'支付宝支付)
        try {
            if (type == 'wx') {
                if (browserName == "WebKit" || browserName == "otherAPPIos") { //判断iPhone|iPad|iPod|iOS
                    data.func = funcName
                    window.webkit.messageHandlers.wechatPay.postMessage(JSON.stringify(data))
                } else if (browserName == "Chrome WebView" || browserName == "otherAPPAndroid") {
                    RHNativeJS.wechatPay(JSON.stringify(data), funcName)
                }
            } else if (type == 'zfb') {
                if (browserName == "WebKit") { //判断iPhone|iPad|iPod|iOS
                    data.func = funcName
                    window.webkit.messageHandlers.aliPayment.postMessage(JSON.stringify(data))
                } else if (browserName == "Chrome WebView") {
                    RHNativeJS.aliPay(data.aLiPayUrl, 'pay_callBack')
                } else {
                    let form = data.aLiPayUrl
                    let div = document.createElement('div')
                    div.innerHTML = form //此处form就是后台返回接收到的数据
                    document.body.appendChild(div)
                    document.forms[0].submit()
                }
            }

        } catch (e) {
            errorLog(e)
        }
    }
}
export default DooolyApp