(function() {

  function Magnifier() {
    this.container = document.body
    this.init()
  }

  Magnifier.prototype = {
    loadCanvas: function() {
      return html2canvas(this.container).then(canvas => {
        this.canvas = canvas
        return canvas
      })
    },
    createElement() {
      this.el = document.createElement('div')
      css(this.el, {
        position: 'fixed',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        boxShadow: '0 0 2px rgba(100, 100, 100, .5), 0 2px 2px rgba(0, 0, 0, .07)',
        border: '1px solid #ccc',
        zIndex: '99999999',
        overflow: 'hidden'
      })
      document.body.appendChild(this.el)
    },
    init: function() {
      this.pixelRatio = window.devicePixelRatio <= 1 ? 2 : window.devicePixelRatio
      this.loadCanvas().then(canvas => {
        this.createElement()
        canvas.toBlob(blob => {
          var url = URL.createObjectURL(blob)
          var img = new Image()
          img.src = url
          if (this.pixelRatio <= 1) {
            img.width = canvas.width * 2
            img.height = canvas.height * 2
          }
          this.el.appendChild(img)
          this.layer = img
          document.body.addEventListener('mousemove', throttle(e => {
            var offsetX = -e.x * this.pixelRatio + this.el.clientWidth / 2
            var offsetY = -e.y * this.pixelRatio + this.el.clientHeight / 2
            css(this.layer, {
              transform: `translate(${offsetX}px, ${offsetY}px)`
            })
            css(this.el, {
              left: e.x - this.el.clientWidth / 2,
              top: e.y - this.el.clientHeight / 2
            })
          }, 10), false)
        })

      })
    }
  }

  function css(el, styles) {
    Object.keys(styles).forEach(key => {
      el.style[key] = styles[key]
    })
  }

  function throttle(fn, delay) {
    var running = false
    return function() {
      if (running) {
        return
      }
      running = true
      fn.call(this, ...arguments)
      setTimeout(() => {
        running = false
      }, delay)
    }
  }

  window.Magnifier = Magnifier


})();