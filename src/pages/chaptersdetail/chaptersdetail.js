//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
        bookDetailList: [],
        firstBookDetail: {},
        name:''
    },
    onLoad: function (options) {
        this.getDetailInfo(options.albumid, options.albumid2, options.albumid3, options.albumid4)
    },
    getDetailInfo: function (albumId, albumId2, albumId3, albumId4) {
        var that = this
        var url = site.m + 'chaptersdetail/' + app.globalData.tablename + 'book';
        if (that.options.book2 && that.options.book2 != 'undefined') {
            url += '2'
        }
        wx.request({
            url: url,
            method: 'POST',
            data: {
                albumId: albumId
                // albumId2:albumId2,
                // albumId3:albumId3
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    res.data.data.forEach(element => {
                        if (element && element.albumId2 && albumId2 != 'undefined') {
                            element.albumId2Class = element.albumId2.match(/\d+\.\d/)[0].replace(/\./g, '_')
                        }
                        if (element && element.albumId3 && albumId3 != 'undefined') {
                            element.albumId3Class = element.albumId3.match(/\d+\.\d+\.\d/)[0].replace(/\./g, '_')
                        }
                        if (element && element.albumId4 && albumId4 != 'undefined') {
                            element.albumId4Class = element.albumId4.match(/\d+\.\d+\.\d+\.\d/)[0].replace(/\./g, '_')
                        }
                        if (element && element.content) {
                            element.content = element.content.split(/<img [^>]*src=['"]([^'"]+)[^>]*>/)
                        }
                    });
                    that.setData({
                        name: that.options.name,
                        firstBookDetail: res.data.data[0],
                        bookDetailList: res.data.data
                    }, function () {
                        var toView;
                        if (albumId4 && albumId4 != 'null' && albumId4 != 'undefined') {
                            toView = `toView${albumId4.match(/\d+\.\d+\.\d+\.\d/)[0].replace(/\./g,'_')}`
                        } else if (albumId3 && albumId3 != 'null' && albumId3 != 'undefined') {
                            toView = `toView${albumId3.match(/\d+\.\d+\.\d/)[0].replace(/\./g,'_')}`
                        } else if (albumId2 && albumId2 != 'null' && albumId2 != 'undefined') {
                            toView = `toView${albumId2.match(/\d+\.\d/)[0].replace(/\./g,'_')}`
                        }
                        if (toView) {
                            that.setData({
                                toView: toView
                            })
                        }
                    })
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

            }
        })
    },
    showBigImg: function (e) {
        wx.previewImage({
            current: e.currentTarget.dataset.url, // 当前显示图片的http链接
            urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
        })
    },
})