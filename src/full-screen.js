export default {
  start() {
    const el = document.documentElement,
      rfs = // for newer Webkit and Firefox
        el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
    if (typeof rfs != 'undefined' && rfs) {
      rfs.call(el)
    }
  },
  end() {
    const el = document.documentElement
    const requestMethod =
      el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen
    if (requestMethod) {
      requestMethod.call(el)
    }
  },
}
