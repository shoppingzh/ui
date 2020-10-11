var dialog = document.querySelector('.dialog')
var overlay = document.querySelector('.overlay')

overlay.addEventListener('click', function(e) {
  e.stopPropagation()
  dialog.style.height = '0'
  this.style.display = 'none'
}, false)

document.querySelector('.phone').addEventListener('click', function(e) {
  overlay.style.display = 'block'
  dialog.style.height = '75%'
}, false)