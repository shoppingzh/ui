loader.define(function(require,exports,module){

    var pageview = {};
    var $el = router.$("#" + module.id);

    console.log(require)
    console.log(exports)
    console.log(module)

    console.log(router.$("#btn1"))
    console.log($el)

    return pageview;
})