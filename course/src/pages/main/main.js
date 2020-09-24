/**
 * 首页模块
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
loader.define(function(require, exports, module) {

    var pageview = {};

    // 模块初始化定义
    pageview.init = function() {

        // 焦点图 js 初始化:
        var uiSlide = bui.slide({
            id:"#uiSlide",
            height: 340,
            autopage: true,
            autoplay: true,
            interval: 3000,
            loop: true
        })

        router.$('.bui-page').on('click', '.left-menu__item', function() {
            $(this).addClass('left-menu__item--active').siblings('.left-menu__item').removeClass('left-menu__item--active');
        })

    }

    // 初始化
    pageview.init();

    // 输出模块
    return pageview;
})
