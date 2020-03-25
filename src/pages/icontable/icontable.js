//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;

Page({
    data:{
        prefix:'',
        name:'',
        imageUrl:'',
        isShowBook:false,
        bookDetail:{},
        isShowBook2:false,
        bookDetail2:{}
    },
    onLoad: function (options) {
        var imageUrl;
        if (app.globalData.tablename == 'npdp') {
            imageUrl = `${site.www}${app.globalData.tablename}image/${options.prefix}${options.name}.png`
        } else {
            imageUrl = `${site.www}${app.globalData.tablename}image/${options.prefix.substr(0,1)} ${options.prefix.substr(1)}${options.name}.png`
        }
        this.setData({
            name:options.name,
            prefix:options.prefix,
            imageUrl:imageUrl
        })

        this.getChaptersData()
        if (app.globalData.tablename == 'pmp') {
            this.getChaptersData2()            
        }
    },
    showBigImg: function (e) {
        wx.previewImage({
            current: e.currentTarget.dataset.url, // 当前显示图片的http链接
            urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
        })
    },
    getChaptersData:function(){
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: site.m + `chaptersPosition/${app.globalData.tablename}book?name=${that.options.prefix}${that.options.name}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data.length) {
                        that.setData({
                            isShowBook:true,
                            bookDetail:res.data.data[0]
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
    getChaptersData2:function(){
        var that = this
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: site.m + `chaptersPosition/${app.globalData.tablename}book2?name=${that.options.prefix}${that.options.name}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data.length) {
                        that.setData({
                            isShowBook2:true,
                            bookDetail2:res.data.data[0]
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
    bookClick: function (e) {
        var albumid = this.data.bookDetail.contentList[0].albumId
        var albumid2 = this.data.bookDetail.contentList[0].albumId2
        var albumid3 = this.data.bookDetail.contentList[0].albumId3
        var albumid4 = this.data.bookDetail.contentList[0].albumId4
        
        wx.navigateTo({
            url: `/pages/chaptersdetail/chaptersdetail?imagename=${this.options.name}&albumid=${albumid}&albumid2=${albumid2}&albumid3=${albumid3}&albumid4=${albumid4}`
        })
    },
    bookClick2: function (e) {
        var albumid = this.data.bookDetail2.contentList[0].albumId
        var albumid2 = this.data.bookDetail2.contentList[0].albumid2
        var albumid3 = this.data.bookDetail2.contentList[0].albumId3
        var albumid4 = this.data.bookDetail2.contentList[0].albumId4
        wx.navigateTo({
            url: `/pages/chaptersdetail/chaptersdetail?imagename=${this.options.name}&book2=true&albumid=${albumid}&albumid2=${albumid2}&albumid3=${albumid3}&albumid4=${albumid4}`
        })
    }
})