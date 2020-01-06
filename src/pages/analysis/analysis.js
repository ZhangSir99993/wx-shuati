const site = require('../../api/site.js').site;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        itemList: [],
        chapters: '',
        currentAnswerList: [],
        showMarkView: false,
        duration: 200,
        currentPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var error_subject = wx.getStorageSync("error_subject")||[]; //获取全部错题集(数组)
        if (error_subject.length) {
            this.setData({
                itemList:error_subject.reverse(),
                current:options.current
            },function(){
                that.setData({
                    chapters:that.data.itemList[options.current].albumId
                })
            })
        }
        return;
        var answer_List = wx.getStorageSync(this.options.albumid) || []; //获取当前章节的答题列表
        if (answer_List.length) {
            this.data.currentAnswerList = answer_List[answer_List.length - 1];
            this.data.current = 0
            this.data.currentPage = answer_List.length - 1;
        }
        this.init(this.options.albumid)
    },
    init: function (albumid) {
        var that = this
        wx.request({
            url: site.m + "detail/npdp",
            method: 'POST',
            data: {
                albumId: albumid,
                currentPage: that.data.currentPage
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        that.setData({
                            current: that.data.current,
                            itemList: res.data.data,
                            chapters: that.options.albumid,
                            currentAnswerList: that.data.currentAnswerList
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
            complete: function () {}
        })
    },

    bindchange: function (e) {
        this.setData({
            current: e.detail.current,
            chapters:this.data.itemList[e.detail.current].albumId
        })
    },
    markShowClick: function () {
        var animation = wx.createAnimation({
            duration: 500, //动画持续时间500ms
            timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
            delay: 0 //动画延迟时间0ms
        })
        this.animation = animation;
        animation.bottom("-100%").step();
        this.setData({
            showMarkView: true,
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.bottom(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 0);
    },
    markHideClick: function () {
        var animation = wx.createAnimation({
            duration: 500, //动画持续时间500ms
            timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
            delay: 0 //动画延迟时间0ms
        })
        this.animation = animation;
        animation.bottom(0).step();
        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.bottom("-100%").step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 0)
        setTimeout(function () {
            this.setData({
                showMarkView: false
            })
        }.bind(this), 400)
    },
    tagClick: function (e) {
        var that = this
        this.setData({
            duration: 0
        }, function () {
            that.setData({
                duration: 200,
                current: e.currentTarget.dataset.current
            })
        })
        this.markHideClick();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})