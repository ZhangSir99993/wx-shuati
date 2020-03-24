
const formatDateTime = function(time, format){  
  var t = new Date(time);  
  var tf = function(i){return (i < 10 ? '0' : '') + i};  
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){  
      switch(a){  
          case 'yyyy':  
              return tf(t.getFullYear());  
              break;  
          case 'MM':  
              return tf(t.getMonth() + 1);  
              break;  
          case 'mm':  
              return tf(t.getMinutes());  
              break;  
          case 'dd':  
              return tf(t.getDate());  
              break;  
          case 'HH':  
              return tf(t.getHours());  
              break;  
          case 'ss':  
              return tf(t.getSeconds());  
              break;  
      }  
  })  
};
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year.toString().slice(2), month, day].map(formatNumber).join('.') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeDefault = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year.toString(), month, day].map(formatNumber).join('.') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// YYMMDD
const formatTimeYYMMDD = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year + '年' + month + '月' + day + '日';
}
//year
const formatYear = date => {
  const year = date.getFullYear();
  return year.toString().slice(2);
}
//month
const formatMonth = date => {
  const month = date.getMonth() + 1;
  return month;
}
//day
const formatDay = date => {
  const day = date.getDate();
  return day;
}
//hour
const formatHour = date => {
  const hour = date.getHours()
  return hour;
}
//minute
const formatMinute = date => {
  const minute = date.getMinutes()
  return minute;
}
//second
const formatSecond = date => {
  const second = date.getSeconds()
  return second;
}
//图片加载出错，替换为默认图片
const imageError = (e, that, errImg) => {
  var _errImg = e.currentTarget.dataset.errImg;
  var _objImg = "'" + _errImg + "'";
  var _errObj = {};
  _errObj[_errImg] = errImg;
  //console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg);
  //console.log(_errObj);
  that.setData(_errObj); //注意这里的赋值方式...
}
const string10to64 = (number) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$'.split(''),
      radix = chars.length,
      qutient = +number,
      arr = [];
  do {
      mod = qutient % radix;
      qutient = (qutient - mod) / radix;
      arr.unshift(chars[mod]);
  } while (qutient);
  return arr.join('');
}
const string64to10 = (number_code) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$',
      radix = chars.length,
      number_code = String(number_code),
      len = number_code.length,
      i = 0,
      origin_number = 0;
  while (i < len) {
      origin_number += Math.pow(radix, i++) * chars.indexOf(number_code.charAt(len - i) || 0);
  }
  return origin_number;
}
/**
* [animationActiveDown description]
* @param  {[type]}   that   [方法里的this指针]
* @param  {[type]}   status [状态=> 开始:start,结束:end]
* @param  {Function} fn     [回调函数]
* @return {[type]}          []
*/
//下拉弹框函数
const animationActiveDown = (that, status, fn) => {
  //弹窗
  var animation = wx.createAnimation({
      duration: 200, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  //遮罩
  var animationMark = wx.createAnimation({
      duration: 200, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  if (status == 'start') {
      // animation.top("-100%").step();
      animationMark.opacity(0).step();
      if (fn) {
          fn(animation, animationMark);
      }
      var t = setTimeout(function () {
          animation.top(0).step();
          animationMark.opacity(1).step();
          var ts = setTimeout(() => {
              that.setData({
                  animationData: animation.export(),
                  animationMark: animationMark.export()
              })
              clearTimeout(ts);
          }, 10)
          clearTimeout(t);
      }.bind(that), 0)
  } else if (status == 'end') {
      animation.top(1).step();
      animationMark.opacity(1).step();
      that.setData({
          animationMark: animationMark.export(),
          animationData: animation.export()
      })
      var t = setTimeout(function () {
          // animation.top("-100%").step();
          animationMark.opacity(0).step();
          that.setData({
              animationMark: animationMark.export(),
              animationData: animation.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
      setTimeout(function () {
          if (fn) {
              fn();
          }
      }.bind(that), 200)
  }
}
//上拉弹框函数
const animationActiveUp = (that, status, fn) => {
  //弹窗
  var animation = wx.createAnimation({
      duration: 200, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  //遮罩
  var animationMark = wx.createAnimation({
      duration: 200, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  if (status == 'start') {
      animation.bottom("-100%").step();
      animationMark.opacity(0).step();
      if (fn) {
          fn(animation, animationMark);
      }
      var t = setTimeout(function () {
          animation.bottom(0).step()
          animationMark.opacity(1).step();
          that.setData({
              animationData: animation.export(),
              animationMark: animationMark.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
  } else if (status == 'end') {
      animation.bottom(0).step();
      animationMark.opacity(1).step();
      that.setData({
          animationMark: animationMark.export(),
          animationData: animation.export()
      })
      var t = setTimeout(function () {
          animation.bottom("-100%").step()
          animationMark.opacity(0).step();
          that.setData({
              animationMark: animationMark.export(),
              animationData: animation.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
      setTimeout(function () {
          if (fn) {
              fn();
          }
      }.bind(that), 200)
  }
}
//右拉弹框函数
const animationActiveRight = (that, status, fn) => {
  //弹窗
  var animation = wx.createAnimation({
      duration: 200, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  //遮罩
  var animationMark = wx.createAnimation({
      duration: 200, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  if (status == 'start') {
      animation.right("-100%").step();
      animationMark.opacity(0).step();
      if (fn) {
          fn(animation, animationMark);
      }
      var t = setTimeout(function () {
          animation.right(0).step()
          animationMark.opacity(1).step();
          that.setData({
              animationData: animation.export(),
              animationMark: animationMark.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
  } else if (status == 'end') {
      animation.right(0).step();
      animationMark.opacity(1).step();
      that.setData({
          animationMark: animationMark.export(),
          animationData: animation.export()
      })
      var t = setTimeout(function () {
          animation.right("-100%").step()
          animationMark.opacity(0).step();
          that.setData({
              animationMark: animationMark.export(),
              animationData: animation.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
      setTimeout(function () {
          if (fn) {
              fn();
          }
      }.bind(that), 200)
  }
}

//渐隐渐现效果
const animationActiveOpacity = (that, status, fn) => {
  //遮罩
  var animationMark = wx.createAnimation({
      duration: 300, //动画持续时间500ms
      timingFunction: "ease", //动画以低速开始，然后加快，在结束前变慢
      delay: 0 //动画延迟时间0ms
  })
  if (status == 'start') {
      animationMark.opacity(0).step();
      if (fn) {
          fn(animationMark);
      }
      var t = setTimeout(function () {
          animationMark.opacity(1).step();
          that.setData({
              animationMark: animationMark.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
  } else if (status == 'end') {
      animationMark.opacity(1).step();
      that.setData({
          animationMark: animationMark.export()
      })
      var t = setTimeout(function () {
          animationMark.opacity(0).step();
          that.setData({
              animationMark: animationMark.export()
          })
          clearTimeout(t);
      }.bind(that), 0)
      setTimeout(function () {
          if (fn) {
              fn();
          }
      }.bind(that), 200)
  }
}

// 去空格
const trim = (str, is_g) => {
  const is_global = is_g ? is_g : 'i';
  let result;
  result = str.toString().replace(/(^\s+)|(\s+$)/g, "");
  if (is_global.toLowerCase() == "g") {
      result = result.replace(/\s/g, "");
  }
  return result;
}
/**节流函数
* @param delay 延迟执行毫秒数，默认1000
* * @param immediate true 表立即执行，false 表非立即执行，默认false
* 所谓节流，（默认非立即执行）就是指连续触发事件，函数不会立即执行，并且每 n 秒中只执行一次函数，在停止触发事件后，函数还会再执行一次
* 立即执行版，意思就是指连续触发事件，函数会立即执行，并且每 n 秒中只执行一次函数，在停止触发事件后，函数不会执行
*/
const createThrottle = (delay = 1000, immediate = false) => {
  let timer = null;
  return function throttle(fn) {
      if (immediate) {
          if (!timer) {
              // fn && fn();
              fn.apply(this, arguments)
              timer = setTimeout(() => {
                  timer = null;
              }, delay)
          }
      } else {
          if (!timer) {
              timer = setTimeout(() => {
                  timer = null;
                  // fn && fn();
                  fn.apply(this, arguments)
              }, delay);
          }
      }
  }
}
/**防抖函数
* @param delay 延迟执行毫秒数
* @param immediate true 表立即执行，false 表非立即执行，默认false
* 所谓防抖，（默认非立即执行），意思是指触发事件后在n秒后函数才执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
* 立即执行版，意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
*/
const createDebounce = (delay = 1000, immediate = false) => {
  let timer = null;
  return function debounce(fn) {
      if (timer) {
          clearTimeout(timer);
      }
      if (immediate) {
          if (!timer) {
              // fn && fn();
              fn.apply(this, arguments)
          }
          timer = setTimeout(() => {
              timer = null;
          }, delay)
      } else {
          timer = setTimeout(() => {
              // fn && fn();
              fn.apply(this, arguments)
          }, delay);
      }
  }
}
module.exports = {
  formatTime: formatTime,
  formatDateTime:formatDateTime,
  formatTimeDefault: formatTimeDefault,
  imageError: imageError,
  string10to64: string10to64,
  string64to10: string64to10,
  animationActiveDown: animationActiveDown,
  animationActiveUp: animationActiveUp,
  animationActiveRight: animationActiveRight,
  animationActiveOpacity: animationActiveOpacity,
  formatTimeYYMMDD: formatTimeYYMMDD,
  formatYear: formatYear,
  formatMonth: formatMonth,
  formatDay: formatDay,
  formatHour: formatHour,
  formatMinute: formatMinute,
  formatSecond: formatSecond,
  trim: trim,
  createThrottle: createThrottle,
  createDebounce: createDebounce
}