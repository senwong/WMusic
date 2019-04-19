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
function convertToHttps(responseObject) {
  return JSON.parse(JSON.stringify(responseObject).replace(/http:\/\//g, "https://"))
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

export {
  formatTime,
  formatDate,
  warn,
  formatDay,
  convertToHttps,
  optimizedResize,
  addEventListenerOnce,
  clipImage,
};
