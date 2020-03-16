//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data:{
        detail:{}
    },
    onLoad: function (options) {
        this.setData({
            detail:JSON.parse(options.detail)
        })
    }
})