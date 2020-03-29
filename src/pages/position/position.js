//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data:{
        contentList:[],
        name:''
    },
    onLoad:function(){
        this.getChaptersData()
    },
    getChaptersData:function(){
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        var url  = site.m + 'chaptersPosition/' + app.globalData.tablename + 'book'
        if (that.options.book2) {
            url += '2'
        }
        var name = that.options.name;
        if (app.globalData.tablename == 'pmp') {
            name = that.options.name.replace(/\s/g,'')
        }
        wx.request({
            url: url+`?name=${name}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data&&res.data.data.length) {
                        that.setData({
                            name:that.options.name,
                            contentList:res.data.data[that.options.index].contentList
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
                    title: '服务器出了点问题，请稍候重试',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function () {
                wx.hideLoading()
                wx.stopPullDownRefresh()
            }
        })
    },
    detailClick:function(e){
        wx.navigateTo({
            url: `/pages/chaptersdetail/chaptersdetail?name=${this.options.name}&book2=${this.options.book2}&albumid=${e.currentTarget.dataset.albumid}&albumid2=${e.currentTarget.dataset.albumid2}&albumid3=${e.currentTarget.dataset.albumid3}&albumid4=${e.currentTarget.dataset.albumid4}`
        })
    }
})