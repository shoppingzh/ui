(function() {

  function Tag(el, options) {
    this.el = el
    this.options = options || {}
    this.container = this.options.container || document.body
    this.init()
    this.moveEnd()
  }

  Tag.prototype = {
    init: function() {
      var _this = this
      console.log(this)
      this.el.addEventListener('touchstart', function(e) {
        e.preventDefault()

        var touch = e.touches[0]
        _this.moveStart(touch.clientX, touch.clientY)
      }, false)
      this.el.addEventListener('touchmove', function(e) {
        var touch = e.touches[0]
        _this.move(touch.clientX, touch.clientY)
      }, false)
      this.el.addEventListener('touchend', function(e) {
        _this.moveEnd()
      }, false)
    },
    isLeft: function() {
      var x = this.el.offsetLeft,
          w = this.el.clientWidth,
          cw = this.container.clientWidth
      return (cw / 2) > (x + w / 2)
    },
    isOutOfBounds: function() {
      var x = this.el.offsetLeft,
          y = this.el.offsetTop;
      return x < 0 || x > this.container.clientWidth || y < 0 || y > this.container.clientHeight
    },
    moveStart: function(x, y) {
      this.offset = {
        x: x - this.el.offsetLeft,
        y: y - this.el.offsetTop
      }
      this.el.style.borderRadius = '50%'
    },
    move: function(x, y) {
      this.el.style.left = x - this.offset.x
      this.el.style.top = y - this.offset.y
    },
    moveEnd: function() {
      var isLeft = this.isLeft()
      this.el.style.left = isLeft ? '0' : (this.container.clientWidth - this.el.clientWidth)
      this.el.style.borderRadius = `${isLeft ? '0 50% 50% 0' : '50% 0 0 50%'}`
      var isOutOfBounds = this.isOutOfBounds()
      if (isOutOfBounds) {
        this.el.style.top = this.container.clientHeight / 2 - this.el.clientWidth / 2
      }
    }
  }

  window.Tag = Tag;

})();