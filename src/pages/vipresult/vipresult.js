//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
const util = require('../../utils/util.js');
Page({
    data:{
        vipInfo:{},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    onLoad:function(){
        this.initInfo();
    },
    initInfo: function () {
        var userInfo = app.globalData.userInfo
        var vipInfo={}
        switch (app.globalData.tablename) {
            case 'npdp':
                if (userInfo.npdpVip) {
                    vipInfo.tablename = 'npdp'
                    vipInfo.validTime = util.formatDateTime(userInfo.npdpValidTime,'yyyy-MM-dd')
                    vipInfo.vip = userInfo.npdpVip
                }
                break;
            case 'pmp':
                if (userInfo.pmpVip) {
                    vipInfo.tablename = 'pmp'
                    vipInfo.validTime = util.formatDateTime(userInfo.pmpValidTime,'yyyy-MM-dd')
                    vipInfo.vip = userInfo.pmpVip
                }
                break;
            case 'acp':
                if (userInfo.acpVip) {
                    vipInfo.tablename = 'acp'
                    vipInfo.validTime = util.formatDateTime(userInfo.acpValidTime,'yyyy-MM-dd')
                    vipInfo.vip = userInfo.acpVip
                }
                break;
            default:
                break;
        }
        this.setData({
            vipInfo:vipInfo
        })
    }
})