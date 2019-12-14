Page({
    /**
     * 页面的初始数据
     */
    data: {
        site: "http://dev.xinyunc.com",
        url: ':8081/audioDetail',
        current:0,
        itemList: [{
            question: '精益新产品开发的一个原则是？',
            A: '顾客定义价值',
            B:'项目管理可以使风险最小化',
            C:'产品框架是动力',
            D:'高层管理者参与整个过程',
            correct:'B',
            analysis:`见教材3.2.3精益产品开发。<br>精益原则<br>(1) 确定客户定义的价值——区分哪些能为顾客增值，哪些纯属浪费<br>(2) 尽最大努力探索不同的解决方案<br>(3) 创造顺畅的产品开发流程流<br>(4) 遵照严格的标准，以减少变异<br>(5) 首席工程师全程参与`,
            single:1
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    init: function () {
        var that = this
        wx.request({
            url: that.data.site + that.data.url,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                console.log(res)
                if (res.data.statusCode == 200) {
                    that.setData({
                        itemList: res.data.data
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