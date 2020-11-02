
function getAvgColor(url, callback) {
  function loadImage(src, success) {
    var img = new Image()
    img.src = src
    img.onload = success
  }
  
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  loadImage(url, function(e) {
    var w = this.width, h = this.height
    ctx.canvas.width = w
    ctx.canvas.height = h
    ctx.drawImage(this, 0, 0)

    var imageData = ctx.getImageData(0, 0, w, h).data
    var colors = []
    for (var i = 0; i < imageData.length; i += 4) {
      colors.push({
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
        a: imageData[i + 3]
      })
    }
    var total = colors.reduce(function(total, color, index) {
      total.r += color.r
      total.g += color.g
      total.b += color.b
      total.a += color.a
      return total
    }, {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    })

    var pixels = w * h
    var avg = {
      r: total.r / pixels,
      g: total.g / pixels,
      b: total.b / pixels,
      a: total.a / pixels
    }

    callback(avg)
  })
}