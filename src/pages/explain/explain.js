//获取应用实例
const app = getApp()
//api.js
const site = require('../../api/site.js').site;
//util.js
const util = require('../../utils/util.js');
var debounce = util.createDebounce(1000);
Page({
    data: {
        currentPage: 0,
        pageNum: 15,
        isHaveMore: true,
        isLoading: false,
        title: '',
        itemList: [],
        defaultList: [],
        keyword: ''

    },
    onLoad: function () {
        this.initData()
    },
    initData: function (more) {
        var that = this
        that.setData({
            isLoading: true
        })
        var url = that.options.title;
        if (url == 'keyword' || url == 'abbreviate' || url == 'icontable') {
            url += `/${app.globalData.tablename}`
        }
        wx.request({
            url: site.m + url,
            method: 'POST',
            dataType: 'json',
            data: {
                currentPage: more ? that.data.currentPage : 0,
                pageNum: that.data.pageNum
            },
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            title: that.options.title,
                            itemList: more ? that.data.itemList.concat(res.data.data) : res.data.data
                        })
                        that.data.defaultList = more ? that.data.itemList.concat(res.data.data) : res.data.data
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
                    isLoading: false
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
                app.globalData.itemDetail = this.data.itemList[e.currentTarget.dataset.index];
                wx.navigateTo({
                    url: `/pages/process/process?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'inputoutput':
                wx.navigateTo({
                    url: `/pages/inputoutput/inputoutput?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'keyword':
                app.globalData.itemDetail = this.data.itemList[e.currentTarget.dataset.index];
                wx.navigateTo({
                    url: `/pages/keyword/keyword?name=${e.currentTarget.dataset.name}&keyword=true`
                })
                break;
            case 'abbreviate':
                app.globalData.itemDetail = this.data.itemList[e.currentTarget.dataset.index];
                wx.navigateTo({
                    url: `/pages/keyword/keyword?name=${e.currentTarget.dataset.name}`
                })
                break;
            case 'icontable':
                wx.navigateTo({
                    url: `/pages/icontable/icontable?name=${e.currentTarget.dataset.name}&prefix=${e.currentTarget.dataset.prefix}`
                })
                break;
            default:

                break;
        }
    },
    //搜索
    searchTap: function () {
        var that = this;
        that.searchBtn();
    },

    searchBtn: function () {
        var that = this;
        if (that.data.keyword.replace(/\s/g, '') == '') {
            wx.showToast({
                title: '请输入搜索内容',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        debounce(() => {
            if (that.data.keyword.length > 50) {
                that.data.keyword = that.data.keyword.slice(0, 50);
            }
            that.searchSuggest(that.data.keyword);
        })
    },
    setKeyWord: function (event) {
        var that = this,
            value = event.detail.value;
        debounce(() => {
            if (event.detail.value.length > 50) {
                value = value.slice(0, 50);
            }
            if (value) {
                that.searchSuggest(value);
            } else {
                that.setData({
                    keyword: '',
                    itemList: that.data.defaultList
                });
            }
        })
    },
    clearKeyWord: function () {
        var that = this;
        that.setData({
            keyword: '',
            searchFocus: true,
            itemList: that.data.defaultList
        });
    },

    searchSuggest: function (value) {
        var that = this;
        if (that.requestTask != null) that.requestTask.abort(); //中断上一次的请求
        that.requestTask = wx.request({
            url: site.m + `searchSuggest/${app.globalData.tablename}`,
            method: 'POST',
            data: {
                subject: that.options.title,
                keyword: value,
                pageNum: 30
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        switch (that.options.title) {
                            case 'knowledge':
                                res.data.data.forEach(element => {
                                    if (element.knowledgeSystem.includes(value)) {
                                        element.colorname = element.knowledgeSystem.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                            case 'process':
                                res.data.data.forEach(element => {
                                    if (element.processGroup.includes(value)) {
                                        element.colorname = element.processGroup.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                            case 'inputoutput':
                                res.data.data.forEach(element => {
                                    if (element.inputoutput.includes(value)) {
                                        element.colorname = element.inputoutput.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                            default:
                                res.data.data.forEach(element => {
                                    if (element.name.includes(value)) {
                                        element.colorname = element.name.replace(value, `<span style="color:red;">${value}</span>`)
                                    }
                                });
                                break;
                        }
                        that.setData({
                            keyword: value,
                            itemList: res.data.data
                        });
                    } else {
                        that.setData({
                            keyword: value,
                            itemList: []
                        });
                    }
                }
            },
            fail: function (err) {
                that.setData({
                    keyword: value,
                    itemList: []
                });
            },
            complete: function (err) {

            }
        })
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
        if (this.data.isHaveMore && !this.data.keyword) {
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