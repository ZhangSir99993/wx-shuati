//获取应用实例
const app = getApp()
//auth.js
const auth = require('../../api/auth.js');
//api.js
const site = require('../../api/site.js').site;

const util = require('../../utils/util.js')
Page({
    data: {
        itemList: []
    },
    onLoad: function () {
        var userInfo = app.globalData.userInfo
        if (!userInfo) {
            return
        }
        if (userInfo.npdpVip) {
            this.data.itemList.push({
                tablename: 'npdp',
                validTime: util.formatDateTime(userInfo.npdpValidTime,'yyyy-MM-dd')
            })
        }

        if (userInfo.pmpVip) {
            this.data.itemList.push({
                tablename: 'pmp',
                validTime: util.formatDateTime(userInfo.pmpValidTime,'yyyy-MM-dd')
            })
        }

        if (userInfo.acpVip) {
            this.data.itemList.push({
                tablename: 'acp',
                validTime: util.formatDateTime(userInfo.acpValidTime,'yyyy-MM-dd')
            })
        }

        this.setData({
            itemList:this.data.itemList
        })
    },
    vipClick:function(){

    }

})