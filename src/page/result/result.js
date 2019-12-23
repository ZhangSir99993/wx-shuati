// page/demo/demo.js
var varName;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        site: "http://localhost",
        url: ':9090/detail/',
        scale: 0,
        allAnswerList: {},
        currentAnswerList: [],
        rightCount:0,
        itemList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.options.albumid = '第一章 新产品开发战略'
        this.data.allAnswerList = wx.getStorageSync('allAnswerList');
        if (this.data.allAnswerList && this.data.allAnswerList[this.options.albumid]) {
            this.setData({
                currentAnswerList: this.data.allAnswerList[this.options.albumid]
            })
            this.init(this.options.albumid)
        }

        //创建并返回绘图上下文context对象。
        var cxt_arc = wx.createCanvasContext('canvasCircle');
        cxt_arc.setLineWidth(10);
        cxt_arc.setStrokeStyle('#edf2f9');
        cxt_arc.setLineCap('round');

        cxt_arc.beginPath();
        cxt_arc.arc(90, 90, 80, 0, 2 * Math.PI, false);
        cxt_arc.stroke();
        cxt_arc.draw();

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
                    var temData = res.data.data;
                    var temLength = that.data.currentAnswerList.length;
                    var rightCount = 0
                    for (let index = 0; index < temData.length; index++) {
                        const element = temData[index];
                        if (index<temLength) {
                            if (element.correct == that.data.currentAnswerList[index]) {
                                element.right = 1;//正确
                                rightCount++;
                            }else{
                                element.right = 2;//错误
                            }
                        }else{
                            element.right = 0;//没答题
                        }
                    }
                    that.setData({
                        rightCount:rightCount,
                        scale:(rightCount/temData.length)*2,
                        itemList: temData
                    })
                    that.drawCircle();
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

    drawCircle: function () {
        clearInterval(varName);
        var step = 1,
            startAngle = 0.5 * Math.PI,
            endAngle = 0;
        var animation_interval = 1000,
            n = 1;
        var that = this;
        var animation = function () {
            if (step <= n) {
                endAngle = step * that.data.scale * Math.PI / n + 0.5 * Math.PI;
                drawArc(startAngle, endAngle);
                step++;
            } else {
                clearInterval(varName);
            }
        };
        varName = setInterval(animation, animation_interval);

        function drawArc(s, e) {

            var ctx = wx.createCanvasContext('canvasArcCir');
            ctx.setFillStyle('white');
            ctx.clearRect(0, 0, 180, 180);
            var x = 90,
                y = 90,
                radius = 80;
            ctx.setLineWidth(10);
            ctx.setLineCap('round');

            ctx.beginPath();
            var gradient = ctx.createLinearGradient(0, 180, 180, 0);
            gradient.addColorStop("0", "#f07f65");
            gradient.addColorStop("0.25", "#f08063");
            gradient.addColorStop("0.5", "#f3ba6f");
            gradient.addColorStop("0.75", "#94e143");
            gradient.addColorStop("1.0", "#7de433");
            //用渐变进行填充
            ctx.setStrokeStyle('#1292ff');
            ctx.setStrokeStyle(gradient);
            ctx.arc(x, y, radius, s, e, false);
            // ctx.setFillStyle(gradient)
            // ctx.fillRect(0, 0, 200, 200)
            ctx.stroke()
            ctx.draw()
        }

    },
    continueClick:function(){
        wx.navigateTo({
            url: `/page/detail/detail?albumid=${this.options.albumid}`
        });
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