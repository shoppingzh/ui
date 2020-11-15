(function() {

  function YoutubeVideo(el) {
    this.$el = el
    this.init()
  }

  YoutubeVideo.prototype = {
    init: function() {
      this.$video = this.$el.querySelector('.video__inner')
      this.$overlay = this.$el.querySelector('.video__overlay')
      this.size = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }
      this.videoSize = {
        width: this.$video.offsetWidth,
        height: this.$video.offsetHeight
      }
      this.$video.addEventListener('touchstart', e => {
        var touch = e.touches[0]
        this.offsetY = touch.clientY - this.$el.offsetTop
      }, false)
      this.$video.addEventListener('touchmove', e => {
        var touch = e.touches[0]
        this.move(touch.clientX, touch.clientY)
      }, false)
    },
    move: function(x, y) {
      console.log(`${x}, ${y}`)
      var offsetY = y - this.offsetY
      var maxY = this.size.height - this.videoSize.height
      if (offsetY < 0) {
        offsetY = 0
      }
      if (offsetY > maxY) {
        offsetY = maxY
      }
      this.$el.style.top = offsetY
      this.$overlay.style.opacity = 1 - offsetY / (this.size.height - this.videoSize.height)
    }
  }


  window.YoutubeVideo = YoutubeVideo

})()