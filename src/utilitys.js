/**
 * 把毫秒数转换成 分钟：秒，秒数2位补齐
 * @param {Number} time 毫秒
 */
function formatTime(time) {
  time /= 1000
  const minute = Math.floor(time / 60)
  const second = Math.floor(time -  minute * 60)
  return second > 9 ? minute + ":"+ second : minute + ":0"+ second 
}
/**
 * 把毫秒数转换成 年-月-日
 * @param {Number} milliseconds 代表日期的毫秒数
 */
function formatDate(milliseconds) {
  const date = new Date(milliseconds)
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
}
/**
 * 把毫秒数转换成 年-月-日 小时：分钟
 * @param {Number} milliseconds 代表日期的毫秒数
 */
function formatDay(milliseconds) {
  const date = new Date(milliseconds)
  return date.getFullYear() + "-" + date.getMonth() + "-"+ date.getDate()
    + " " +date.getHours() + ":" + date.getMinutes()
}
function warn(msg) {
  console.warn(msg)
}
/**
 * 优化过的resize事件
 */
function optimizedResize() {
  var throttle = function(type, name, obj) {
    obj = obj || window
    var running = false
    var func = function() {
      if (running) {
        return
      }
      running = true
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name))
        running = false
      })
    }
    obj.addEventListener(type, func)
  }

  /* init - you can init any event */
  throttle("resize", "optimizedResize")
}
/**
 * 
 * @param {} target 
 * @param {*} type 
 * @param {*} listener 
 * @param {*} addOptions 
 * @param {*} removeOptions 
 */
function addEventListenerOnce(target, type, listener, addOptions, removeOptions) {
  target.addEventListener(type, function fn() {
      target.removeEventListener(type, fn, removeOptions)
      listener.apply(this, arguments, addOptions)
  })
}
function clipImage(imgUrl, width, height) {
  return imgUrl + `?param=${width}y${height}`
}
/**
 * format count to 万， 百万， 千万， 亿， 十亿
 * @param {Number} number The number to format
 */
function formatCount(number) {
  const n = Number(number)
  if (isNaN(n)) return number;
  if (n < Math.pow(10, 4)) {
    return n;
  } else if (n < Math.pow(10, 6)) {
    return (n / Math.pow(10, 4)).toFixed(2) + '万';
  } else if (n < Math.pow(10, 7)) {
    return (n / Math.pow(10, 6)).toFixed(2) + '百万';
  } else if (n < Math.pow(10, 8)) {
    return (n / Math.pow(10, 7)).toFixed(2) + '千万';
    
  } else if (n < Math.pow(10, 9)) {
    return (n / Math.pow(10, 8)).toFixed(2) + '亿';
  } else if (n < Math.pow(10, 10)) {
    return (n / Math.pow(10, 9)).toFixed(2) + '十亿';
  } else if (n < Math.pow(10, 11)) {
    return (n / Math.pow(10, 10)).toFixed(2) + '百亿';
  } else if (n < Math.pow(10, 12)) {
    return (n / Math.pow(10, 11)).toFixed(2) + '千亿';
  }
  return n;
}
/**
 * less than 1 minute, x秒钟以前
 * less than 1 hour, x分钟以前
 * less than 1 day, x小时以前
 * less than 1 month, x天以前
 * less than 1 year, x个月以前
 * else, x年以前
 * @param {Number} milliseconds milliseconds presents date time since January 1, 1970 00:00:00 UTC
 */
function formatDateToBefore(milliseconds) {
  const now = Date.now();
  const delta = now - milliseconds;
  if (delta < 0) {
    return formatDay(milliseconds);
  }
  const oneSecond = 1000;
  const oneMin = oneSecond * 60;
  const oneHour = oneMin * 60;
  const oneDay = oneHour * 12;
  const oneMonth = oneDay * 30;
  const oneYear = oneMonth * 12;
  
  const map = [ oneYear, oneMonth, oneDay, oneHour, oneMin, oneSecond ];
  const a = [ '年以前', '个月以前', '天以前', '小时以前', '分钟以前', '秒钟以前', '刚刚' ];
  for (let i = 0; i < map.length; i++) {
    if (delta >= map[i]) {
      return  i == 0 ? a[i] : Math.round(delta / map[i]) + a[i];
    }
  }
  return a[a.length - 1];
}
/**
 *  arrayJoin([a, b, c, d, e], x), return [a, x, b, x, c, x, d, x, e]
 */
function arrayJoin(array, obj) {
  if (array.length == 0) return array;
  const ret = [array[0]];
  for (let i = 1; i < array.length; i++) {
    ret.push(obj);
    ret.push(array[i]);
  }
  return ret;
}
export {
  formatTime,
  formatDate,
  warn,
  formatDay,
  optimizedResize,
  addEventListenerOnce,
  clipImage,
  formatCount,
  formatDateToBefore,
  arrayJoin,
};
