(function() {

  var defaults = {}

  function VolumeIndicator(el, options) {
    this.el = el
    this.bar = this.el.querySelector('.volume-indicator__inner')
    this.options = Object.assign({}, defaults, options)
    this.value = this.getVolume()
    this.factor = (document.body.clientHeight / this.el.clientHeight) * 7
    this.y = null
    this.init()
  }

  VolumeIndicator.prototype.init = function() {
    var _this = this
    this.el.addEventListener('mousedown', function(e) {
      _this.moveStart(e.y)
    }, false)
    document.body.addEventListener('mousemove', throttle(function(e) {
      _this.move(e.y)
    }, 10), false)
    document.body.addEventListener('mouseup', function() {
      _this.moveEnd()
    }, false)

    this.el.addEventListener('touchstart', function(e) {
      e.preventDefault()
      _this.moveStart(e.touches[0].clientY)
    }, false)
    this.el.addEventListener('touchmove', throttle(function(e) {
      _this.move(e.touches[0].clientY)
    }, 10), false)
    this.el.addEventListener('touchend', function() {
      _this.moveEnd()
    }, false)
  }

  VolumeIndicator.prototype.moveStart = function(y) {
    this.y = y
  }

  VolumeIndicator.prototype.move = function(y) {
    if (this.y === null) {
      return
    }
    var offset = (y - this.y) / this.factor
    var value = this.value - offset
    if (value < 0 || value > 100) {
      this.y = y
    }
    
    this.setVolume(value)
  }
  
  VolumeIndicator.prototype.moveEnd = function() {
    this.y = null
  }

  VolumeIndicator.prototype.getVolume = function() {
    return this.bar.clientHeight / this.el.clientHeight * 100
  }

  VolumeIndicator.prototype.setVolume = function(value) {
    if (value < 0) {
      value = 0
    }
    if (value > 100) {
      value = 100
    }
    this.value = value
    this.bar.style.height = (this.value * (this.el.clientHeight / 100)) + 'px'
  }

  window.VolumeIndicator = VolumeIndicator


  function throttle(func, delay) {
    var runnable = true

    return function() {
      if (!runnable) {
        return
      }
      runnable = false
      setTimeout(() => {
        func.apply(this, Array.prototype.slice.call(arguments))
        runnable = true
      }, delay)
    }
  }

})();