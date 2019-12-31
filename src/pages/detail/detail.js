const site = require('../../api/site.js').site;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        itemList: [],
        chapters: '',
        tempAnswerList: [],
        showMarkView: false,
        duration: 200,
        currentPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var temObj = wx.getStorageSync(this.options.albumid);
        if (temObj && temObj.answerList) {
            this.data.tempAnswerList = temObj.answerList
            for (let index = 0; index < this.data.tempAnswerList.length; index++) {
                if (this.data.tempAnswerList[index]) {
                    this.data.current = index + 1
                }
            }
            if (this.data.current >= this.data.tempAnswerList.length) {
                this.data.currentPage = temObj.currentPage + 1;
                this.data.tempAnswerList = []
                this.data.current = 0
            } else {
                this.data.currentPage = temObj.currentPage
            }
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
                        if (!that.data.tempAnswerList.length) {
                            that.data.tempAnswerList.length = res.data.data.length
                            for (let index = 0; index < that.data.tempAnswerList.length; index++) {
                                that.data.tempAnswerList[index] = 0;
                            }
                        }
                        that.setData({
                            current: that.data.current,
                            itemList: res.data.data,
                            chapters: that.options.albumid,
                            tempAnswerList: that.data.tempAnswerList
                        })
                    } else {
                        wx.showModal({
                            title: '本章节没有更多内容了,是否重新练习?',
                            success(res) {
                                if (res.confirm) {
                                    that.data.currentPage = 0
                                    that.init(that.options.albumid)
                                } else if (res.cancel) {
                                    wx.navigateBack()
                                }
                            }
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
    answerClick: function (e) {
        var current = e.currentTarget.dataset.current,
            answer = e.currentTarget.dataset.answer;
        var right = 0;
        if (answer == this.data.itemList[current].correct) {
            right = 1
        } else {
            right = 2
        }
        var key = `tempAnswerList[${current}]`
        this.setData({
            current: current + 1,
            [key]: right
        })
        if (this.data.current >= this.data.itemList.length) {
            wx.redirectTo({
                url: `/pages/result/result?albumid=${this.options.albumid}`
            })
        }
    },
    bindchange: function (e) {
        this.setData({
            current: e.detail.current
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
    resetClick: function () {
        for (let index = 0; index < this.data.tempAnswerList.length; index++) {
            this.data.tempAnswerList[index] = 0;
        }
        this.setData({
            current: 0,
            tempAnswerList: this.data.tempAnswerList
        })
        this.markHideClick();
    },
    submitClick: function () {
        wx.redirectTo({
            url: `/pages/result/result?albumid=${this.options.albumid}`
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
        this.saveData()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.saveData()
    },
    saveData: function () {
        if (this.data.tempAnswerList.includes(1) || this.data.tempAnswerList.includes(2)) {
            try {
                var tempKey = `${this.options.albumid}`;
                wx.setStorageSync(tempKey, {
                    answerList: this.data.tempAnswerList,
                    currentPage: this.data.currentPage
                })
            } catch (e) {}
        }
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