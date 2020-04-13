loader.define(function(require,exports,module){

    var pageview = {};

    router.$(".bui-page").on('click', '#normal', function() {
        bui.tips({
            msg: '普通提示(点击后将记录，之后不再提示)',
            
        })
    })

    router.$(".bui-page").on('click', '#fullscreen', function() {
        bui.tips({
            template: function() {
                return '<div class="bui-box-align-middle bui-box-align-center" style="height: 100%">Hello, world!</div>'
            }
        })
    })

    router.$(".bui-page").on('click', '#step', function() {
        bui.tips({
            template: [function() {
                return '<div class="bui-box-align-middle bui-box-align-center" style="height: 100%">第一步</div>'
            }, function() {
                return '<div class="bui-box-align-middle bui-box-align-center" style="height: 100%">第二步了！</div>'
            }, function() {
                return '<div class="bui-box-align-middle bui-box-align-center" style="height: 100%">最后一步！！！</div>'
            }]
        })
    })

    return pageview;
})