// pages/demo/demo.js
//获取应用实例
const app = getApp()
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
        itemList: [],
        chooseList: [],
        isFromRecord: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //创建并返回绘图上下文context对象。
        var cxt_arc = wx.createCanvasContext('canvasCircle');
        cxt_arc.setLineWidth(10);
        cxt_arc.setStrokeStyle('#edf2f9');
        cxt_arc.setLineCap('round');

        cxt_arc.beginPath();
        cxt_arc.arc(90, 90, 80, 0, 2 * Math.PI, false);
        cxt_arc.stroke();
        cxt_arc.draw();
        this.init(options);
    },
    init: function (options) {
        if (options.exercise_record) { //从练习记录页进来的
            var exercise_record = JSON.parse(options.exercise_record);
            this.data.chooseList = exercise_record.chooseList;
            var rightCount = 0,
                tempAnswerList = exercise_record.currentAnswerList;
            for (let index = 0; index < tempAnswerList.length; index++) {
                if (tempAnswerList[index] == 1) {
                    rightCount++
                }
            }
            this.setData({
                rightCount: rightCount,
                scale: (rightCount / tempAnswerList.length) * 2,
                itemList: tempAnswerList,
                isFromRecord: true
            })
            this.drawCircle();
        } else {
            var answer_List = wx.getStorageSync(options.albumId) || []; //获取当前章节的答题列表
            if (answer_List.length) {
                var rightCount = 0,
                    tempAnswerList = answer_List[answer_List.length - 1].currentAnswerList;
                for (let index = 0; index < tempAnswerList.length; index++) {
                    if (tempAnswerList[index] == 1) {
                        rightCount++
                    }
                }
                this.setData({
                    rightCount: rightCount,
                    scale: (rightCount / tempAnswerList.length) * 2,
                    itemList: tempAnswerList
                })
                this.drawCircle();
            }
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
    tagClick: function (e) {
        if (this.options.exercise_record) {
            wx.navigateTo({
                url: `/pages/analysis/analysis?exercise_record=${this.options.exercise_record}&current=${e.currentTarget.dataset.index}&isVip=${this.options.isVip}`
            });
        } else {
            wx.navigateTo({
                url: `/pages/analysis/analysis?albumId=${this.options.albumId}&current=${e.currentTarget.dataset.index}&isVip=${this.options.isVip}`
            });
        }
    },
    //全部题目解析
    analyseClick: function () {
        if (this.options.exercise_record) {
            wx.navigateTo({
                url: `/pages/analysis/analysis?exercise_record=${this.options.exercise_record}&isVip=${this.options.isVip}`
            });
        } else {
            wx.navigateTo({
                url: `/pages/analysis/analysis?albumId=${this.options.albumId}&isVip=${this.options.isVip}`
            });
        }
    },
    //继续联系
    continueClick: function () {
        wx.navigateTo({
            url: `/pages/detail/detail?albumId=${this.options.albumId}&isVip=${this.options.isVip}`
        });
    },
    //错题解析
    errAnalyseClick: function () {
        wx.navigateTo({
            url: `/pages/analysis/analysis?exercise_record=${this.options.exercise_record}&only_error=true&isVip=${this.options.isVip}`
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
        return {
            title: "刷题100",
            path: "/pages/index/index"
        }
    }
})