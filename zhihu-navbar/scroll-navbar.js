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

  function ScrollNavbar(options) {
    var opts = options || {}
    this.upEl = opts.up
    this.downEl = opts.down
    onBodyScroll(this.onScroll.bind(this))
  }

  ScrollNavbar.prototype = {
    onScroll: function(e) {
      this.bodyScroll = document.body.scrollTop
    }
  }

  window.ScrollNavbar = ScrollNavbar


})();