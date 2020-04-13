(function (ui, $) {

    /**
     * BUI图片查看器 bui.imageview
     */
    ui.extend({
        name: 'imageview',
        config: {
            rotate: 0
        },
        callback: buiImageviewCallback
    })

    /**
     * BUI温馨提示组件 bui.tips
     */
    ui.extend({
        name: 'tips',
        config: {
            timeout: 3000
        },
        callback: buiTipsCallback
    });

    // =========================================================================================
    
    function buiImageviewCallback(config) {
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

        return that.init(config);

    }

    function buiTipsCallback(config) {
        var that = this;
        var uiStorage = ui.storage(1000);

        that.init = function (option) {
            var opts = $.extend(true, {}, config, option);
            // 如果没有传入id，则默认使用当前模块对应的页面id
            if (!opts.id) {
                opts.id = router.currentModule().pid
            }
            if (!existRecord(opts.id)) {
                if (opts.msg) {
                    tipsHint(opts);
                }
                if (opts.template) {
                    tipsCustomer(opts);
                }
            }
            return that;
        }

        /**
         * 使用bui.hint提示
         * @param {Object} opts 
         */
        function tipsHint(opts) {
            var id = ui.guid();
            var uiTips = bui.hint({
                content: `
                    <div id="${id}" style="width: 100%;">
                        <b>${opts.msg || '提示信息'}</b>
                        <i class="icon-error" style="position: absolute; right: .1rem; top: 50%; margin-top: -.2rem;"></i>
                    </div>
                `,
                skin: 'primary',
                timeout: opts.timeout,
                autoClose: opts.timeout > 0,
                position: 'bottom',
                appendTo: ui.$(opts.appendTo || 'main')
            });
            $(`#${id}`).on('click', function () {
                uiTips && uiTips.remove();
                record(opts.id, opts.msg);
            });
        }

        /**
         * 使用bui.dialog自定义提示
         * @param {Object} opts 
         */
        function tipsCustomer(opts) {
            var template = opts.template;
            // 所有帧
            var frames = isFunc(template) ? [template] : template;
            if (!frames.length) {
                return;
            }
            var uiDialog = bui.dialog({
                render: true,
            }).create({
                title: null,
                content: frames.shift()() || '',
                buttons: null,
                effect: 'showIn',
                className: 'tips-dialog',
                fullscreen: true,
                appendTo: ui.$(opts.appendTo || '.bui-page'),
            });
            uiDialog.selector().css({
                backgroundColor: 'rgba(0, 0, 0, 0)',
                color: '#fff'
            }).on('click', function () {
                var $dialog = $(this);
                var frame = frames.shift();
                if (frame) {
                    $dialog.find('.bui-dialog-main').html(frame() || '');
                } else {
                    uiDialog.close();
                }
            });
            uiDialog.on('close', function () {
                uiDialog.destroy();
                record(opts.id, opts.msg);
            });
            uiDialog.open();
        }

        /**
         * 是否存在该提示
         * @param {String} id 
         */
        function existRecord(id) {
            return isValidID(id) && uiStorage.get('appTips', id, 'id');
        }

        /**
         * 记录提示信息
         * @param {String} id 
         * @param {String} msg 提示内容
         */
        function record(id, msg) {
            if (isValidID(id)) {
                uiStorage.set('appTips', {
                    id: id,
                    msg: msg,
                    timestamp: new Date().getTime()
                }, 'id');
            }
        }

        // 检测传入的id是否合理
        function isValidID(id) {
            return typeof id === 'string' && id.trim();
        }

        return this.init(config);
    }

    function isFunc(func) {
        return typeof func === 'function';
    }


})(bui, window.libs);