loader.define(function(require,exports,module){

    var pageview = {};

    bui.config.imageview = {
        download: function(src) {
            bui.hint('开始下载：' + src)
        }
    }

    router.$("main").on('click', 'img', function() {
        var $img = $(this)
        bui.imageview({
            src: $img.attr('src')
        })
    })

    return pageview;
})