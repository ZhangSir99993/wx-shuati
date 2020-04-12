//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
//auth.js
const auth = require('../../api/auth.js');
const util = require('../../utils/util.js')


Page({
    data: {
        site: site, //站点配置
        status: 2,
        confirmText: '',
        isOneOrder: false,
        loadingStatus: false,
        obj: {}
    },
    onLoad: function (options) {
        var that = this;
        that.data.obj = options
        //页面加载调取微信支付（原则上应该对options的携带的参数进行校验）
        that.requestPayment();

    },
    //根据 obj 的参数请求wx 支付
    requestPayment: function () {
        var that = this,
            obj = that.data.obj
        that.setData({
            status: 0
        });
        wx.setNavigationBarTitle({
            title: "支付"
        });
        //调起微信支付
        wx.requestPayment({
            //相关支付参数
            'nonceStr': obj.nonceStr,
            'package': 'prepay_id='+obj.prepay_id,
            'signType': obj.signType,
            'paySign': obj.paySign,
            'timeStamp': obj.timeStamp,
            //小程序微信支付成功的回调通知
            'success': function (res) {
                that.setData({
                    status: 1,
                    // payTime: util.formatTimeDefault(new Date())
                });
                
                wx.setNavigationBarTitle({
                    title: "支付结果"
                });
                app.globalData.refreshVip = true
                that.upDateUserInfo();
                // that.requestPaySuccess();
            },
            //小程序支付失败的回调通知
            'fail': function (res) {
                that.setData({
                    status: 2
                });
                wx.setNavigationBarTitle({
                    title: "支付结果"
                });
            }
        })
    },
    upDateUserInfo:function(){
        wx.request({
            url: site.m + 'miniprogram/getUserInfo/',
            method: 'GET',
            header: auth.setHeader(),
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.status) {
                        app.globalData.userInfo = res.data.data.result
                    }
                }
            }
        })
    },
    // 支付成功回调
    requestPaySuccess: function () {
        var that = this;
        if (that.data.isOneOrder) {
            // 单个订单计算实付金额
            wx.request({
                url: site.pay + 'Pay/Payment/getRealPayResult',
                method: 'GET',
                header: auth.setHeader(), //传在请求的header里
                data: {
                    bizType: 1,
                    shopkeeperId: that.data.orderInfo.shopkeeperId,
                    payoutUserID: wx.getStorageSync("userId"),
                    orderId: that.data.orderInfo.orderId
                },
                dataType: 'json',
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.status) {
                            that.setData({
                                price: res.data.data.realAmount
                            });
                            that.subscribeMessage();
                        }
                    }
                },
                fail: function (err) {},
                complete: function (err) {

                }
            })
        } else {
            // 批量订单计算实付金额
            wx.request({
                url: site.pay + 'Pay/Payment/getRealPayResult',
                method: 'GET',
                header: auth.setHeader(), //传在请求的header里
                data: {
                    bizType: 1,
                    payoutUserID: wx.getStorageSync("userId"),
                    unitedPayRefID: that.data.obj.unitedPayRefID
                },
                dataType: 'json',
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.status) {
                            that.setData({
                                price: res.data.data.realAmount
                            });
                            that.subscribeMessage();
                        }
                    }
                },
                fail: function (err) {

                },
                complete: function (err) {

                }
            })
        }
    },
    //获取订阅消息权限
    subscribeMessage: function () {
        var that = this;
        if (wx.requestSubscribeMessage) {
            wx.requestSubscribeMessage({
                tmplIds: ['DNUZ_07QIVCWJ1prA9HvRvcba_HHb_TKCrdrZnenN38', 'QehB40Qbf5j9Mw0gsmmrNHapDEifrLhUzC9DhBKIw-U', 'ZDs4ZN69AExtUBjIRcOSq0WFhsAfBoLp1GWwvJxHSrI'],
                success(res) {
                    that.templateMessage();
                },
                fail(err) {},
                complete() {}
            })
        } else {
            wx.showToast({
                title: '不支持订阅消息通知,请升级微信app',
                icon: 'none',
                duration: 2000
            })
        }
    },
    // 支付成功后发送服务消息
    templateMessage: function () {
        var that = this,
            params = {
                type: 'order_pay_success',
                openId: wx.getStorageSync("openid"),
                createTime: that.data.payTime,
                price: that.data.price
            };
        if (that.data.isOneOrder) {
            params.page = 'pages/orderdetail/orderdetail?orderId=' + that.data.orderId;
        } else {
            params.page = 'pages/orderlist/orderlist';
        }
        wx.request({
            url: site.m + 'api-wechat/Interface/Miniprogram/sendSubscribeMessage',
            method: 'POST',
            header: auth.setHeader(), //传在请求的header里
            data: params,
            dataType: 'json',
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.status) {

                    }
                }
            },
            fail: function (err) {

            },
            complete: function (err) {}
        })
    },
    //查看订单
    checkOrder: function () {
        wx.redirectTo({
            url: '/pages/vipresult/vipresult'
        })
    },
    goHmoe: function () {
        wx.reLaunch({
            url: "/pages/index/index"
        })
    },

})