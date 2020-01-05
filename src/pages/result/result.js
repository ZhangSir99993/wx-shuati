// pages/demo/demo.js
var varName;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        site: "http://localhost",
        url: ':9090/detail/',
        scale: 0,
        rightCount: 0,
        itemList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        //创建并返回绘图上下文context对象。
        var cxt_arc = wx.createCanvasContext('canvasCircle');
        cxt_arc.setLineWidth(10);
        cxt_arc.setStrokeStyle('#edf2f9');
        cxt_arc.setLineCap('round');

        cxt_arc.beginPath();
        cxt_arc.arc(90, 90, 80, 0, 2 * Math.PI, false);
        cxt_arc.stroke();
        cxt_arc.draw();

        this.init();
    },
    init: function () {
        var temObj = wx.getStorageSync(this.options.albumid);
        if (temObj && temObj.answerList) {
            var rightCount = 0,
                temData = temObj.answerList;
            for (let index = 0; index < temData.length; index++) {
                if (temData[index] == 1) {
                    rightCount++
                }
            }
            this.setData({
                rightCount: rightCount,
                scale: (rightCount / temData.length) * 2,
                itemList: temData
            })
            this.drawCircle();
        }
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
            // var gradient = ctx.createLinearGradient(0, 180, 180, 0);
            // gradient.addColorStop("0", "#f07f65");
            // gradient.addColorStop("0.25", "#f08063");
            // gradient.addColorStop("0.5", "#f3ba6f");
            // gradient.addColorStop("0.75", "#94e143");
            // gradient.addColorStop("1.0", "#7de433");
            //用渐变进行填充
            // ctx.setStrokeStyle(gradient);
            //用单一色进行填充
            ctx.setStrokeStyle('#4db361');
            ctx.arc(x, y, radius, s, e, false);
            // ctx.setFillStyle(gradient)
            // ctx.fillRect(0, 0, 200, 200)
            ctx.stroke()
            ctx.draw()
        }

    },
    analyseClick:function(){
        wx.showToast({
            title:'开发中，敬请期待',
            icon:'none'
        })
    },
    continueClick: function () {
        wx.navigateTo({
            url: `/pages/detail/detail?albumid=${this.options.albumid}`
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