//获取应用实例
const app = getApp();
//api.js
const site = require('./site.js').site;
// checkSession
const wxCheckSession = (that,fn) => {
    wx.checkSession({
        success: function(){
            checkUserInfo(that,function(){
                var sessionId = wx.getStorageSync("sessionId");
                var t = setTimeout(() => {
                    if(!sessionId){
                        wxLogin(that,fn);
                        clearTimeout(t);
                        return;
                    }
                    //session_key 未过期，并且在本生命周期一直有效
                    if(fn){
                        fn();
                    }
                }, 100)
            },fn);
        },
        fail: function(){
            // session_key 已经失效，需要重新执行登录流程
            wxLogin(that,fn);
        }
    })
}
//获取code
const wxLogin = (that,fn) => {
    wx.login({
        success: function (res) {
            if (res.code) {
                //发起网络请求
                loginOAuth(that,res.code,fn);
            }else {
                console.log('获取用户登录态失败！' + res.errMsg)
            }
        },
        fail:function (err){
            wx.hideLoading()
            if(err.errMsg.indexOf('login:fail') != -1){
                if(that.nosignal){
                    that.nosignal.showSignal();
                }
                that.setData({
                    isHaveNetWorking:false
                })
            }else {
                if(that.nosignal){
                    that.nosignal.hideSignal();
                }
                that.setData({
                    isHaveNetWorking:true
                })
            }
        }
    });
}
// loginOAuth
const loginOAuth = (that,code,fn) => {
    //wx.clearStorageSync();
    wx.request({
        url: site.login + 'Miniprogram/Openminiprogram/loginOAuth2',
        method:'GET',
        data: {
            code: code,
            type:'shop'
        },
        dataType:'json',
        success:function(res){
            if(res.statusCode == 200){
                if(res.data && res.data.status){
                    if(res.data.result && res.data.result.sessionId){
                        wx.setStorageSync('sessionId', res.data.result.sessionId);
                        wx.setStorageSync('openid', res.data.requestInfo.openId);
                        wx.setStorageSync('userId', res.data.result.userInfo.userId);
                        wx.removeStorageSync('session_key');
                        if(fn){
                            fn();
                        }
                    }else {
                        wx.setStorageSync('session_key', res.data.result.session_key);
                        wx.setStorageSync('openid', res.data.result.openid);
                        wx.setStorageSync('unionid', res.data.result.unionid);
                        if(fn){
                            fn(res.data.result.session_key);
                        }
                    }
                }else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.errInfo,
                        success: function (res) { }
                    })
                }
            }else {
                wx.showToast({
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function(err){
            if(fn){
                fn();
            }
            console.log(err);
        },
        complete: function(){

        }
    })
}
//设置header
const setHeader = () => {
    var header = {},
        uuid   = wx.getStorageSync("openid"),
        utmSource = app.globalData.utmSource,
        sessionId = wx.getStorageSync("sessionId");
    if (sessionId) {
        header = {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': 'PHPSESSID=' + sessionId + ';client=miniprogram;utm_source=' + utmSource + ';kfz_uuid=' + uuid +';' //读取cookie
        };
    }else {
        header = {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': 'client=miniprogram;utmSource=' + utmSource + ';uuid=' + uuid +';'
        };
    }
    return header;
}
//检测服务端sessionId是否过期
const checkUserInfo = (that,callback,fn) => {
    const header = setHeader();
    wx.request({
        url: site.login + 'api-user/User/Index/getUserInfo/',
        method:'GET',
        header: header,
        dataType:'json',
        success:function(res){
            if(res.statusCode == 200){
                if(res.data.status && res.data.data){
                    if(callback){
                        callback();
                    }
                }else {
                    wxLogin(that,fn);
                }
            }else {
                wxLogin(that,fn);
            }
        },
        fail: function(err){
            wxLogin(that,fn);
        },
        complete: function(){

        }
    })
}
module.exports = {
    wxCheckSession:wxCheckSession,
    wxLogin:wxLogin,
    setHeader:setHeader
}
