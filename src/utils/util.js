function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}
var formatDateTime = function(time, format){  
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
/*
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
*/

module.exports = {
  formatTime: formatTime,
  formatDateTime:formatDateTime
}
