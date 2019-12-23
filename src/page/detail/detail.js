Page({
    /**
     * 页面的初始数据
     */
    data: {
        site: "http://localhost",
        url: ':9090/detail/',
        current: 0,
        itemList: [{
            question: '精益新产品开发的一个原则是？',
            A: '顾客定义价值',
            B: '项目管理可以使风险最小化',
            C: '产品框架是动力',
            D: '高层管理者参与整个过程',
            correct: 'B',
            analysis: `见教材3.2.3精益产品开发。<br>精益原则<br>(1) 确定客户定义的价值——区分哪些能为顾客增值，哪些纯属浪费<br>(2) 尽最大努力探索不同的解决方案<br>(3) 创造顺畅的产品开发流程流<br>(4) 遵照严格的标准，以减少变异<br>(5) 首席工程师全程参与`,
            single: 1
        }],
        chapters: '',
        allAnswerList: {},
        currentAnswerList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.init(this.options.albumid)
        this.data.allAnswerList = wx.getStorageSync('allAnswerList');   
        if (this.data.allAnswerList && this.data.allAnswerList[this.options.albumid]) {
            this.data.currentAnswerList = this.data.allAnswerList[this.options.albumid]
            this.setData({
                current:this.data.currentAnswerList.length
            })
        }
    },
    init: function (albumid) {
        var that = this
        wx.request({
            url: that.data.site + that.data.url + "npdp",
            method: 'POST',
            data: {
                albumId: albumid
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        itemList: res.data.data,
                        chapters: that.options.albumid
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
            complete: function () {}
        })
    },
    answerClick: function (e) {
        this.setData({
            current: e.currentTarget.dataset.current + 1
        })
        this.data.currentAnswerList.push(e.currentTarget.dataset.answer)
        if (this.data.current>=this.data.itemList.length) {
            wx.navigateTo({
                url: `/page/result/result?albumid=${this.options.albumid}`
            })
        }
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
        try {
            var tempKey = `${this.options.albumid}`
            var answerList = {
                [tempKey]: this.data.currentAnswerList
            }
            console.log("onHide",answerList);
            
            wx.setStorageSync('allAnswerList', answerList)
        } catch (e) {}
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        try {
            var tempKey = `${this.options.albumid}`
            var answerList = {
                [tempKey]: this.data.currentAnswerList
            }
            console.log(answerList);
            
            wx.setStorageSync('allAnswerList', answerList)
        } catch (e) {}
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