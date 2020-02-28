//获取应用实例
const app = getApp()
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
        chooseList: [],
        showMarkView: false,
        duration: 200,
        currentPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var answer_List = wx.getStorageSync(this.options.albumId) || []; //获取当前章节的答题列表
        if (answer_List.length) {
            this.data.currentAnswerList = answer_List[answer_List.length - 1].currentAnswerList;
            this.data.chooseList = answer_List[answer_List.length - 1].chooseList;

            for (let index = 0; index < this.data.currentAnswerList.length; index++) {
                if (this.data.currentAnswerList[index]) {
                    this.data.current = index + 1
                }
            }
            if (this.data.current >= this.data.currentAnswerList.length) {
                this.data.currentPage = answer_List.length;
                this.data.currentAnswerList = []
                this.data.chooseList = []
                this.data.current = 0
            } else {
                this.data.currentPage = answer_List.length - 1;
            }
        }
        this.initData(this.options.albumId)
    },
    initData: function (albumId) {
        var that = this,
            url = site.m + "detail/" + app.globalData.tablename,
            pageNum = 15;
        if (that.options.isVip && that.options.isVip != 'undefined') {
            if (!url.includes('vip')) {
                url += 'vip'
            }
            pageNum = 100
        }
        wx.showLoading({
            title: '加载中...'
        })
        wx.request({
            url: url,
            method: 'POST',
            data: {
                albumId: albumId,
                currentPage: that.data.currentPage,
                pageNum: pageNum
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.code == 200) {
                    if (res.data.data && res.data.data.length) {
                        if (!that.data.currentAnswerList.length) {
                            that.data.currentAnswerList.length = res.data.data.length
                            that.data.chooseList.length = res.data.data.length
                            for (let index = 0; index < that.data.currentAnswerList.length; index++) {
                                that.data.currentAnswerList[index] = 0;
                                that.data.chooseList[index] = '';
                            }
                        }
                        if (that.options.isVip && that.options.isVip != 'undefined') {
                            that.setData({
                                current: that.data.current,
                                chapters: that.options.albumId,
                                itemList: res.data.data.slice(0, 10)
                            }, function () {
                                that.setData({
                                    itemList: res.data.data,
                                    currentAnswerList: that.data.currentAnswerList,
                                    chooseList: that.data.chooseList
                                })
                            })

                        } else {
                            that.setData({
                                current: that.data.current,
                                itemList: res.data.data,
                                chapters: that.options.albumId,
                                currentAnswerList: that.data.currentAnswerList,
                                chooseList: that.data.chooseList
                            })
                        }

                    } else {
                        wx.showModal({
                            title: '本章节没有更多内容了,是否重新练习?',
                            success(res) {
                                if (res.confirm) {
                                    that.data.currentPage = 0
                                    that.initData(that.options.albumId)
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
            complete: function () {
                wx.hideLoading();
            }
        })
    },
    answerClick: function (e) {
        var that = this
        var current = e.currentTarget.dataset.current,
            answer = e.currentTarget.dataset.answer;
        var right = 0;
        if (answer == this.data.itemList[current].correct) {
            right = 1
        } else {
            right = 2
        }
        var key = `currentAnswerList[${current}]`
        var item = `itemList[${current}].select`
        var choose = `chooseList[${current}]`
        this.setData({
            current: current + 1,
            [key]: right,
            [item]: answer,
            [choose]: answer
        })
        if (this.data.current >= this.data.itemList.length) {
            this.setData({
                current: this.data.current - 1,
            })
            var temCount = 0;
            for (let index = 0; index < this.data.currentAnswerList.length; index++) {
                if (this.data.currentAnswerList[index] == 0) {
                    temCount++;
                }
            }
            if (temCount) {
                wx.showModal({
                    title: '提交答案',
                    content: `共${this.data.itemList.length}道题，还有${temCount}道未作答`,
                    cancelText: '取消',
                    confirmText: '提交',
                    success(res) {
                        if (res.confirm) {
                            that.submitClick();
                        } else if (res.cancel) {
                            // that.markShowClick();
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提交答案',
                    content: `共${this.data.itemList.length}道题，您已全部作答`,
                    cancelText: '取消',
                    confirmText: '提交',
                    success(res) {
                        if (res.confirm) {
                            that.submitClick();
                        } else if (res.cancel) {
                            // that.markShowClick();
                        }
                    }
                })
            }
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
        for (let index = 0; index < this.data.currentAnswerList.length; index++) {
            this.data.currentAnswerList[index] = 0;
            this.data.chooseList[index] = 0;
        }
        this.setData({
            current: 0,
            currentAnswerList: this.data.currentAnswerList,
            chooseList: this.data.chooseList
        })
        this.markHideClick();
    },
    submitClick: function () {
        this.saveExerciseRecordData();
        if (this.data.currentAnswerList.includes(1) || this.data.currentAnswerList.includes(2)) {
            wx.redirectTo({
                url: `/pages/result/result?albumId=${this.options.albumId}&isVip=${this.options.isVip}`
            })
            this.markHideClick();
        }else{
            wx.showToast({
                title:"还没答题，无法提交",
                icon:'none'
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
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.saveData();
    },
    saveData: function () {
        if (this.data.currentAnswerList.includes(1) || this.data.currentAnswerList.includes(2)) {
            try {
                var tempKey = `${this.options.albumId}`;
                var answer_List = wx.getStorageSync(tempKey) || []; //获取当前章节的答题列表
                if (this.data.currentPage == 0) {
                    var obj = {
                        currentAnswerList: this.data.currentAnswerList,
                        chooseList: this.data.chooseList
                    }
                    wx.setStorageSync(tempKey, [obj])
                } else {
                    if (this.data.currentPage < answer_List.length) {
                        var obj = {
                            currentAnswerList: this.data.currentAnswerList,
                            chooseList: this.data.chooseList
                        }
                        answer_List[this.data.currentPage] = obj;
                    } else {
                        var obj = {
                            currentAnswerList: this.data.currentAnswerList,
                            chooseList: this.data.chooseList
                        }
                        answer_List.push(obj)
                    }
                    wx.setStorageSync(tempKey, answer_List)
                }
            } catch (e) {}
        }
    },
    saveExerciseRecordData: function () {
        if (this.data.currentAnswerList.includes(1) || this.data.currentAnswerList.includes(2)) {
            try {
                //添加错题到错题集
                var error_subject = wx.getStorageSync("error_subject_" + app.globalData.tablename) || []; //获取全部错题集(数组)
                var error_id = wx.getStorageSync("error_id_" + app.globalData.tablename) || []; //获取全部错题集id(数组)
                for (let index = 0; index < this.data.itemList.length; index++) {
                    const element = this.data.itemList[index];
                    //如果存在错题
                    if (element.select && (element.select != element.correct)) {
                        //如果错题集里存在该错题
                        if (error_id.includes(element.id)) {
                            //找到改错题，修改对应的错误答案
                            error_subject.forEach(item => {
                                if (item.id == element.id) {
                                    item.select = element.select //更新错误答案
                                }
                            });
                        } else { //如果不存在就新增该错题
                            element.time = new Date().toLocaleString().split(' ')[0];
                            error_subject.push(element)
                            error_id.push(element.id)
                        }
                    }
                }
                wx.setStorageSync("error_subject_" + app.globalData.tablename, error_subject)
                wx.setStorageSync("error_id_" + app.globalData.tablename, error_id)
                //添加到练习记录
                var exercise_record_list = wx.getStorageSync("exercise_record_list_" + app.globalData.tablename) || []; //获取全部练习记录(数组)
                var rightCount = 0;
                for (let index = 0; index < this.data.currentAnswerList.length; index++) {
                    if (this.data.currentAnswerList[index] == 1) {
                        rightCount++
                    }
                }

                var obj = {
                    tablename: app.globalData.tablename,
                    albumId: this.options.albumId,
                    currentAnswerList: this.data.currentAnswerList,
                    chooseList: this.data.chooseList,
                    currentPage: this.data.currentPage,
                    rightCount: rightCount,
                    time: new Date().toLocaleString().split(' ')[0]
                }
                if (this.options.isVip && this.options.isVip != 'undefined') {
                    if (!obj.tablename.includes('vip')) {
                        obj.tablename = app.globalData.tablename + 'vip'
                    }
                }
                exercise_record_list.push(obj);
                wx.setStorageSync("exercise_record_list_" + app.globalData.tablename, exercise_record_list)
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
        return {
            title: "刷题100",
            path: "/pages/index/index"
        }
    }
})