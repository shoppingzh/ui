;(function() {

  const listeners = []

  document.body.onscroll = function(e) {
    listeners.forEach(function(listener) {
      listener(e)
    })
  }

  function onBodyScroll(listener) {
    listeners.push(listener)
  }

  function throttle(fn, time) {
    var timer = null
    var runnable = true
    return function() {
      var _this = this, args = Array.prototype.slice.call(arguments)
      if (!runnable) {
        return
      }
      runnable = false
      fn.call(_this, args)
      timer = setTimeout(function() {
        runnable = true
        clearTimeout(timer)
      }, time)
    }
  }

  function ScrollNavbar(options) {
    var opts = options || {}
    this.upEl = opts.up
    this.downEl = opts.down
    this.init()
  }

  ScrollNavbar.prototype = {
    init: function() {
      this.maxOffset = 50
      this.setDir(true)
      onBodyScroll(throttle(this.onScroll.bind(this), 50))
    },
    onScroll: function(e) {
      var scrollTop = document.body.scrollTop
      var offset = scrollTop - this.scrollPosition
      if (Math.abs(offset) > this.maxOffset) {
        this.setDir(offset > 0 ? false : true)
      }
    },
    setDir: function(up) {
      this.up = up
      this.scrollPosition = document.body.scrollTop
      if (up) {
        this.upEl.style.transform = 'translateY(0)'
        this.downEl.style.transform = 'translateY(100%)'
      } else {
        this.upEl.style.transform = 'translateY(-100%)'
        this.downEl.style.transform = 'translateY(0)'
      }
    }
  }

  window.ScrollNavbar = ScrollNavbar


})();