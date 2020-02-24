//获取应用实例
const app = getApp();
//api.js
const site = require('./site.js').site;
// checkSession
const wxCheckSession = (that, fn) => {
    wx.checkSession({
        success: function () {
            checkUserInfo(that, function () {
                /*
                var session_key = wx.getStorageSync("session_key");
                var t = setTimeout(() => {
                    if(session_key){
                        wxLogin(that,fn);
                        clearTimeout(t);
                        return;
                    }
                    //session_key 未过期，并且在本生命周期一直有效
                    if(fn){
                        fn();
                    }
                }, 100)
                */
                if (fn) {
                    fn();
                }
            }, fn);
        },
        fail: function () {
            // session_key 已经失效，需要重新执行登录流程
            wxLogin(that, fn);
        }
    })
}
//获取code
const wxLogin = (that, fn) => {
    wx.login({
        success: function (res) {
            if (res.code) {
                //发起网络请求
                loginOAuth(that, res.code, fn);
            } else {
                console.log('获取用户登录态失败！' + res.errMsg)
            }
        },
        fail: function (err) {
            wx.hideLoading()
            if (err.errMsg.indexOf('login:fail') != -1) {
                if (that.nosignal) {
                    that.nosignal.showSignal();
                }
                that.setData({
                    isHaveNetWorking: false
                })
            } else {
                if (that.nosignal) {
                    that.nosignal.hideSignal();
                }
                that.setData({
                    isHaveNetWorking: true
                })
            }
        }
    });
}
const loginOAuth = (that, code, fn) => {
    wx.request({
        url: site.m + 'miniprogram/login',
        method: 'POST',
        // header: setHeader(),
        data: {
            code: code
        },
        dataType: 'json',
        success: function (res) {
            if (res.data.code == 200) {
                if (res.data.data && res.data.data.openid) {
                    if (res.data.data.session_key) { //未登录，需要注册登录
                        wx.setStorageSync('openid', res.data.data.openid);
                        wx.setStorageSync('session_key', res.data.data.session_key);
                        if (fn) {
                            fn(res.data.data.session_key);
                        }
                    } else { //已登录
                        app.globalData.userInfo = res.data.data.result
                        wx.setStorageSync('openid', res.data.data.openid);
                        wx.removeStorageSync('session_key');
                        if (fn) {
                            fn();
                        }
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.errInfo,
                        success: function (res) {}
                    })
                }
            } else {
                wx.showToast({
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function (err) {
            if (fn) {
                fn();
            }
        },
        complete: function () {

        }
    })
}
//注册
const wxRegister = (that, fn) => {
    let openid = wx.getStorageSync("openid")
    wx.request({
        url: site.m + 'miniprogram/register',
        method: 'POST',
        header: setHeader(),
        data: {
            openid: openid,
            userInfo:JSON.stringify(app.globalData.userInfo)
        },
        dataType: 'json',
        success: function (res) {
            if (res.data.code == 200) {
                if (res.data.data && res.data.data.status) {
                    //登录成功
                    wx.removeStorageSync('session_key');
                    if (fn) {
                        fn();
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.data.message,
                        success: function (res) {}
                    })
                }
            } else {
                wx.showToast({
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function (err) {
            wx.showToast({
                title: JSON.stringify(err),
                icon: 'none',
                duration: 2000
            })
        },
        complete: function () {

        }
    })
}
//检测服务端sessionId是否过期
const checkUserInfo = (that, callback, fn) => {
    wx.request({
        url: site.m + 'miniprogram/getUserInfo/',
        method: 'GET',
        header: setHeader(),
        dataType: 'json',
        success: function (res) {
            if (res.data.code == 200) {
                if (res.data.data && res.data.data.status) {
                    app.globalData.userInfo = res.data.data.result
                    if (callback) {
                        callback();
                    }
                } else {
                    wxLogin(that, fn);
                }
            } else {
                wxLogin(that, fn);
            }
        },
        fail: function (err) {
            wxLogin(that, fn);
        },
        complete: function () {

        }
    })
}
//设置header
const setHeader = () => {
    var header = {},
    openid = wx.getStorageSync("openid"),
        session_key = wx.getStorageSync("session_key");
    if (session_key) { //未登录
        header = {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': 'client=miniprogram;'
        };
    } else { //已登录
        header = {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': 'openid=' + openid + ';client=miniprogram;' //读取cookie
        };

    }
    return header;
}
module.exports = {
    wxCheckSession: wxCheckSession,
    wxLogin: wxLogin,
    wxRegister: wxRegister,
    setHeader: setHeader
}