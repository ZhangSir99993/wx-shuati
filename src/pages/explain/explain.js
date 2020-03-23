//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
Page({
    data: {
        currentPage: 0,
        pageNum: 15,
        isHaveMore: true,
        isLoading:false,
        title:'',
        itemList:[]
    },
    onLoad: function () {
        this.initData()
    },
    initData: function (more) {
        var that = this
        that.setData({
            isLoading:true
        })
        var url = that.options.title;
        if (url=='keyword') {
            url += `/${app.globalData.tablename}`
        }else if(url=='abbreviate'){
            url += `/${app.globalData.tablename}`
        }
        wx.request({
            url: site.m + url,
            method: 'POST',
            dataType: 'json',
            data:{
                currentPage: more ? that.data.currentPage : 0,
                pageNum: that.data.pageNum
            },
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            title:that.options.title,
                            itemList: more ? that.data.itemList.concat(res.data.data) : res.data.data,
                        })
                    } else {
                        that.data.isHaveMore = false
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
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                that.setData({
                    isLoading:false
                })
            }
        })
    },
    detailClick: function (e) {
        switch (this.options.title) {
            case 'knowledge':
                wx.navigateTo({
                    url: `/pages/knowledge/knowledge?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'process':   
                wx.navigateTo({
                    url:`/pages/process/process?name=${e.currentTarget.dataset.name}&detail=${JSON.stringify(this.data.itemList[e.currentTarget.dataset.index])}`
                })
                break;
            case 'inputoutput':   
                wx.navigateTo({
                    url:`/pages/inputoutput/inputoutput?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'keyword':   
                wx.navigateTo({
                    url:`/pages/keyword/keyword?name=${e.currentTarget.dataset.name}&detail=${JSON.stringify(this.data.itemList[e.currentTarget.dataset.index])}&keyword=true`
                })
                break;
            case 'abbreviate':   
                wx.navigateTo({
                    url:`/pages/keyword/keyword?name=${e.currentTarget.dataset.name}&detail=${JSON.stringify(this.data.itemList[e.currentTarget.dataset.index])}`
                })
                break;
            default:
                
                break;
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.initData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isHaveMore) {
            this.data.currentPage++;
            this.initData(true)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var that = this
        var path = `pages/explain/explain?title=${that.options.title}`
        return {
            title: '名词解释',
            path: path
        }
    }
})