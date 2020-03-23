(function (ui, $) {

    ui.extend({
        name: 'imageview',
        config: {
            rotate: 0
        },
        callback: function (config) {
            var that = this;
            var uiDialog;

            that.init = function (options) {
                var opts = $.extend(true, {}, config, options);

                uiDialog = bui.dialog({ render: true }).create({
                    title: null,
                    buttons: null,
                    content: template(opts),
                    className: 'bui-dialog-imageview',
                    fullscreen: true,
                    opacity: 0
                });

                var $dialog = uiDialog.selector();

                // 基本交互操作
                $dialog.on('click', '.bui-dialog-close', function () {
                    uiDialog.close()
                })

                $dialog.on('click', '.bui-imageview-toolbar', function() {
                    $(this).removeClass('hidden')
                })

                $dialog.on('click', '.bui-imageview-inner', function() {
                    $dialog.find('.bui-imageview-toolbar').toggleClass('hidden') 
                })


                // 绑定工具栏操作
                bindActions(opts)

                uiDialog.on('open', function() {
                    // 1秒后隐藏操作栏
                    setTimeout(function() {
                        $dialog.find('.bui-imageview-toolbar').addClass('hidden') 
                    }, 1000);
                    // 缩放操作(使用pinchzoom插件，如果当前环境没有，那就不使用)
                    if (typeof PinchZoom !== 'undefined') {
                        new PinchZoom.default($dialog.find('.bui-imageview-inner')[0], {});
                    }
                })

                uiDialog.open();
                return that;
            }

            function bindActions(opts) {
                var $dialog = uiDialog.selector()
                // 下载
                $dialog.on('click', '#action-download', function() {
                    if (opts.download) {
                        opts.download(opts.src)
                    }
                })
                // 旋转
                $dialog.on('click', '#action-rotate', function() {
                    opts.rotate = opts.rotate + 90;
                    var css = {
                        transform: `rotate(${opts.rotate}deg)`
                    }
                    $dialog.find('.bui-imageview-inner img').css(css)
                })
                // 更多
                $dialog.on('click', '#action-more', function() {
                    if (opts.more) {
                        opts.more()
                    }
                })
            }

            function template(opts) {
                var h = `
                    <div class="bui-imageview" style="height: 100%">
                        <div class="bui-imageview-inner bui-box-align-middle bui-box-center">
                            <img class="image" src="${opts.src}">
                        </div>
                        <div class="bui-imageview-toolbar bui-box">
                            <div class="span1"></div>
                            <div class="bui-value">
                                ${templateActions()}
                            </div>
                        </div>
                    </div>
                    <div class="bui-dialog-close"><i class="icon-close"></i></div>
                `;

                function templateActions() {
                    var h = '';
                    if (opts.download) {
                        h += '<i id="action-download" class="bci-xiazai bui-imageview-action"></i>';
                    }
                    h += '<i id="action-rotate" class="bci-xuanzhuan bui-imageview-action"></i>';
                    if (opts.more) {
                        h += '<i id="action-more" class="bci-gengduo bui-imageview-action"></i>';
                    }
                    return h;
                }

                return h;
            }

            return that.init();

        }
    })


})(bui, window.libs);