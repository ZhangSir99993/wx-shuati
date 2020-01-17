//获取应用实例
const app = getApp();
import { site } from "../../api/site.js";
//auth.js
const auth = require('../../api/auth.js');
Component({
  behaviors: [],
  properties: {// 这里定义了isAuthor、isRegister属性，属性值可以在组件使用时指定
    isAuthor: {
      type: Boolean
    },
    isRegister: {
      type: Boolean
    },
    isNextType:{
      type:Boolean
    }
  },
  data: {
    site: site,             //站点配置
    times:'',                    //计时器
    phoneNumber: '',             //电话号码
    phoneNumberS: "",            //加密后的手机号码
    phoneCode: '',               //短信验证码
    num: 60,
    countDownType: true,
    errInfo: "",                 //发短信错误信息
    submitStatus: false,        //防重复提交
    mobileCodeStaus: false,      //控制显示发短信验证码弹窗
    nextTypeObj:{}                 //按钮带过来的数据，下一步的操作

  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function(){},
  moved: function(){},
  detached: function(){},
  ready: function() {},
  methods: {
    //获取用户授权
    getUserInfo: function(e){
      const unionid = wx.getStorageSync("unionid");
      const that = this;
      if (e.currentTarget.dataset.type) {
        that.setData({
          nextTypeObj:e
        })
      }
      if(!unionid){
        wx.setStorage({
            key: "UIencryptedData",
            data: e.detail.encryptedData
        });
        wx.setStorage({
            key: "UIiv",
            data: e.detail.iv
        });
        that.decryptUnionidData(e.detail.iv, e.detail.encryptedData);
      }
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {return;}
      if (app.globalData.userInfo) {
        if(that.data.isRegister){
          that.setData({
            'status.finish': true
          })
          return;
        }
        that._callback();
      }else {
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              // 在没有 open-type=getUserInfo 版本的兼容处理
              wx.getUserInfo({
                success: res => {
                  app.globalData.userInfo = res.userInfo;
                  if(that.data.isRegister){
                    that.setData({
                      'status.finish': true
                    })
                    return;
                  }
                  that._callback();
                }
              })
            } else {

            }
          }
        })
      }
    },
    // 解密微信敏感数据(获取unionid)
    decryptUnionidData: function (iv,en) {
      var that = this,
          session_key = wx.getStorageSync("session_key");
      wx.request({
        url: site.login + 'Miniprogram/Ajax/decryptData',
        method: 'GET',
        header: that.setHeader(),//传在请求的header里
        data: {
            sessionKey: session_key,
            iv: iv,
            encryptedData: en,
            type:'shop'
        },
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status && res.data.result) {
              app.globalData.isAuthorized = false;
              that.setData({
                isAuthor: false
              });
              wx.setStorageSync('unionid', res.data.result.unionId);
            }
          }
        },
        fail: function (err) {
          console.log(err);

        }
      })
    },
    //获取微信手机号
    getPhoneNumber: function (e) {
      var that = this;
      if (e.currentTarget.dataset.type) {
        that.setData({
          nextTypeObj:e
        })
      } 
      that.setData({
        'status.finish':false
      })
      if (e.detail.errMsg.indexOf('getPhoneNumber:ok') == -1) {

      } else {
        wx.setStorage({
            key: "encryptedData",
            data: e.detail.encryptedData
        });
        wx.setStorage({
            key: "iv",
            data: e.detail.iv
        });
        that.decryptData(e.detail.iv,e.detail.encryptedData);
      }
    },
    // 解密微信敏感数据(获取手机号)
    decryptData: function (iv,en) {
      var that = this,
          session_key = wx.getStorageSync("session_key");
      wx.request({
        url: site.login + 'Miniprogram/Ajax/decryptData',
        method: 'GET',
        header: that.setHeader(),//传在请求的header里
        data: {
            sessionKey: session_key,
            iv: iv,
            encryptedData: en,
            type:'shop'
        },
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status) {
                if (res.data.result && res.data.result.phoneNumber) {
                    that.setData({
                        phoneNumber: res.data.result.phoneNumber,
                        phoneNumberS: res.data.result.phoneNumber.substr(0, 3) + "****" + res.data.result.phoneNumber.substr(7)
                    });
                    that.sendMobile();
                }else {
                  that.setData({
                    isRegister: false
                  })
                }
            } else {
              wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: res.data.errInfo,
                  success: function (res) {
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
          console.log(err);

        }
      })
    },
    //发送短信验证码
    sendMobile: function () {
      var that = this;
      wx.request({
        url: site.login + 'Miniprogram/Ajax/sendMobileCheckCodeByQuickBuy',
        method: 'GET',
        header: that.setHeader(),//传在请求的header里
        data: {
            mobile: that.data.phoneNumber
        },
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status) {
              that.setData({
                  mobileCodeStaus: true,
                  countDownType: true
              });
              that.countDown(60);
            } else {
              wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: res.data.errInfo,
                  success: function (res) {
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
          console.log(err);
        }
      })
    },
    //获取短信验证码清空错误
    bindKeyInput: function (e) {
      var that = this;
      this.setData({
        phoneCode: e.detail.value
      });
      that.setData({
        errInfo: ""
      });
    },
    //注册
    register: function () {
      var that = this,
          openid = wx.getStorageSync("openid"),
          unionid = wx.getStorageSync("unionid"),
          t_sharer = wx.getStorageSync("t_sharer");
      if (!that.checkPhoneCode()) {return;};
      if (that.data.submitStatus) {return;};
      that.setData({
        submitStatus: true
      });
      wx.request({
        url: site.login + 'Miniprogram/Ajax/loginByQuickBuy',
        method: 'POST',
        header: that.setHeader(),//传在请求的header里
        data: {
            mobile: that.data.phoneNumber,
            checkCode: that.trim(that.data.phoneCode, 'g'),
            openId: openid,
            unionId: unionid,
            type:'shop',
            t_sharer:t_sharer
        },
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status) {
              that.setData({
                  mobileCodeStaus: false
              });
              if (res.data.result && res.data.result.sessionId) {
                wx.setStorage({key: "sessionId", data: res.data.result.sessionId});
                wx.setStorageSync('userId', res.data.result.userInfo.userId);
                wx.removeStorageSync('session_key');
                wx.reportAnalytics('register', {});// 注册成功事件
                that.setData({
                  isRegister: false
                })
                that._callback();
              }
            } else {
              that.setData({
                errInfo: res.data.errInfo
              });
              // 注册失败统计
              wx.reportAnalytics('register_faild', {
                fail_message: res.data.errInfo,
                openid: openid || '无',
                unionid: unionid || '无',
                page: 'components',
              });
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
          console.log(err);
        },
        complete: function () {
          that.setData({
              submitStatus: false
          })
        }
      })
    },
    //倒计时
    countDown: function (num) {
      var that = this,
          num = num;
      var CountDowning = function () {
        if (num > 0) {
          --num;
          that.setData({
            num: num
          });
        } else {
          clearInterval(timer);
          that.setData({
            countDownType: false,
            num: 60
          });
        }
      };
      var timer = setInterval(CountDowning, 1000);
    },
    //短信验证码检测
    checkPhoneCode: function () {
      var that = this;
      var code = that.trim(that.data.phoneCode, 'g');
      if (code && code.length > 6) {
        that.setData({
            errInfo: "短信验证码必须为6位数字"
        });
        return false;
      };
      if (code && code.length < 6) {
        that.setData({
            errInfo: "短信验证码必须为6位数字"
        });
        return false;
      };
      if (!code) {
        that.setData({
            errInfo: "短信验证码不能为空"
        });
        return false;
      }
      return true;
    },
    closemobileCode: function () {
      var that = this;
      that.setData({
        mobileCodeStaus: false
      });
    },
    trim: function (str, is_global) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (is_global.toLowerCase() == "g") {
          result = result.replace(/\s/g, "");
      }
      return result;
    },
    setHeader: function () {
      var header = auth.setHeader();
      return header;
    },
    _callback: function(){
      //触发取消回调
      this.triggerEvent("callback",this.data.nextTypeObj);
    }
  }
})
